export default function loadAllPoints(map, filter) {
    map.addLayer({
        "id": "all-points",
        "type": "circle",
        "source": "all-points",
        "source-layer": "mapbox_storm_data-17ruvm",
        "paint": {
            // "circle-radius": {
            //     "base": 1.75,
            //     "stops": [[12, 2], [22, 180]]
            // },
            "circle-color": [
                "step",
                ["get", "wind"],
                "#5ebaff",
                34, "#00faf4",
                64, "#ffffcc",
                83, "#ffe775",
                96, "#ffc140",
                113, "#ff8f20",
                137, "#ff6060"
            ]
        },
        "layout": {
            "visibility": "none"
        },
        "filter": filter
    })
};

