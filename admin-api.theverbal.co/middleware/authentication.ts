import { NextFunction, Response, Request } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { UserSessionTokenPayload } from "../routes/api/auth";

async function auth(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if not token
    if (!token || !process?.env?.jwtSecret) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // Verify token
    try {
        await jwt.verify(token, process.env.jwtSecret, async (error: VerifyErrors | null, decoded: unknown) => {
            if (error) {
                return res.status(401).json({ msg: "Token is not valid" });
            } else {
                const payload = <UserSessionTokenPayload>decoded;

                if (!payload.user) {
                    return res.status(401).json({ msg: "User is not valid" });
                }

                const user = await req.prisma.user.findUnique({
                    where: { id: payload.user.id },
                    include: { Role: { include: { RolePermissions: true } } },
                });

                if (user) {
                    req.user = { ...user };
                } else {
                    res.status(401).json({ msg: "User is not valid" });
                }

                next();
            }
        });
    } catch (err) {
        console.error("something wrong with auth middleware");
        res.status(500).json({ msg: "Server Error" });
    }
}

export default auth;
