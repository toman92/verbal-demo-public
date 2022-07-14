import { Prisma, PrismaClient } from "common/build/prisma/client";
import { DMMFClass } from "common/build/prisma/client/runtime";
import { prismaSoftDeleteUse } from "../middleware/softDelete";

export class PrismaClientSingleton {
    private static instance: PrismaClient;

    public static getInstance(): PrismaClient & { _dmmf: DMMFClass } {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new PrismaClient();

            prismaSoftDeleteUse(PrismaClientSingleton.instance);

            PrismaClientSingleton.instance.$use((params: Prisma.MiddlewareParams, next) => {
                return next(params);
            });
        }

        return PrismaClientSingleton.instance as PrismaClient & { _dmmf: DMMFClass };
    }
}
