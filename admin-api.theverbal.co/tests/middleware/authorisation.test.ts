import { fakeUser } from "common/build/fakes/fakeUser";
import { fakeRole } from "common/build/fakes/fakeRole";
import { Role, User, Permission } from "common/build/prisma/client";
import { NextFunction, Request, Response } from "express";
import permit from "../../middleware/authorisation";
import { seedUser } from "../../prisma/seeds/seedUser";
import { seedRole } from "../../prisma/seeds/seedRole";
import { seedRolePermission } from "../../prisma/seeds/seedRolePermission";
import { PrismaClientSingleton } from "../../prisma/prismaClientSingleton";

describe("Authorization middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const nextFunction: NextFunction = jest.fn();
    let request: (request: Request, response: Response, next: NextFunction) => Promise<void>;

    beforeEach(() => {
        request = permit(Permission.StoryCreate);
        mockRequest = {};
        mockResponse = {
            status: jest.fn(),
            json: jest.fn(),
        };
    });

    test("without user", async () => {
        const expectedResponse = {
            message: "Forbidden",
        };

        await request(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toBeCalledWith(403);
        expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test("with invalid user", async () => {
        const expectedResponse = {
            message: "Forbidden",
        };

        mockRequest.user = { ...fakeUser(), Role: { ...fakeRole(), RolePermissions: [] } };

        await request(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toBeCalledWith(403);
        expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test("with incorrect permission", async () => {
        const expectedResponse = {
            message: "Forbidden",
        };

        const user = await seedUser({
            roleId: (
                await seedRole({
                    name: "Coordinator",
                })
            ).id,
        });

        await seedRolePermission({
            roleId: user.roleId,
            permission: Permission.StoryView,
        });

        const fullUser = await PrismaClientSingleton.getInstance().user.findFirst({
            where: { id: user.id },
            include: { Role: { include: { RolePermissions: true } } },
        });

        mockRequest.user = { ...fullUser } as User & { Role: Role };

        await request(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toBeCalledWith(403);
        expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test("with correct permission", async () => {
        const role = await seedRole({ name: "Admin" });
        const user = await seedUser({ roleId: role.id });
        await seedRolePermission({ roleId: role.id, permission: Permission.FullAccess });

        const fullUser = await PrismaClientSingleton.getInstance().user.findFirst({
            where: { id: user.id },
            include: { Role: { include: { RolePermissions: true } } },
        });

        mockRequest.user = { ...fullUser } as User & { Role: Role };

        request = permit(Permission.FullAccess);
        await request(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toBeCalledTimes(1);
    });
});
