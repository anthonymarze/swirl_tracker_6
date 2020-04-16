import loadAllPoints from './loadAllPoints.js';
import loadAllStorms from './loadAllStorms.js';
import loadAllStormsHighlighted from './loadAllStormsHighlighted.js';
import loadAllStormSubPaths from './loadAllStormSubPaths.js';
import loadAllPointsHighlighted from './loadAllPointsHighlighted.js';

export default function loadAllSources(map, defaultFilter) {
    map.addSource("all-storms", {
        type: 'geojson',
        data: "https://anthonymarze.com/assets/2000_storms.geojson"
    });

    map.addSource("all-storm-sub-paths", {
        type: 'geojson',
        data: "https://anthonymarze.com/assets/2000_storm_sub_paths.geojson",
        buffer: 0
    });

    map.addSource("all-points", {
        type: 'geojson',
        data: "https://anthonymarze.com/assets/2000_storm_data_points.geojson"
    });

    loadAllStormSubPaths(map, defaultFilter);

    loadAllStorms(map, defaultFilter);

    loadAllStormsHighlighted(map);

    loadAllPoints(map, defaultFilter);

    loadAllPointsHighlighted(map);
}

