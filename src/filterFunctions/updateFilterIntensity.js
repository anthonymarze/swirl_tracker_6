export default function updateFilterIntensity(filter, intensity) {
    filter[1][2] = intensity;
    const newFilter = filter;

    return newFilter;
}