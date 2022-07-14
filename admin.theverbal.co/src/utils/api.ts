import axios from "axios";

const addQueryStart = (queryString: string) => (queryString ? `?${queryString}` : "");

export const objectToQueryString = (obj: Record<string, unknown>): string =>
    addQueryStart(
        Object.entries(obj)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                        typeof value === "string" ? value : JSON.stringify(value),
                    )}`,
            )
            .join("&"),
    );

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
