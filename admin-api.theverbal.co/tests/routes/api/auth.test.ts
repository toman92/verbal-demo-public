import request from "supertest";
import express from "express";
import route from "../../../routes/api/auth";
import { seedUser } from "../../../prisma/seeds/seedUser";
import { User } from "common/build/prisma/client";
import { PrismaClientSingleton } from "../../../prisma/prismaClientSingleton";
import { defaultAdminUser } from "../../../prisma/required-seeding/userSeeder";
import faker from "faker";

const app = express();
const prisma = PrismaClientSingleton.getInstance();
app.request.prisma = prisma;
let user = null as User | null;
app.use(express.json());
app.use("/api/auth", route);

describe("GET /api/auth", function () {
    beforeEach(async function () {
        user = await seedUser({ email: faker.internet.email(), password: defaultAdminUser.password });
    });

    it("does not return the user details", async function () {
        await request(app)
            .get("/api/auth/")
            .send({ user })
            .set("x-auth-token", "token")
            .set("Accept", "application/json")
            .expect(401);
    });

    it("returns the user details", async function () {
        const response = await request(app)
            .post("/api/auth/")
            .set("Accept", "application/json")
            .send({ email: user?.email, password: defaultAdminUser.password })
            .expect(200);

        const text: { token: string } = JSON.parse(response.text);

        await request(app)
            .get("/api/auth/")
            .send({ user })
            .set("x-auth-token", text.token)
            .set("Accept", "application/json")
            .expect(200);
    });
});

describe("POST /api/auth", function () {
    beforeEach(async function () {
        user = await seedUser({ email: faker.internet.email(), password: defaultAdminUser.password });
    });

    it("authenticates successfully", async function () {
        await request(app)
            .post("/api/auth/")
            .set("Accept", "application/json")
            .send({ email: user?.email, password: defaultAdminUser.password })
            .expect(200)
            .then((response) => {
                expect(response.text).toContain('{"token":');
            });
    });

    it("fails to authenticate", function (done) {
        request(app)
            .post("/api/auth/")
            .set("Accept", "application/json")
            .send({ email: "fake@docker.com", password: "docker" })
            .expect(400, done);
    });

    it("fails to authenticate with invalid email", function (done) {
        request(app)
            .post("/api/auth/")
            .set("Accept", "application/json")
            .send({ email: "fakeocker.com", password: "docker" })
            .expect(400, done);
    });

    it("fails to authenticate with invalid password", function (done) {
        request(app)
            .post("/api/auth/")
            .send({ email: "fake@docker.com", password: "" })
            .set("Accept", "application/json")
            .expect(400, done);
    });
});
