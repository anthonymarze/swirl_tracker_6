export default function loadAllPointsHighlighted(map) {
    map.addLayer({
        "id": "all-points-highlighted",
        "type": "circle",
        "source": "all-points",
        "paint": {
            "circle-color": [
                'step',
                ["to-number", ["get", "windspeed"]],
                "#5ebaff",
                34, "#00faf4",
                64, "#ffffcc",
                83, "#ffe775",
                96, "#ffc140",
                113, "#ff8f20",
                137, "#ff6060"
            ],
            "circle-blur": 15
        },
        "layout": {
            "visibility": "none"
        }
    })
};