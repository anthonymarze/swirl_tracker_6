export default function loadAllPoints(map, seasonRange) {
    map.addLayer({
        "id": "all-points",
        "type": "circle",
        "source": "all-points",
        "paint": {
            "circle-color": [
                'step',
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
            "visibility": "visible"
        },
        "filter": ["in", "season"].concat(seasonRange)
    })
};