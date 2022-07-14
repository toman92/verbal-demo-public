import { User } from "common/build/prisma/client";
import { getData, patchData, postData } from "./rest";
import { objectToQueryString } from "../../utils/api";
import { ListParameters } from "../../../../common/build/api-parameters/common";
import { DashboardStats } from "common/build/api-parameters/users";

export const list = async (args: Record<string, unknown> & ListParameters): Promise<{ items: User[]; total: number }> =>
    await getData(`/user${objectToQueryString(args)}`);

export const get = async (id: number, args: Record<string, unknown>): Promise<User> =>
    await getData(`/user/${id}${objectToQueryString(args)}`);

export const add = async (user: User): Promise<Response> => await postData(`/user/`, { ...user });

export const update = async (id: number, editedUser: Partial<User>): Promise<Response> =>
    await patchData(`/user/${id}`, { ...editedUser });

export const getStats = (): Promise<DashboardStats> => getData("/user/dashboard-stats");
