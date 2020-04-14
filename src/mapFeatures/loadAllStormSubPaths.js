export default function loadAllStormSubPaths(map, seasonRange) {
    map.addLayer({
        "id": "all-storm-sub-paths",
        "type": "line",
        "source": "all-storm-sub-paths",
        "paint": {
            "line-width": 4,
            "line-color": ["get", "color"]
        },
        "layout": {
            "visibility": "none"
        },
        "filter": ["in", "season"].concat(seasonRange)
    })
};