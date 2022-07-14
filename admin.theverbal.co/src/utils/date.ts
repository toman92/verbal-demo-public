import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";

export const date = (date: Date | string, format?: string): string => {
    dayjs.extend(isToday);

    const dayjsDate = dayjs(date);

    return dayjsDate.isToday()
        ? dayjsDate.format(format ?? "[Today at] H:mm")
        : dayjsDate.format(format ?? "ddd D MMM YYYY [at] H:mm");
};
