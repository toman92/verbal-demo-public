import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import auth from "../../middleware/authentication";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { User } from "common/build/prisma/client";
import PromiseRouter from "express-promise-router";

const router = PromiseRouter();

export type UserSessionTokenPayload = {
    user: {
        id: number;
    };
};

export const createSessionToken: (user: User) => string = (user) => {
    const payload: UserSessionTokenPayload = {
        user: {
            id: user.id,
        },
    };
    if (!process.env.jwtSecret) {
        throw new Error("jwtSecret is missing!");
    }
    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "5 days" });
};

/**
 * GET /api/auth
 * @return {User} 200 - User found
 */
router.get("/", auth, async (req: Request, res: Response) => {
    try {
        const user = await req.prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                Role: {
                    include: {
                        RolePermissions: true,
                    },
                },
            },
        });

        res.json({
            ...user,
            password: undefined,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

/**
 * POST /api/auth
 * @param {string} email.form.required - This is the users email address - application/json
 * @param {string} password.form.required - This is the users unhashed password - application/json
 * @return {Token} 200 - token response
 */
router.post(
    "/",
    [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await req.prisma.user.findUnique({
                where: { email: email },
            });

            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password ?? "");

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            res.json({ token: createSessionToken(user) });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    },
);

export default router;
