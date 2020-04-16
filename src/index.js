import './styles/index.scss';
import mapboxgl from 'mapbox-gl';
import { intensityColor } from './scripts/intensity_calculator.js';
import filterAll from './scripts/filterAll.js';
import setSeasonRange from './scripts/setSeasonRange.js';
import showStormInfo from './scripts/showStormInfo.js';
import loadAllSources from './mapFeatures/loadAllSources';
import toggleDetailedPaths from './scripts/toggleDetailedPaths';
import resetFields from './scripts/resetFields';
import hoverOverFeature from './scripts/hoverOverFeature';

document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aG9ueW1hcnplIiwiYSI6ImNrMjZoOWU0MzBnOHMzbG8wZDN1NzByYnQifQ.Yb4cvywiiVs1hvKcTHCnAA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/anthonymarze/ck1rzyn8353181cowdfa754zg?optimize=true',
        center: [-77.38, 39], // starting position
        zoom: 3
    });

    let startYear = 2000;
    let endYear = 2017;
    let seasonRange = setSeasonRange(startYear, endYear);
    const intensityVals = ["TD", "TS", "1", "2", "3", "4", "5"];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const years = [];
        for(let i = 2000; i < 2018; i++) {
            years.push(i);
        }

    let filter = ["all", 
        ["match", ["get", "intensity"], intensityVals, true, false], 
        ["match", ["get", "season"], seasonRange, true, false]
    ];

    const leaveStormHighlight = () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
        map.setFilter("all-storms-highlighted", ["==", ["get", "serial_num"], ""]);
    }

    const handleStormInfo = e => {
        e.preventDefault();
        let feature = e.features[0];
        showStormInfo(map, feature);
    }

    const popup = new mapboxgl.Popup({
        closeButton: false
    });

    const clickedUpdate = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const val = e.target.innerHTML;

        if(!intensityVals.includes(val)) {
            intensityVals.push(val);
            let newFilter = ["in", ["get", "intensity"]];
            intensityVals.forEach(tVal => {
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
            let valIdx = intensityVals.indexOf(val);
            intensityVals.splice(valIdx, 1);
            let newFilter = ["in", "intensity"];
            intensityVals.forEach(tVal => {
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

// EVENTS //

// MAP EVENTS //

    map.on('load', () => {
        map.addControl(new mapboxgl.NavigationControl());
        loadAllSources(map, filter);
    });

    map.on("mousemove", "all-points", (e) => {
        let feature = e.features[0];
        popup.setLngLat(e.lngLat);
        hoverOverFeature(map, popup, feature, "all-points")
    })

    map.on("mousemove", "all-storms", (e) => {
        let feature = e.features[0];
        popup.setLngLat(e.lngLat);
        hoverOverFeature(map, popup, feature, "all-storms")
    })

    map.on("mousemove", "all-storm-sub-paths", (e) => {
        let feature = e.features[0];
        popup.setLngLat(e.lngLat);
        hoverOverFeature(map, popup, feature, "all-storm-sub-paths")
    })

    map.on("click", "all-storms", (e) => {
        handleStormInfo(e);
    })

    map.on("click", "all-storm-sub-paths", (e) => {
        handleStormInfo(e);
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

// OTHER EVENTS //

    const updateSeasonRange = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(e.target.id === "start-year") {
            startYear = parseInt(e.target.value);
            seasonRange = setSeasonRange(startYear, endYear);
        } else if(e.target.id === "end-year") {
            endYear = parseInt(e.target.value);
            seasonRange = setSeasonRange(startYear, endYear);
        }

        let hasSeason = false;
        let newFilter = ["in", "season"].concat(seasonRange);

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

    document.getElementById("start-year").addEventListener("input", updateSeasonRange);
    document.getElementById("end-year").addEventListener("input", updateSeasonRange);


    const updateName = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // map.removeLayer("searched-storms");
        // map.removeSource("searched-storms");

        let name = e.target.value.toUpperCase();

        // let searchedNames = [];

        // map.querySourceFeatures("all-storms").forEach(feature => {
        //     if(feature.properties.name.indexOf(name) === 0) {
        //         debugger
        //         searchedNames.push(name);
        //     }
        // })

        // map.addSource('searched storms', {
        //     type: 'geojson',
        //     data: {
        //         "type": "FeatureCollection",
        //         "features": [searchedNames]
        //     }
        // });

        // loadSearchedStorms(map, seasonRange);

        // map.setLayoutProperty("all-storms", "visibility", "none");

        let hasName = false;
        let newFilter = ["match", name.toUpperCase(), ["get", "name_sub_strings"], true, false];

        filter.forEach(ele => {
            if (ele[2][1] === "name_sub_strings") {
                if (name === "") {
                    filter.splice(filter[3], 1);
                    hasName = true;
                } else {
                    filter[3] = newFilter;
                    hasName = true;
                }
            }
        });

        if (!hasName) {
            filter.push(newFilter);
        };

        debugger

        filterAll(map, filter);

        // let hasName = false;
        // let newFilter = ["in", "name_sub_paths", name.toUpperCase()];
        
        // filter.forEach(ele => {
        //     if (ele[1] === "name") {
        //         if (name === "") {
        //             filter.splice(filter.indexOf(ele), 1);
        //             hasName = true;
        //         } else {
        //             filter[filter.indexOf(ele)] = newFilter;
        //             hasName = true;
        //         }
        //     }
        // });

        // if (!hasName) {
        //     filter.push(newFilter);
        // };

        // filterAll(map, filter);
    }

    document.getElementById("name").addEventListener("input", updateName);

    const basinUpdate = (e) => {
        let val = e.target.value;
        e.preventDefault();
        e.stopPropagation();

        let filter = ["in", "basin", val];
        filterAll(map, filter);
    }

    document.querySelectorAll(".update-basin").forEach(item => {
        item.addEventListener("change", basinUpdate);
    });

    document.getElementById("detailed-paths").addEventListener("mouseover", 
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.target.style.background = "#eeeeee";
            e.target.style.cursor = "pointer";
        }
    )

    document.getElementById("detailed-paths").addEventListener("mouseleave",
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (map.getLayoutProperty("all-storms", "visibility") === "none") {
                e.target.style.background = "#e6e6e6";
            } else {
                e.target.style.background = "#fff";
            }
            
            e.target.style.cursor = "none";
        }
    )

    document.getElementById("close-info-box").addEventListener("click", 
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById("info-box").style.display = "none";
        }
    )

    document.getElementById("detailed-paths").addEventListener("click",
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDetailedPaths(map);
        }
    )

    document.getElementById("reset-fields").addEventListener("click",
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetFields(map, filter);
        }
    )

});