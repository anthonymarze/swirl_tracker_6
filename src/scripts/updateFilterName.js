export default function updateFilterName(filter, name) {
    filter[3][1] = name;
    const newFilter = filter;

    return newFilter;
}