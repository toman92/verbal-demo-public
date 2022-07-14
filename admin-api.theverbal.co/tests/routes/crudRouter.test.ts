import request from "supertest";
import express from "express";
import authRoute from "../../routes/api/auth";
import { Role, User } from "common/build/prisma/client";
import { CrudRouter } from "../../routes/crudRouter";
import { seedUser } from "../../prisma/seeds/seedUser";
import { defaultAdminUser } from "../../prisma/required-seeding/userSeeder";
import { fakeUser } from "common/build/fakes/fakeUser";
import faker from "faker";
import { softDelete } from "../../middleware/softDelete";
import { PrismaClientSingleton } from "../../prisma/prismaClientSingleton";
const prisma = PrismaClientSingleton.getInstance();
const app = express();
let token = "";
let user: User;

describe("crudRouter", function () {
    beforeEach(async function () {
        app.use(softDelete);
        app.use((req, _res, next) => {
            req.prisma = PrismaClientSingleton.getInstance();
            next();
        });
        app.use(express.json());
        app.use("/api/auth", authRoute);
        app.use(
            "/api/user",
            new CrudRouter(
                {
                    list: "UserView",
                    get: "UserView",
                    post: "UserUpdate",
                    delete: "UserDelete",
                    patch: "UserUpdate",
                },
                "user",
            ).routes(),
        );

        const role = (await prisma.role.findFirst({ where: { name: "Admin" } })) as Role;
        user = await seedUser({ email: faker.internet.email(), password: defaultAdminUser.password, roleId: role.id });

        const response = await request(app)
            .post("/api/auth")
            .set("Accept", "application/json")
            .send({ email: user.email, password: defaultAdminUser.password })
            .expect(200);

        const text: { token: string } = JSON.parse(response.text);
        token = text.token;
    });

    describe("GET /api/user/:id", function () {
        it("gets user", async function () {
            await request(app)
                .get(`/api/user/${user.id}`)
                .set("x-auth-token", token)
                .set("Accept", "application/json")
                .expect(200)
                .then((value) => {
                    expect(value.text).toContain(JSON.parse(JSON.stringify(user.email)));
                });
        });

        it("doesn't get user when no permissions set", async function () {
            app._router = express();
            app.use((req, _res, next) => {
                req.prisma = PrismaClientSingleton.getInstance();
                next();
            });
            app.use(express.json());
            app.use("/api/auth", authRoute);
            app.use("/api/user", new CrudRouter({}, "user").routes());

            await request(app)
                .get(`/api/user/${user.id}`)
                .set("x-auth-token", token)
                .set("Accept", "application/json")
                .expect(404);
        });
    });

    describe("POST /api/user/", function () {
        it("creates user", async function () {
            const fakeUserDetails = fakeUser({
                email: faker.internet.email("John"),
                password: defaultAdminUser.password,
                roleId: user.roleId,
            });
            const userDetails = {
                firstName: fakeUserDetails.firstName,
                lastName: fakeUserDetails.lastName,
                email: fakeUserDetails.email,
                password: fakeUserDetails.password,
                roleId: user.roleId,
            };

            await request(app)
                .post(`/api/user`)
                .send(userDetails)
                .set("x-auth-token", token)
                .set("Accept", "application/json")
                .expect(200)
                .then(async (value) => {
                    expect(JSON.parse(value.text).email).toEqual(fakeUserDetails.email);
                });
        });
    });

    describe("DELETE /api/user/", function () {
        it("deletes user", async function () {
            const randomUser = await seedUser({ email: faker.internet.email(), roleId: user.roleId });

            await request(app)
                .delete(`/api/user/${randomUser.id}`)
                .set("x-auth-token", token)
                .set("Accept", "application/json")
                .expect(200);

            const userInfo = await prisma.user.findFirst({ where: { id: randomUser.id } });
            expect(userInfo).toBeNull();
        });
    });

    describe("PUT /api/user/", function () {
        it("updates user", async function () {
            const email = "newEmail@test.com";

            await request(app)
                .patch(`/api/user/${user.id}`)
                .set("x-auth-token", token)
                .set("Accept", "application/json")
                .send({ email: email })
                .expect(200)
                .then((value) => {
                    expect(JSON.parse(value.text).email).toEqual(email);
                });
        });
    });

    describe("GET /api/user", function () {
        it("gets all users with count", async function () {
            await request(app)
                .get("/api/user")
                .set("x-auth-token", token)
                .set("Accept", "application/json")
                .expect(200)
                .then((value) => {
                    expect(JSON.parse(value.text).total).toBeGreaterThan(0);
                });
        });
    });
});
