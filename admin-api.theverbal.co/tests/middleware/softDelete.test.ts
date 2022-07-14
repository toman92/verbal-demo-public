import request from "supertest";
import express from "express";
import authRoute from "../../routes/api/auth";
import { CrudRouter } from "../../routes/crudRouter";
import { seedUser } from "../../prisma/seeds/seedUser";
import { Role, User } from "common/build/prisma/client";
import { defaultAdminUser } from "../../prisma/required-seeding/userSeeder";
import { softDelete } from "../../middleware/softDelete";
import { PrismaClientSingleton } from "../../prisma/prismaClientSingleton";
import { seedRole } from "../../prisma/seeds/seedRole";
const prisma = PrismaClientSingleton.getInstance();
const app = express();
let token = "";
let user: User;
let role: Role;

describe("Soft Delete middleware", () => {
    beforeEach(async function () {
        app.request.prisma = prisma;
        app.use(softDelete);
        app.use(express.json());
        app.use("/api/auth", authRoute);
        app.use(
            "/api/user",
            new CrudRouter(
                {
                    list: "FullAccess",
                    get: "FullAccess",
                    post: "FullAccess",
                    delete: "FullAccess",
                    patch: "FullAccess",
                },
                "user",
            ).routes(),
        );

        role = await seedRole({ name: "Admin" });
        user = await seedUser({ password: defaultAdminUser.password, roleId: role.id });

        const response = await request(app)
            .post("/api/auth")
            .set("Accept", "application/json")
            .send({ email: user.email, password: defaultAdminUser.password })
            .expect(200);

        const text: { token: string } = JSON.parse(response.text);
        token = text.token;
    });

    test("should soft-delete when soft delete model is used", async () => {
        const randomUser = await seedUser();

        await request(app)
            .delete(`/api/user/${randomUser.id}`)
            .set("x-auth-token", token)
            .set("Accept", "application/json")
            .expect(200);

        const userInfo = await prisma.user.findFirst({ where: { id: randomUser.id } });
        expect(userInfo).toBeNull();
    });

    test("should not return soft-deleted models", async () => {
        const randomUser = await seedUser();

        await request(app)
            .delete(`/api/user/${randomUser.id}`)
            .set("x-auth-token", token)
            .set("Accept", "application/json")
            .expect(200);

        await request(app)
            .get(`/api/user/${randomUser.id}`)
            .set("x-auth-token", token)
            .set("Accept", "application/json")
            .expect(404)
            .then((value) => {
                expect(value.body).toEqual({});
            });
    });
});
