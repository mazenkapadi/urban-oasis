export const formatDateForFilter = (filter) => {
    const today = new Date();
    let startDate, endDate;

    switch (filter) {
        case 'Today':
            startDate = new Date(today.setHours(0, 0, 0, 0));
            endDate = new Date(today.setHours(23, 59, 59, 999));
            break;
        case 'Tomorrow':
            startDate = new Date(today.setDate(today.getDate() + 1));
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(today.setHours(23, 59, 59, 999));
            break;
        case 'Weekend':
            const day = today.getDay();
            const diffToSaturday = day === 6 ? 0 : 6 - day;
            startDate = new Date(today.setDate(today.getDate() + diffToSaturday));
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(today.setDate(today.getDate() + 1));
            endDate.setHours(23, 59, 59, 999);
            break;
        default:
            return null;
    }

    return { start: startDate.getTime(), end: endDate.getTime() };
};
