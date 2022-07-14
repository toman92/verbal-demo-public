import path from "path";
import dotenv from "dotenv";
import auth from "./routes/api/auth";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import compression from "compression";
import { UserCrudRouter } from "./routes/api/users";
import { PrismaClientSingleton } from "./prisma/prismaClientSingleton";
import PromiseRouter from "express-promise-router";

const isProduction = process.env.NODE_ENV === "production";

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });
const app = express();

// error handler middleware
const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
    console.error(error);
    if (response.headersSent) {
        return next(error);
    }
    response.status(500).send();
};
app.use(errorHandler);

// Init Middleware
app.use((req, _res, next) => {
    req.prisma = PrismaClientSingleton.getInstance();
    next();
});
app.use(express.json());
app.use(
    cors({
        origin: process.env.APP_URL,
        allowedHeaders: ["x-auth-token", "content-type"],
        credentials: true,
    }),
);
app.use(compression());

const router = PromiseRouter();
app.use(router);

// Define Routes
router.use("/api/auth", auth);

router.use(
    "/api/user",
    new UserCrudRouter(
        { post: "UserCreate", patch: "UserUpdate", get: "UserView", list: "UserView", delete: "UserDelete" },
        "user",
    ).routes(),
);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

// bind router error handler, must be after route binding
router.use(errorHandler);

const port = isProduction ? 80 : 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
