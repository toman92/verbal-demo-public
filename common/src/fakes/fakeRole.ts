import { Role } from "../../build/prisma/client";
import { FakerSingleton } from "./fakerSingleton";

export function fakeRole(partial?: Partial<Role>): Role {
    const faker = FakerSingleton.getInstance();
    const role = {
        id: partial?.id,
        name: partial?.name ?? `${faker.commerce.color()}`,
    } as Role;

    return role;
}
