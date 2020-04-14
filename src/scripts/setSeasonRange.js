export default function setSeasonRange(startYear, endYear) {
    let seasonRange = [];

    for (let i = startYear; i <= endYear; i++) {
        seasonRange.push(i);
    }

    return seasonRange;
}