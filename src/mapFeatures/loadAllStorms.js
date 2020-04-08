export default function loadAllStorms(map, startYear) {
    map.addLayer({
    "id": "all-storms",
    "type": "line",
    "source": "all-storms",
    "paint": {
        "line-width": 4,
        "line-color": [
            'step',
            ["get", "max_windspeed"],
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
        "visibility": "visible"
    },
    "filter": ["==", "season", startYear]
    })
};