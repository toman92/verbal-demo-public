import { Role } from "common/build/prisma/client";
import { PrismaClientSingleton } from "../prismaClientSingleton";

export async function seedRole(partialRole?: Partial<Role>): Promise<Role> {
    const prisma = PrismaClientSingleton.getInstance();
    const role = {
        name: partialRole?.name ?? "Admin",
    } as Role;

    return await prisma.role.upsert({
        create: role,
        update: role,
        where: { name: role.name },
    });
}
