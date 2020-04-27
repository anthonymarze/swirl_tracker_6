export default function updateFilterSeason(filter, season) {
    filter[2][2] = season;
    const newFilter = filter;

    return newFilter;
}