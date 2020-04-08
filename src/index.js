import './styles/index.scss';
import mapboxgl from 'mapbox-gl';
import { intensityCalculator, intensityColor } from './scripts/intensity_calculator.js';
import { basinNames } from './scripts/basin_names';
import { getMaxBounds } from './scripts/get_max_bounds';
import filterAll from './filterAll.js';
import loadAllPoints from './mapFeatures/loadAllPoints.js';
import loadAllStorms from './mapFeatures/loadAllStorms.js';
import loadAllStormsHighlighted from './mapFeatures/loadAllStormsHighlighted.js';
import loadAllStormSubPaths from './mapFeatures/loadAllStormSubPaths.js';
import loadAllPointsHighlighted from './mapFeatures/loadAllPointsHighlighted.js';

document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aG9ueW1hcnplIiwiYSI6ImNrMjZoOWU0MzBnOHMzbG8wZDN1NzByYnQifQ.Yb4cvywiiVs1hvKcTHCnAA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/anthonymarze/ck1rzyn8353181cowdfa754zg?optimize=true',
        center: [-77.38, 39], // starting position
        zoom: 3
    });

    let startYear = parseInt(document.getElementById("start-year").value, 10);
    let filter = ["all", 
        ["in", "intensity", "TD", "TS", "1", "2", "3", "4", "5"], 
        ["==", "season", startYear]
    ];
    
    let selected = "";

    const intensityVals = ["TD", "TS", "1", "2", "3", "4", "5"];
    const toggledVals = ["TD", "TS", "1", "2", "3", "4", "5"];
    const years = [1848];
    for(let i = 1851; i < 2020; i++) {
        years.push(i);
    }
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // var sel = document.getElementById('selDemo');
    // var opt = document.createElement('option');
    // opt.appendChild(document.createTextNode('New Option Text'));
    // opt.value = 'option value';
    // sel.appendChild(opt);

    const leaveStormHighlight = () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
        map.setFilter("all-storms-highlighted", ["==", "serial_num", ""]);
    }

    const showStormInfo = e => {
        map.getCanvas().style.cursor = 'pointer';
        let feature = e.features[0];

        selected = feature.properties.serial_num;

        map.fitBounds(getMaxBounds(feature.geometry.coordinates),
            { padding: { top: 150, bottom: 150, left: 150, right: 150 } });

        // map.setFilter("all-storms", ["==", "serial_num", `${feature.properties.serial_num}`]);
        // map.setFilter("all-points", ["==", "serial_num", `${feature.properties.serial_num}`]);

        map.setLayoutProperty("all-storm-sub-paths", "visibility", "visible");
        map.setLayoutProperty("all-points", "visibility", "visible")
        map.setLayoutProperty("all-storms", "visibility", "none");

        map.setFilter("all-storms", ["==", "serial_num", `${feature.properties.serial_num}`]);
        map.setFilter("all-storm-sub-paths", ["==", "serial_num", `${feature.properties.serial_num}`]);
        map.setFilter("all-points", ["==", "serial_num", `${feature.properties.serial_num}`]);

        // document.getElementById("sample-serial-num").innerHTML = `${feature.properties.serial_num}`;
        document.getElementById("sample-name").innerHTML = `${feature.properties.name} (${feature.properties.season})`;
        // document.getElementById("sample-season").innerHTML = `year: ${feature.properties.season}`;
        document.getElementById("sample-num").innerHTML = `storm #${feature.properties.num} of the season`;
        // document.getElementById("sample-nature").innerHTML = `nature: ${feature.properties.nature}`;
        document.getElementById("sample-basin").innerHTML = `basin: ${basinNames(feature.properties.basin)}`;
        // document.getElementById("sample-sub-basin").innerHTML = `sub-basin: ${feature.properties.sub_basin}`;
        document.getElementById("sample-max-wind").innerHTML = `maximum windspeed: ${feature.properties.max_windspeed} knots`;
        document.getElementById("sample-min-pressure").innerHTML = `minimum pressure: ${feature.properties.min_pressure} millibars`;
        document.getElementById("sample-center").innerHTML = `recording center: ${feature.properties.center.toUpperCase()}`;
        // document.getElementById("sample-track-type").innerHTML = `track type: ${feature.properties.track_type}`;
    }

    const popup = new mapboxgl.Popup({
        closeButton: false
    });

    map.on('load', () => {
        
        map.addControl(new mapboxgl.NavigationControl());
        map.addSource("all-storms", {
            type: 'geojson',
            data: "https://anthonymarze.com/assets/all_storms.geojson"
        });

        // map.addSource("all-storm-sub-paths", {
        //     type: 'geojson',
        //     data: "https://anthonymarze.com/assets/all_storm_sub_paths.geojson",
        //     buffer: 0
        // });

        // map.addSource("all-points", {
        //     type: 'geojson',
        //     data: "https://anthonymarze.com/assets/all_storm_data_points.geojson"
        // });

        loadAllStormSubPaths(map, startYear);

        loadAllStorms(map, startYear);

        loadAllStormsHighlighted(map);

        loadAllPoints(map, startYear);

        loadAllPointsHighlighted(map);
    });

    map.on("mousemove", "all-points", e => {
        map.getCanvas().style.cursor = 'pointer';
        let feature = e.features[0];

        popup.setLngLat(e.lngLat);
        popup.setHTML(`<h3>${feature.properties.name} (${feature.properties.season})</h3>`);
        popup.addTo(map);

        map.setFilter("all-points", ["==", "serial_num", `${feature.properties.serial_num}`]);
        // map.setLayoutProperty("all-points", "visibility", "visible");
    })

    map.on("mousemove", "all-storms", (e) => {
        map.getCanvas().style.cursor = 'pointer';
        let feature = e.features[0];

        popup.setLngLat(e.lngLat);
        popup.setHTML(`<h3>${feature.properties.name} (${feature.properties.season})</h3>`);
        popup.addTo(map);

        map.setFilter("all-storms-highlighted", ["==", "serial_num", `${feature.properties.serial_num}`]);
        // map.setLayoutProperty("all-storms", "visibility", "visible");
    })

    map.on("mousemove", "all-storm-sub-paths", (e) => {
        map.getCanvas().style.cursor = 'pointer';
        let feature = e.features[0];

        popup.setLngLat(e.lngLat);
        popup.setHTML(`<h3>${feature.properties.name} (${feature.properties.season})</h3>`);
        popup.addTo(map);

        map.setFilter("all-storms-highlighted", ["==", "serial_num", `${feature.properties.serial_num}`]);
        // map.setLayoutProperty("all-storms", "visibility", "visible");
    })

    map.on("click", "all-storms", (e) => {
        showStormInfo(e);
    })

    map.on("click", "all-storm-sub-paths", (e) => {
        showStormInfo(e);
    })

    map.on("mouseleave", "all-storms", () => {
        leaveStormHighlight();
    });

    map.on("mouseleave", "all-storm-sub-paths", () => {
        leaveStormHighlight();
    });

    map.on("mouseleave", "all-points", () => {
        leaveStormHighlight();
    });

    const clickedUpdate = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const val = e.target.innerHTML;

        if (val === "detailed-paths") {
            if(map.getLayoutProperty("all-storms", "visibility") === "visible") {
                map.setLayoutProperty("all-storm-sub-paths", "visibility", "visible");
                map.setLayoutProperty("all-points", "visibility", "visible");
                map.setLayoutProperty("all-storms", "visibility", "none");
                document.getElementById("detailed-paths").style.backgroundColor = "#e6e6e6";
            } 
            else if (map.getLayoutProperty("all-storms", "visibility") === "none") {
                map.setLayoutProperty("all-storms", "visibility", "visible");
                map.setLayoutProperty("all-storm-sub-paths", "visibility", "none");
                map.setLayoutProperty("all-points", "visibility", "none");
                document.getElementById("detailed-paths").style.backgroundColor = "#fff";
            }
        } else if(val === "reset-fields") {
            filter = ["all",
                ["in", "intensity", "TD", "TS", "1", "2", "3", "4", "5"],
                ["==", "season", startYear]
            ];
            filterAll(map, filter);
            map.setLayoutProperty("all-storms", "visibility", "visible");
            map.setLayoutProperty("all-storm-sub-paths", "visibility", "none");
            map.setLayoutProperty("all-points", "visibility", "none");
            document.getElementById("detailed-paths").style.backgroundColor = "#fff";
            document.getElementById("start-year").value = "2000";
            document.getElementById("name-input").value = "";
            let detailBox = document.getElementById("detail-box");
            let child = detailBox.lastChild;
            while(child) {
                detailBox.removeChild(detailBox.firstChild)
            }

            map.flyTo({
                zoom: 3,
                center: [-77.38, 39]
            });

        } else if(!toggledVals.includes(val)) {
            toggledVals.push(val);
            let newFilter = ["in", "intensity"];
            toggledVals.forEach(tVal => {
                newFilter.push(tVal)
            });

            filter.forEach(val => {
                if(val[1] === "intensity") {
                    filter[filter.indexOf(val)] = newFilter;
                }
            });

            filterAll(map, filter);
            document.getElementById(`hi-${val}`).style.backgroundColor = intensityColor(val);
        } else {
            let valIdx = toggledVals.indexOf(val);
            toggledVals.splice(valIdx, 1);
            let newFilter = ["in", "intensity"];
            toggledVals.forEach(tVal => {
                newFilter.push(tVal)
            });

            filter.forEach(val => {
                if (val[1] === "intensity") {
                    filter[filter.indexOf(val)] = newFilter;
                }
            });

            filterAll(map, filter);
            document.getElementById(`hi-${val}`).style.backgroundColor = "#FFF";
        }
    }

    const updateHoverOver = e => {
        e.target.style.backgroundColor = "#eeeeee";
    }

    const updateHoverOut = e => {
        const style = document.getElementById(e.target.id).style.backgroundColor;
        e.target.style.backgroundColor = style;
    }

    document.querySelectorAll(".update").forEach(item => {
        item.addEventListener("click", clickedUpdate);
        item.addEventListener("mousenter", updateHoverOver);
        item.addEventListener("mouseout", updateHoverOut);
    });

    const seasonUpdate = (e) => {
        let val = e.target.value;
        e.preventDefault();
        e.stopPropagation();

        let hasSeason = false;
        let newFilter = ["in", "season", parseInt(val)];

        filter.forEach(val => {
            if (val[1] === "season") {
                filter[filter.indexOf(val)] = newFilter;
                hasSeason = true;
            }
        });

        if(!hasSeason) {
            filter.push(newFilter);
        };

        filterAll(map, filter);
    }

    document.querySelectorAll(".update-season").forEach(item => {
        item.addEventListener("input", seasonUpdate);
    });

    const nameUpdate = (e) => {
        let val = e.target.value;
        e.preventDefault();
        e.stopPropagation();

        let hasName = false;
        let newFilter = ["in", "name", val.toUpperCase()];
        
        filter.forEach(ele => {
            if (ele[1] === "name") {
                if (val === "") {
                    filter.splice(filter.indexOf(ele), 1);
                    hasName = true;
                } else {
                    filter[filter.indexOf(ele)] = newFilter;
                    hasName = true;
                }
            }
        });

        if (!hasName) {
            filter.push(newFilter);
        };

        map.setFilter("all-storm-sub-paths", filter);
        map.setFilter("all-storms", filter);
        map.setFilter("all-points", filter);
    }

    document.querySelectorAll(".update-name").forEach(item => {
        item.addEventListener("input", nameUpdate);
    });

    const basinUpdate = (e) => {
        let val = e.target.value;
        e.preventDefault();
        e.stopPropagation();

        let filter = ["in", "basin", val];
        map.setFilter("all-storm-sub-paths", filter);
        map.setFilter("all-storms", filter);
        map.setFilter("all-points", filter);
    }

    document.querySelectorAll(".update-basin").forEach(item => {
        item.addEventListener("change", basinUpdate);
    });
});