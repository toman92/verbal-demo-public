import { Permission, Role, RolePermission, User } from "../../build/prisma/client";

export const userHasPermission = (
    user: (User & { Role?: Role & { RolePermissions?: RolePermission[] } }) | undefined,
    permission: Permission,
): boolean => {
    return !!user?.Role?.RolePermissions?.find(
        (rolePermission: RolePermission) =>
            rolePermission.permission === permission || rolePermission.permission === "FullAccess",
    );
};
