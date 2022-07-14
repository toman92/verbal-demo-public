import request from "supertest";
import express from "express";
import { UserCrudRouter } from "../../../routes/api/users";
import authRoute from "../../../routes/api/auth";
import { PrismaClientSingleton } from "../../../prisma/prismaClientSingleton";
import { Role, User } from "common/build/prisma/client";
import { defaultAdminUser } from "../../../prisma/required-seeding/userSeeder";
import { seedUser } from "../../../prisma/seeds/seedUser";
import faker from "faker";
import { seedStory } from "../../../prisma/seeds/seedStory";
const prisma = PrismaClientSingleton.getInstance();
const app = express();
let token = "";
app.request.prisma = prisma;
app.use(express.json());
app.use(
    "/api/user",
    new UserCrudRouter(
        { post: "FullAccess", patch: "FullAccess", get: "FullAccess", list: "FullAccess" },
        "user",
    ).routes(),
);
app.use("/api/auth", authRoute);

describe("POST api/user", function () {
    beforeEach(async function () {
        const user = await seedUser({ email: faker.internet.email(), password: defaultAdminUser.password });
        const response = await request(app)
            .post("/api/auth")
            .set("Accept", "application/json")
            .send({ email: user.email, password: defaultAdminUser.password })
            .expect(200);

        const text: { token: string } = JSON.parse(response.text);
        token = text.token;
    });

    it("Does not create a new user when not authenticated", async function () {
        const role = (await prisma.role.findFirst({ where: { name: "Admin" } })) as Role;
        await request(app)
            .post("/api/user/")
            .set("Accept", "application/json")
            .set("x-auth-token", "token")
            .send({
                firstName: "sean",
                lastName: "test",
                email: "tester@mail.com",
                password: "password123",
                roleId: role.id,
            })
            .expect(401);
    });

    it("Does not create a new user with non-unique email", async function () {
        const role = (await prisma.role.findFirst({ where: { name: "Admin" } })) as Role;
        const notUniqueUser = await seedUser({
            firstName: "Not",
            lastName: "Unique",
            email: "not@unique.com",
            roleId: role.id,
        });

        await request(app)
            .post("/api/user/")
            .set("Accept", "application/json")
            .set("x-auth-token", token)
            .send({
                firstName: notUniqueUser.firstName,
                lastName: notUniqueUser.lastName,
                email: notUniqueUser.email,
                password: notUniqueUser.password,
                roleId: notUniqueUser.roleId,
            })
            .expect(400)
            .then((response) => expect(response.text).toContain("Email address already in use"));
    });

    it("Successfully creates an admin user", async function () {
        const role = (await prisma.role.findFirst({ where: { name: "Admin" } })) as Role;
        await request(app)
            .post("/api/user/")
            .set("Accept", "application/json")
            .set("x-auth-token", token)
            .send({
                firstName: "Test",
                lastName: "Admin",
                email: "admin2@unique.com",
                password: "password123",
                roleId: role.id,
            })
            .expect(200);

        const adminUser = (await prisma.user.findUnique({
            where: { email: "admin2@unique.com" },
            include: { Role: true },
        })) as User & { Role: Role };

        expect(adminUser).toBeTruthy();

        expect(adminUser.Role.id).toBe(role.id);
    });

    it("Successfully creates a coordinator user", async function () {
        const role = (await prisma.role.findFirst({ where: { name: "Coordinator" } })) as Role;

        await request(app)
            .post("/api/user/")
            .set("Accept", "application/json")
            .set("x-auth-token", token)
            .send({
                firstName: "Test",
                lastName: "Coordinator",
                email: "coordinator2@unique.com",
                password: "password123",
                roleId: role.id,
            })
            .expect(200);

        const coordUser = (await prisma.user.findUnique({
            where: { email: "coordinator2@unique.com" },
            include: { Role: true },
        })) as User & { Role: Role };

        expect(coordUser).toBeTruthy();

        expect(coordUser.Role.id).toBe(role.id);
    });
});

describe("when querying Widget Data", function () {
    beforeEach(async function () {
        const user = await seedUser({ email: faker.internet.email(), password: defaultAdminUser.password });
        const response = await request(app)
            .post("/api/auth")
            .set("Accept", "application/json")
            .send({ email: user.email, password: defaultAdminUser.password })
            .expect(200);

        const text: { token: string } = JSON.parse(response.text);
        token = text.token;
    });

    it("should return the correct data structure", async function () {
        const emptyStructure = {
            totalStories: 0,
        };
        await request(app)
            .get("/api/user/dashboard-stats")
            .set("Accept", "application/json")
            .set("x-auth-token", token)
            .expect(200)
            .then((value) => {
                expect(value.text).toEqual(JSON.stringify(emptyStructure));
            });
    });

    it("should return the total stories", async function () {
        for (let i = 0; i < 5; i++) {
            await seedStory();
        }

        await request(app)
            .get("/api/user/dashboard-stats")
            .set("Accept", "application/json")
            .set("x-auth-token", token)
            .expect(200)
            .then((value) => {
                expect(JSON.parse(value.text).totalStories).toBe(5);
            });
    });
});
