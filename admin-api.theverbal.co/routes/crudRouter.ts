/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Permission, PrismaClient } from "common/build/prisma/client";
import * as express from "express";
import auth from "../middleware/authentication";
import permit from "../middleware/authorisation";
import { Delegate } from "./api/interfaces/delegate.interface";
import PromiseRouter from "express-promise-router";
import { ListParameters, QueryStringParameters } from "common/build/api-parameters/common";

export type crudPermissions = {
    post?: Permission | boolean;
    list?: Permission | boolean;
    get?: Permission | boolean;
    patch?: Permission | boolean;
    delete?: Permission | boolean;
};

export class CrudRouter<Entity extends Record<string, unknown> = Record<string, unknown>> {
    protected crossOrgPermission?: Permission;
    protected searchableFields: string[] = [];

    protected router = PromiseRouter();

    constructor(
        protected permission: crudPermissions,
        protected delegate: keyof PrismaClient,
        protected scopedToOrganisation: boolean = true,
    ) {}

    public routes(): express.Router {
        this.intialiseRoutes(this.permission);
        return this.router;
    }

    protected getAuthMiddleware(): express.RequestHandler {
        return auth;
    }

    public intialiseRoutes(permissions: crudPermissions): void {
        const authMiddleware = this.getAuthMiddleware();
        if (permissions.get) {
            this.router.get("/:id", authMiddleware, permit(permissions.get), this.get);
        }

        if (permissions.patch) {
            this.router.patch("/:id", authMiddleware, permit(permissions.patch), this.update);
        }

        if (permissions.delete) {
            this.router.delete("/:id", authMiddleware, permit(permissions.delete), this.delete);
        }

        if (permissions.post) {
            this.router.post("/", authMiddleware, permit(permissions.post), this.create);
        }

        if (permissions.list) {
            this.router.get("/", authMiddleware, permit(permissions.list), this.list);
        }
    }

    createRecordBodyPayload = (request: express.Request): Partial<Entity> => {
        return request.body;
    };

    validateListRequest: (request: express.Request) => Promise<void> = async (): Promise<void> => {
        return;
    };

    validateGetRequest = async (request: express.Request): Promise<void> => await this.validateListRequest(request);

    create = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        try {
            const delegated = request.prisma[this.delegate] as unknown as Delegate;
            const query = await delegated.create({
                data: this.createRecordBodyPayload(request),
            });
            response.json(query);
        } catch (error) {
            console.error(error);
            response.status(500).send(error);
        }

        return response;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createListCriteria = (_request: express.Request): Promise<Record<string, unknown>> => Promise.resolve({});

    createItemCriteria = (request: express.Request): Promise<Record<string, unknown>> =>
        this.createListCriteria(request);

    createItemLockedCriteria = <T extends Record<string, unknown>>(
        request: express.Request,
        itemCriteria: T,
    ): T & { where: { id: number } } => ({
        ...itemCriteria,
        where: {
            ...(itemCriteria?.where as Record<string, unknown>),
            id: parseInt(request.params.id),
        },
    });

    createSearchTermWhereClause = (searchTerm: string | undefined): Record<string, unknown> | undefined => {
        if (searchTerm && this.searchableFields.length === 0) {
            throw Error("no searchable fields");
        }
        return searchTerm && this.searchableFields.length > 0
            ? {
                  OR: this.searchableFields?.map((field) => ({
                      [field]: {
                          contains: searchTerm,
                      },
                  })),
              }
            : undefined;
    };

    list = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        try {
            await this.validateListRequest(request);

            const delegated = request.prisma[this.delegate] as unknown as Delegate;
            const { skip = "0", take = "10", searchTerm } = request.query as QueryStringParameters<ListParameters>;

            const searchTermWhere = this.createSearchTermWhereClause(searchTerm);
            const { where: listWhere, ...listCriteria } = await this.createListCriteria(request);

            const criteria = {
                skip: parseInt(skip),
                take: parseInt(take),
                where: {
                    ...searchTermWhere,
                    ...(listWhere as Record<string, unknown>),
                },
                ...listCriteria,
            };

            const results = await delegated.findMany({ ...criteria });

            // use the count api to efficiently count results
            const count = await delegated.count({
                ...criteria,
                // remove criteria components that we shouldn't pass to count
                include: undefined,
                select: undefined,
                take: undefined,
                skip: undefined,
            });
            response.json({ items: [...results], total: count });
        } catch (error) {
            console.error(error);
            response.status(500).send(error);
        }

        return response;
    };

    get = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        try {
            await this.validateGetRequest(request);

            const delegated = request.prisma[this.delegate] as unknown as Delegate;
            const criteria = this.createItemLockedCriteria(request, await this.createItemCriteria(request));

            const record = await delegated.findFirst(criteria)!;
            if (record) {
                response.json(record);
            } else {
                response.status(404).send("Record not found");
            }
        } catch (error) {
            console.error(error);
            response.status(500).send(error);
        }

        return response;
    };

    update = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        try {
            const delegated = request.prisma[this.delegate] as unknown as Delegate;
            const query = await delegated.update(
                this.createItemLockedCriteria(request, {
                    data: this.createRecordBodyPayload(request),
                }),
            )!;

            response.json(query);
        } catch (error) {
            console.log(error);
            response.status(500).send(error);
        }

        return response;
    };

    delete = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        try {
            const delegated = request.prisma[this.delegate] as unknown as Delegate;
            const query = await delegated.delete(this.createItemLockedCriteria(request, {}))!;
            response.json(query);
        } catch (error) {
            console.error(error);
            response.status(500).send(error);
        }

        return response;
    };
}
