import { intensityColor } from './intensity_calculator';
import setSeasonRange from './setSeasonRange.js';
import createDefaultFilter from './createDefaultFilter.js';

export default function resetFields(map, mapCenter, zoomLevel){

    let intensityVals = ["TD", "TS", "1", "2", "3", "4", "5"];
    let startYear = 2000;
    let endYear = 2017;
    let seasonRange = setSeasonRange(2000, 2005);
    let stormName = "";
    let basinList = ["NI", "SI", "WP", "EP", "SP", "NA", "SA"];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // SETS DEFAULT FILTER //

    const defaultFilter = createDefaultFilter(intensityVals, seasonRange, stormName, basinList, months);

    // NOT SURE WHAT IS HAPPENING WITH SET TIMEOUT HERE //

    setTimeout(
        map.flyTo({
            zoom: zoomLevel,
            center: mapCenter,
            essential: true
        })
        , 1000);

    // STYLES INPUTS TO ORIGINAL STATE //

    document.getElementById("detailed-paths").style.backgroundColor = "#fff";
    document.getElementById("detailed-paths").style.border = "1px solid #696969";

    document.getElementById("name").value = "";
    document.getElementById("name").style.border = "1px solid #696969";

    document.getElementById("start-year").min = startYear;
    document.getElementById("start-year").style.border = "1px solid #696969";

    document.getElementById("end-year").max = endYear;
    document.getElementById("end-year").style.border = "1px solid #696969";

    intensityVals.forEach(intensity => {
        document.getElementById(`hi-${intensity}`).style.backgroundColor = intensityColor(intensity);
    })

    document.querySelectorAll(".basin").forEach(basin => {
        basin.style.color = "red";
        basin.style.fontWeight = "bold";
    })

    document.querySelectorAll(".month").forEach(month => {
        month.style.color = "red";
        month.style.fontWeight = "bold";
    })

    // ANIMATES RESET FIELDS BUTTON //

    document.getElementById("reset-fields").style.border = "2px solid red";
    document.getElementById("start-year").style.border = "2px solid red";
    document.getElementById("end-year").style.border = "2px solid red";

    setTimeout(() => {
        document.getElementById("reset-fields").style.border = "1px solid #696969";
        document.getElementById("start-year").style.border = "1px solid #696969";
        document.getElementById("end-year").style.border = "1px solid #696969";
    }, 1000);

    // CLEARS INFO BOX INFORMATION //

    document.getElementById("info-box").style.display = "none";

    // REACTIVATES BOTTOM PANEL //

    document.querySelectorAll(".bottom-panel input").forEach(input => {
        input.style.opacity = "1";
        input.style.pointerEvents = "auto";
    })

    document.querySelectorAll(".bottom-panel button").forEach(input => {
        input.style.opacity = "1";
        input.style.pointerEvents = "auto";
    })

    document.querySelectorAll(".bottom-panel ul").forEach(input => {
        input.style.opacity = "1";
        input.style.pointerEvents = "auto";
    })

    // DEACTIVATES DETAILED PATHS //

    document.getElementById("detailed-paths").style.opacity = "0.5";
    document.getElementById("detailed-paths").style.pointerEvents = "none";

    // RETURNS VALUES TO ORIGINAL SETTINGS

    return ([intensityVals, startYear, endYear, seasonRange, stormName, basinList, months, defaultFilter]);
}