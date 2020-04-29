import { getMaxBounds } from './get_max_bounds';
import { basinNames } from './basin_names';
import { intensityCalculator } from './intensity_calculator';
import toggleDetailedPaths from './toggleDetailedPaths';

export default function showStormInfo(map, feature) {
    map.getCanvas().style.cursor = 'pointer';

    map.fitBounds(getMaxBounds(feature.geometry.coordinates),
        { padding: { top: 150, bottom: 150, left: 550, right: 150 } });

    map.setFilter("all-storms", ["==", ["get", "serial_num"], `${feature.properties.serial_num}`]);
    map.setFilter("all-storm-sub-paths", ["==", ["get", "serial_num"], `${feature.properties.serial_num}`]);
    map.setFilter("all-points", ["==", ["get", "serial_num"], `${feature.properties.serial_num}`]);

    document.getElementById("sample-name").innerHTML = `${feature.properties.name} (${feature.properties.month}, ${feature.properties.season})`;
    document.getElementById("sample-num").innerHTML = `storm #${feature.properties.num} of the season`;
    document.getElementById("sample-basin").innerHTML = `${basinNames(feature.properties.basin)}`;
    document.getElementById("sample-max-wind").innerHTML = `${feature.properties.max_windspeed} knots`;
    document.getElementById("sample-min-pressure").innerHTML = `${feature.properties.min_pressure} millibars`;
    document.getElementById("sample-center").innerHTML = `${feature.properties.center.toUpperCase()}`;

    document.getElementById("info-box").style.display = "block";
    document.getElementById("start-year").style.border = "2px solid red";
    document.getElementById("start-year").value = `${feature.properties.season}`;

    document.getElementById("end-year").style.border = "2px solid red";
    document.getElementById("end-year").value = `${feature.properties.season}`;

    document.getElementById("name").style.border = "2px solid red";
    document.getElementById("name").value = `${feature.properties.name}`;

    // swith to detailed paths

    toggleDetailedPaths(map);

    // BASIN INPUT STYLING //

    document.querySelectorAll(".basin").forEach(basin => {
        const abbreviation = basin.innerHTML[0] + basin.innerHTML[basin.innerHTML.indexOf(" ") + 1]
        if (abbreviation !== feature.properties.basin) {
            basin.style.color = "black";
        }
    })

    document.querySelectorAll(".month").forEach(month => {
        if (month.innerHTML !== feature.properties.month) {
            month.style.color = "black";
        }
    })

    // INTESINTY INPUT STYLING //

    document.querySelectorAll(".intensity").forEach(intensity => {
        intensity.style.backgroundColor = "#ffffff";
    })

    const intensityVal = intensityCalculator(feature.properties.max_windspeed, "value");
    const intensityColor = intensityCalculator(feature.properties.max_windspeed, "color");

    document.getElementById(`hi-${intensityVal}`).style.backgroundColor = intensityColor;

    // DEACTIVATES BOTTOM PANEL //

    document.querySelectorAll(".bottom-panel input").forEach(input => {
        input.style.opacity = "0.5";
        input.style.pointerEvents = "none";
    })

    document.querySelectorAll(".bottom-panel button").forEach(input => {
        input.style.opacity = "0.5";
        input.style.pointerEvents = "none";
    })

    document.querySelectorAll(".bottom-panel ul").forEach(input => {
        input.style.opacity = "0.5";
        input.style.pointerEvents = "none";
    })

    // KEEPS TWO BUTTONS ACTIVE //

    // document.getElementById("detailed-paths").style.opacity = "1";
    // document.getElementById("detailed-paths").style.pointerEvents = "auto";
    document.getElementById("reset-fields").style.opacity = "1";
    document.getElementById("reset-fields").style.pointerEvents = "auto";
}