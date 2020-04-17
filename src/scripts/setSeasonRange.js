export default function setSeasonRange(startYear, endYear) {
    let seasonRange = [];

    for (let i = startYear; i <= endYear; i++) {
        seasonRange.push(i);
    }

    // SETS START YEAR INPUT VALUES //

    document.getElementById("start-year").value = startYear;
    document.getElementById("start-year").max = endYear;

    // SETS END YEAR INPUT VALUES //

    document.getElementById("end-year").value = endYear;
    document.getElementById("end-year").min = startYear;

    return seasonRange;
}