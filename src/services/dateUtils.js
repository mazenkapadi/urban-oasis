export const getDateRange = (rangeType) => {
    const today = new Date();
    let startDate, endDate;

    if (rangeType === "week") {
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const daysUntilSunday = (7 - today.getDay()) % 7;

        endDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + daysUntilSunday,
            23,
            59,
            59
        );
    } else if (rangeType === "month") {
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const daysRemainingInMonth = lastDayOfMonth.getDate() - today.getDate();

        if (daysRemainingInMonth < 10) {
            const daysUntilSunday = (7 - today.getDay()) % 7;
            const nextMonday = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + daysUntilSunday + 1
            );
            startDate = new Date(nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate());

            endDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 30,
                23,
                59,
                59
            );
        } else {
            const daysUntilSunday = (7 - today.getDay()) % 7;
            const nextMonday = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + daysUntilSunday + 1
            );
            startDate = new Date(nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate());

            endDate = new Date(
                lastDayOfMonth.getFullYear(),
                lastDayOfMonth.getMonth(),
                lastDayOfMonth.getDate(),
                23,
                59,
                59
            );
        }
    }

    return {startDate, endDate};
};