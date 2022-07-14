import React, { Component } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../../contexts/auth.context";
import { Permission } from "common/build/prisma/client";
import Spinner from "../layout/Spinner";

type BaseRouteProps = {
    permission?: Permission;
    component: React.FC | Component;
} & RouteProps;

export const BaseRoute: React.FC<BaseRouteProps> = ({ permission, component: Component, ...routeProps }) => {
    const { isAuthenticated, isAuthenticating, hasPermission } = useAuth();
    return (
        <Route
            {...routeProps}
            render={(props) => {
                if (permission) {
                    if (!isAuthenticated) {
                        if (isAuthenticating) {
                            return <Spinner />;
                        }
                        return <Redirect to="/" />;
                    }

                    if (!hasPermission(permission)) {
                        return <Redirect to="/403" />;
                    }
                }
                return (
                    <>
                        <Component {...props} />
                    </>
                );
            }}
        />
    );
};
