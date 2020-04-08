export default function loadAllStormsHighlighted(map) {
    map.addLayer({
        "id": "all-storms-highlighted",
        "type": "line",
        "source": "all-storms",
        "paint": {
            "line-width": 10,
            "line-gap-width": 3,
            "line-blur": 15,
            "line-color": "#696969"
        },
        "layout": {
            "visibility": "visible"
        },
        "filter": ["==", "serial_num", ""]
    },
        "all-storms"
    )
};