import { User } from "common/build/prisma/client";
import { fakeUser } from "common/build/fakes/fakeUser";
import bcrypt from "bcryptjs";
import { seedRole } from "./seedRole";
import { PrismaClientSingleton } from "../prismaClientSingleton";

export async function seedUser(partialUser?: Partial<User>): Promise<User> {
    const prisma = PrismaClientSingleton.getInstance();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(partialUser?.password ?? `verbal`, salt);

    const roleId = partialUser?.roleId ?? (await seedRole()).id;

    const user = { ...fakeUser(partialUser), password, roleId };

    const dbUser = await prisma.user.upsert({
        create: user,
        update: user,
        where: { email: user.email },
        include: { Role: true },
    });

    return dbUser;
}
