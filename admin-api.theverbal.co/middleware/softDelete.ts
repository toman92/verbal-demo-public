import { Prisma, PrismaClient } from "common/build/prisma/client";
import { NextFunction, Response, Request } from "express";
import { PrismaClientSingleton } from "../prisma/prismaClientSingleton";
const softDeleteModels: Prisma.ModelName[] = ["User"];

export function softDelete(request: Request, _response: Response, next: NextFunction): void {
    request.prisma = request.prisma ?? PrismaClientSingleton.getInstance();
    prismaSoftDeleteUse(request.prisma);

    next();
}

export function prismaSoftDeleteUse(prisma: PrismaClient): void {
    prisma.$use((params, next) => {
        // Check incoming query type
        if (params.model && softDeleteModels.indexOf(params.model) > -1) {
            if (params.action == "delete") {
                // Delete queries
                // Change action to an update
                params.action = "update";
                params.args["data"] = { deleted: true };
            }
            if (params.action == "deleteMany") {
                // Delete many queries
                params.action = "updateMany";
                if (params.args.data != undefined) {
                    params.args.data["deleted"] = true;
                } else {
                    params.args["data"] = { deleted: true };
                }
            }

            if (params.action == "findUnique" || params.action == "findFirst" || params.action == "findMany") {
                // Change to findFirst - you cannot filter
                // by anything except ID / unique with findUnique
                if (params.action === "findUnique") {
                    params.action = "findFirst";
                }

                if (params.args.where != undefined) {
                    if (params.args.where.deleted == undefined) {
                        // Exclude deleted records if they have not been expicitly requested
                        params.args.where["deleted"] = false;
                    }
                } else {
                    params.args["where"] = { deleted: false };
                }
            }
        }

        return next(params);
    });
}
