export default function updateFilterMonth(filter, month) {
    filter[5][2] = month;
    const newFilter = filter;

    return newFilter;
}