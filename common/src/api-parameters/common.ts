export type ListParameters = {
    skip?: number;
    take?: number;
    searchTerm?: string;
    organisationId?: number;
};

export type QueryStringParameters<T> = {
    readonly [P in keyof T]?: string;
};
