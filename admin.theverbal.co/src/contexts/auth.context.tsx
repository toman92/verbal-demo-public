import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Permission, Role, RolePermission, User } from "common/build/prisma/client";
import { get, loginUser } from "../client/api/auth";
import { node } from "prop-types";
import { userHasPermission } from "common/build/utils/permissions";

interface AuthContextI {
    user?: User & {
        Role: Role & { RolePermissions: RolePermission[] };
    };
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    loading: boolean;
    token: string | null;

    hasPermission: (permission: Permission) => boolean;

    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    addToken: (token: string) => void;
}

const AuthContext = React.createContext({} as AuthContextI);

const storedToken = window.localStorage.getItem("token");

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<
        User & {
            Role: Role & { RolePermissions: RolePermission[] };
        }
    >();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(!!storedToken);
    const [loading, setLoading] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(storedToken);

    useEffect(() => {
        setLoading(true);
        updateUser();
    }, [token]);

    const addToken = useCallback((token: string) => {
        localStorage.setItem("token", token);
        setToken(token);
    }, []);

    const updateUser = useCallback(() => {
        if (token) {
            setIsAuthenticating(true);
            get()
                .then(
                    (
                        user: User & {
                            Role: Role & { RolePermissions: RolePermission[] };
                        },
                    ) => {
                        setUser(user);
                        setIsAuthenticated(true);
                    },
                )
                .catch(() => {
                    setUser(undefined);
                    setIsAuthenticated(false);
                })
                .finally(() => {
                    setIsAuthenticating(false);
                    setLoading(false);
                });
        } else {
            setUser(undefined);
            setIsAuthenticated(false);
            setIsAuthenticating(false);
            setLoading(false);
        }
    }, [token]);

    const setSessionToken = useCallback((sessionToken) => {
        localStorage.setItem("token", sessionToken);
        setToken(sessionToken);
    }, []);

    const login = useCallback((email, password) => {
        return new Promise<void>((resolve, reject) => {
            setLoading(true);

            loginUser(email, password)
                .then(async (response) => {
                    if (response.ok) {
                        const { token: tokenFromApi }: { token: string } = await response.json();
                        setSessionToken(tokenFromApi);
                        resolve();
                    } else {
                        setToken(null);
                        const { errors } = await response.json();
                        if (errors && errors.length > 0) {
                            reject(errors[0].msg);
                        } else {
                            reject("Error logging in");
                        }
                    }
                })
                .catch(() => {
                    setToken(null);
                    reject("Error logging in");
                })
                .finally(() => {
                    setLoading(false);
                });
        });
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(undefined);
    }, []);

    const hasPermission = useCallback((permission: Permission) => userHasPermission(user, permission), [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAuthenticating,
                loading,
                token,
                login,
                logout,
                addToken,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: node,
};

export const useAuth = (): AuthContextI => React.useContext(AuthContext);
