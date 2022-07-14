import { User } from "common/build/prisma/client";
import { seedUser } from "../seeds/seedUser";

export const defaultAdminUser = {
    firstName: "verbal",
    lastName: "admin",
    email: `admin@verbal.com`,
    password: `verbal`,
} as User;

export const defaultStoryUser = {
    firstName: "story",
    lastName: "admin",
    email: "story@verbal.com",
    password: "verbal",
} as User;

export const defaultCoordinatorUser = {
    firstName: "verbal",
    lastName: "coord",
    email: "coord@verbal.com",
    password: "verbal",
} as User;

export async function userSeeder(): Promise<void> {
    await seedUser({
        ...defaultAdminUser,
    });

    await seedUser({ ...defaultStoryUser });

    await seedUser({ ...defaultCoordinatorUser });

    console.log(`Admin user upserted: ${defaultAdminUser.email} with password ${defaultAdminUser.password}`);
    console.log(`Story admin user upserted: ${defaultStoryUser.email} with password ${defaultStoryUser.password}`);
    console.log(
        `Coordinator user upserted: ${defaultCoordinatorUser.email} with password ${defaultCoordinatorUser.password}`,
    );
}
