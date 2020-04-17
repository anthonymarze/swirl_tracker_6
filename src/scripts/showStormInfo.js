import { getMaxBounds } from './get_max_bounds';
import { basinNames } from './basin_names';
export default function showStormInfo(map, feature) {
    map.getCanvas().style.cursor = 'pointer';

    map.fitBounds(getMaxBounds(feature.geometry.coordinates),
        { padding: { top: 150, bottom: 150, left: 150, right: 150 } });

    map.setFilter("all-storms", ["==", ["get", "serial_num"], `${feature.properties.serial_num}`]);
    map.setFilter("all-storm-sub-paths", ["==", ["get", "serial_num"], `${feature.properties.serial_num}`]);
    map.setFilter("all-points", ["==", ["get", "serial_num"], `${feature.properties.serial_num}`]);

    document.getElementById("sample-name").innerHTML = `${feature.properties.name} (${feature.properties.season})`;
    document.getElementById("sample-num").innerHTML = `storm #${feature.properties.num} of the season`;
    document.getElementById("sample-basin").innerHTML = `${basinNames(feature.properties.basin)}`;
    document.getElementById("sample-max-wind").innerHTML = `${feature.properties.max_windspeed} knots`;
    document.getElementById("sample-min-pressure").innerHTML = `${feature.properties.min_pressure} millibars`;
    document.getElementById("sample-center").innerHTML = `${feature.properties.center.toUpperCase()}`;

    document.getElementById("info-box").style.display = "block";
    document.getElementById("name").value = `${feature.properties.name}`;
}