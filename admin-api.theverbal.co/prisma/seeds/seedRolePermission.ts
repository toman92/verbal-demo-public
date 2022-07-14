import { Permission, RolePermission } from "common/build/prisma/client";
import { PrismaClientSingleton } from "../prismaClientSingleton";
import { seedRole } from "./seedRole";

export async function seedRolePermission(partialRolePermissions?: Partial<RolePermission>): Promise<RolePermission> {
    const prisma = PrismaClientSingleton.getInstance();

    const rolePermissions = {
        permission: partialRolePermissions?.permission ?? Permission.FullAccess,
        roleId: partialRolePermissions?.roleId ?? (await seedRole()).id,
    } as RolePermission;

    return await prisma.rolePermission.upsert({
        create: rolePermissions,
        update: rolePermissions,
        where: { roleId_permission: { permission: rolePermissions.permission, roleId: rolePermissions.roleId } },
    });
}
