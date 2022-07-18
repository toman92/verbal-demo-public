import * as express from "express";
import { crudPermissions, CrudRouter } from "../crudRouter";
import { Permission, prisma, Prisma, PrismaClient, User } from "common/build/prisma/client";
import { DashboardStats, LastThirtyDays } from "common/build/api-parameters/users";
import UserCreateInput = Prisma.UserCreateInput;
import RoleWhereUniqueInput = Prisma.RoleWhereUniqueInput;
import permit from "../../middleware/authorisation";
import { date } from "../../helpers/date";
import {dateFromNow} from "common/src/utils/dateFromNow"

export const ERROR_EMAIL_IN_USE = "Email In Use";

export const createUser: (
    client: PrismaClient,
    user: Pick<UserCreateInput, "firstName" | "lastName" | "email">,
    roleConnection: RoleWhereUniqueInput,
) => Promise<User> = async (client, { firstName, lastName, email }, roleConnection) => {
    const existingUser = await client.user.findUnique({ where: { email } });

    if (existingUser || !email) {
        throw new Error(ERROR_EMAIL_IN_USE);
    }

    const basicUserArgs: UserCreateInput = {
        firstName,
        lastName,
        email,
        password: "",
        Role: { connect: roleConnection },
    };

    const user = await client.user.create({
        data: {
            ...basicUserArgs,
        },
        include: {
            Role: true,
        },
    });

    return user;
};

export class UserCrudRouter extends CrudRouter {
    protected searchableFields: (keyof User & string)[] = ["firstName", "lastName"];

    intialiseRoutes(permissions: crudPermissions): void {
        const authMiddleware = this.getAuthMiddleware();
        this.router.get("/dashboard-stats", authMiddleware, permit(Permission.WidgetView), this.dashboardStats);
        this.router.get("/last-30-days",authMiddleware,permit(Permission.WidgetView), this.lastThirtyDays);
        super.intialiseRoutes(permissions);
    }

    create = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        const { firstName, lastName, email, roleId } = request.body;

        try {
            try {
                await createUser(
                    request.prisma,
                    { firstName, lastName, email },
                    {
                        id: roleId,
                    },
                );
                response.status(200).send();
            } catch (error) {
                // was complaining error is of type unknown - now checking it's instanceof Error
                if (error instanceof Error && error.message === ERROR_EMAIL_IN_USE) {
                    return response
                        .status(400)
                        .json({ message: "Email address already in use, please use a different email address." });
                } else {
                    throw error;
                }
            }
        } catch (err) {
            console.error(err);
            response.status(500).send();
        }

        return response;
    };

    dashboardStats = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        // count all stories
        let storiesLength = 0;
        const stories = await request.prisma.story.findMany();
        if (stories && stories.length > 0) {
            storiesLength = stories.length;
        }

        response.json(<DashboardStats>{
            totalStories: storiesLength,
        });

        return response;
    };

    lastThirtyDays = async(request: express.Request, response: express.Response): Promise<express.Response> => {
        //count how many stories have been added in the previous 30 days
        const today = date;
        const amountLast30 = await request.prisma.story.findMany(
        {
            where:  
            {
                createdDate: 
                
                {
                        lte: dateFromNow(0,false),
                        gte: dateFromNow(30,false)
                },
            },
        }
        );

        response.json(<LastThirtyDays>{
            pre30DaysStories: amountLast30.length,
        });

        return response;
    };
}
