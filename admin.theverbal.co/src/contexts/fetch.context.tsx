import React, { PropsWithChildren, useEffect, useState } from "react";

export interface FetchContextI<T> {
    item?: T & { [key: string]: unknown };
    fetching: boolean;
    error?: string;

    fetchItem: (id: number, args?: Record<string, unknown>) => Promise<void>;
}

type useFetchProps<T> = PropsWithChildren<{
    noun: string;
    getItem: (id: number, args: Record<string, unknown>) => Promise<T & { [key: string]: unknown }>;
    includes?: Record<string, unknown>;
    fetchOnload?: boolean;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FetchContext = React.createContext({} as FetchContextI<any>);

export function FetchProvider<T>(props: useFetchProps<T>): JSX.Element {
    const { getItem, noun, children, includes, fetchOnload = false } = props;

    const [item, setItem] = useState<(T & { [key: string]: unknown }) | undefined>();
    const [fetching, setFetching] = useState<boolean>(fetchOnload);
    const [error, setError] = useState<string | undefined>();

    const fetchItem = (id: number, args: Record<string, unknown> = {}) => {
        return new Promise<void>((resolve, reject) => {
            setFetching(true);
            getItem(id, { ...args, ...includes })
                .then(async (item: T & { [key: string]: unknown }) => {
                    setItem(item);
                    resolve();
                })
                .catch(() => {
                    setItem(undefined);
                    setError(`Unable to fetch ${noun}`);
                    reject(`Unable to fetch ${noun}`);
                })
                .finally(() => {
                    setFetching(false);
                });
        });
    };

    useEffect(() => {
        if (fetchOnload) {
            fetchItem(0);
        }
    }, []);

    return <FetchContext.Provider value={{ item, fetching, error, fetchItem }}>{children}</FetchContext.Provider>;
}

export function useFetch<T>(): FetchContextI<T> {
    return React.useContext(FetchContext);
}
