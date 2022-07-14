import { Role, RolePermission, User } from "common/build/prisma/client";
import { getData, postData } from "./rest";

export const register = async (userDetails: User): Promise<Response> => await postData("/users", userDetails);

export const loginUser = async (email: string, password: string): Promise<Response> =>
    await postData("/auth", { email, password });

export const get = async (): Promise<User & { Role: Role & { RolePermissions: RolePermission[] } }> =>
    await getData("/auth");
