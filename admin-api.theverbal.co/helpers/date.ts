import dayjs from "dayjs";

export const date = (date: Date | string, format?: string): string =>
    dayjs(date).format(format ?? "D MMM YYYY [at] h:mma");
