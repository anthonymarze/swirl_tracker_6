export default function hoverOverFeature(map, popup, feature, layer) {
    let filterLayer = "";

    if(layer.includes("storm")) {
        filterLayer = "all-storms-highlighted";
    } else if (layer.includes("point")) {
        filterLayer = "all-point-highlighted";
    }

    map.getCanvas().style.cursor = 'pointer';

    popup.setHTML(`<h3>${feature.properties.name} (${feature.properties.season})</h3>`);
    popup.addTo(map);

    map.setFilter(filterLayer, ["==", ["get", "serial_num"], `${feature.properties.serial_num}`]);
}