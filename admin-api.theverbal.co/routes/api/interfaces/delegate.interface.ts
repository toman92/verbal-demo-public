/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Prisma } from "common/build/prisma/client";

type Dict = { [k: string]: any };

type DictWithId = {
    id?: number;
    [k: string]: any;
};

type SelectWithId = {
    id?: boolean;
    [k: string]: any;
};

export interface Delegate {
    findMany: (arg?: {
        select?: SelectWithId | null;
        include?: Dict | null;
        where?: Dict;
        orderBy?: Prisma.Enumerable<any>;
        cursor?: Dict;
        take?: number;
        skip?: number;
        distinct?: Prisma.Enumerable<any>;
    }) => any;

    findFirst: (arg: {
        select?: SelectWithId | null;
        rejectOnNotFound?: Prisma.RejectOnNotFound;
        include?: Dict | null;
        where?: DictWithId;
        orderBy?: Prisma.Enumerable<any>;
        cursor?: Dict;
        take?: number;
        skip?: number;
        distinct?: Prisma.Enumerable<any>;
    }) => any;

    create: (arg: { select?: SelectWithId | null; include?: Dict | null; data: any }) => any;

    update: (arg: { select?: SelectWithId | null; include?: Dict | null; data: any; where: DictWithId }) => any;

    delete: (arg: { select?: SelectWithId | null; include?: Dict | null; where: DictWithId }) => any;

    count: (arg?: {
        select?: SelectWithId | null;
        include?: never;
        where?: Dict;
        orderBy?: Prisma.Enumerable<any>;
        cursor?: Dict;
        take?: never;
        skip?: never;
        distinct?: Prisma.Enumerable<any>;
    }) => any;

    [k: string]: any;
}
