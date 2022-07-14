export function dateFromNow(days?: number, future = true): Date {
    const forwardInDays = days ?? 30;

    const now = new Date();
    if (future) {
        now.setDate(now.getDate() + forwardInDays);
    } else {
        now.setDate(now.getDate() - forwardInDays);
    }

    return now;
}
