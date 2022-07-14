import { RolePermission, User, PrismaClient } from "common/build/prisma/client";

declare global {
    namespace Express {
        interface Request {
            user: User & {
                Role: Role & { RolePermissions: RolePermission[] };
            };
            prisma: PrismaClient;
        }
        interface Response {
            sseSetup: () => void;
            sseSend: (data: unknown, sessionId: number) => void;
        }
    }
}
