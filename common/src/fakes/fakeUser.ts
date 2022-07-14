import { User } from "../../build/prisma/client";
import { FakerSingleton } from "./fakerSingleton";

export function fakeUser(partial?: Partial<User>): User {
    const faker = FakerSingleton.getInstance();
    const firstName = partial?.firstName ?? `${faker.name.firstName()}`;
    const lastName = partial?.lastName ?? `${faker.name.lastName()}`;
    const user = {
        id: partial?.id,
        firstName: firstName,
        lastName: lastName,
        email: partial?.email ?? faker.internet.email(firstName),
        password: partial?.password ?? "fakeHash",
        roleId: partial?.roleId,
        deleted: partial?.deleted ?? false,
    } as User;

    return user;
}
