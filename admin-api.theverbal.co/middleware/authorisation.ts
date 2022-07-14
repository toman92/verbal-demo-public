import { Permission } from "common/build/prisma/client";
import { userHasPermission } from "common/build/utils/permissions";
import { NextFunction, Request, Response } from "express";

function permit(requiredPermission: Permission | boolean) {
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        if (
            (typeof requiredPermission === "string" && userHasPermission(request.user, requiredPermission)) ||
            requiredPermission === true
        ) {
            next();
        } else {
            response.status(403);
            response.json({ message: "Forbidden" });
        }
    };
}

export default permit;
