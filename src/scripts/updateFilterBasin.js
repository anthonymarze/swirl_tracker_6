export default function updateFilterBasin(filter, basin) {
    filter[4][2] = basin;
    const newFilter = filter;

    return newFilter;
}