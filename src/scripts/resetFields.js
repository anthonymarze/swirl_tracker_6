import { intensityColor } from './intensity_calculator';
import setSeasonRange from './setSeasonRange.js';
import createDefaultFilter from './createDefaultFilter.js';

export default function resetFields(map, mapCenter, zoomLevel){

    let intensityVals = ["TD", "TS", "1", "2", "3", "4", "5"];
    let startYear = 2005;
    let endYear = 2010;
    let seasonRange = setSeasonRange(startYear, endYear);
    let stormName = "";

    // SETS DEFAULT FILTER //

    const defaultFilter = createDefaultFilter(intensityVals, seasonRange, stormName);

    // NOT SURE WHAT IS HAPPENING WITH SET TIMEOUT HERE //

    setTimeout(
        map.flyTo({
            zoom: zoomLevel,
            center: mapCenter,
            essential: true
        })
        , 1000);

    // RECOLORS INPUTS TO ORIGINAL STATE //

    document.getElementById("detailed-paths").style.backgroundColor = "#fff";
    document.getElementById("name").value = "";
    document.getElementById("start-year").min = startYear;
    document.getElementById("end-year").max = endYear;

    intensityVals.forEach(intensity => {
        document.getElementById(`hi-${intensity}`).style.backgroundColor = intensityColor(intensity);
    })

    // CLEARS INFO BOX INFORMATION //

    document.getElementById("info-box").style.display = "none";

    // RETURNS VALUES TO ORIGINAL SETTINGS

    return ([intensityVals, startYear, endYear, seasonRange, stormName, defaultFilter]);
}