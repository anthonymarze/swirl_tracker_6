import './styles/index.scss';
// import * as d3 from "d3";
// import {$, jQuery} from 'jquery';
import { ResizeSensor } from 'css-element-queries';
import stackedToGrouped from './scripts/stackedToGrouped';
import mapboxgl from 'mapbox-gl';
import filterAll from './scripts/filterAll.js';
import setSeasonRange from './scripts/setSeasonRange.js';
import showStormInfo from './scripts/showStormInfo.js';
import loadAllSources from './mapFeatures/loadAllSources';
import resetFields from './scripts/resetFields';
import hoverOverFeature from './scripts/hoverOverFeature';
import updateIntensityVals from './scripts/updateIntensityVals';
import updateFilterName from './filterFunctions/updateFilterName';
import updateFilterIntensity from './filterFunctions/updateFilterIntensity';
import toggleAllStormsVisibility from './scripts/toggleAllStormsVisibility';
import updateFilterSeason from './filterFunctions/updateFilterSeason';
import updateFilterBasin from './filterFunctions/updateFilterBasin';
import updateFilterMonth from './filterFunctions/updateFilterMonth';
import updateBasinList from './scripts/updateBasinList';
import updateMonths from './scripts/updateMonths';
import generateHistogramData from './scripts/generateHistogramData';
import { html } from 'd3';
import { intensityColor } from './scripts/intensity_calculator';

document.querySelector(".root").style.opacity = 0.5;
document.querySelectorAll("input").forEach(input => {
    input.style.pointerEvents = "none";
})

document.addEventListener("DOMContentLoaded", () => {

// MAP CREATED //

    const mapCenter = [-162, 11];
    const zoomLevel = 1.85;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aG9ueW1hcnplIiwiYSI6ImNrMjZoOWU0MzBnOHMzbG8wZDN1NzByYnQifQ.Yb4cvywiiVs1hvKcTHCnAA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/anthonymarze/ck1rzyn8353181cowdfa754zg?optimize=true',
        center: mapCenter,
        zoom: zoomLevel
    });

    const popup = new mapboxgl.Popup({
        closeButton: false
    });

// INITIAL CONFIGURATION OF SETTINGS //

    let intensityVals, startYear, endYear, seasonRange, stormName, basinList, months, filter;
    [intensityVals, startYear, endYear, seasonRange, stormName, basinList, months, filter] = resetFields(map, mapCenter, zoomLevel);

    // Loads Chart //

    // stackedToGrouped();

// EVENTS //

// MAP EVENTS //

    map.on('load', () => {
        map.addControl(new mapboxgl.NavigationControl());
        loadAllSources(map, filter);
        const loading = () => {
            if(!map.isStyleLoaded()) {
                setTimeout(loading, 200);
            } else {
                // gathers map features based on filter (NOT ACCURATE - ONLY QUERIES INSIDE VIEWPORT)
                let selectedFeautres = map.querySourceFeatures("all-storms", { filter: filter });

                // return 1 dimensional array for use by D3
                const sortedHistogramByMonth = generateHistogramData(selectedFeautres)

                // garbage collect large selected feature object
                selectedFeautres = {};

                // redraw the histogram and map features
                stackedToGrouped(sortedHistogramByMonth);
                filterAll(map, filter);
                document.querySelector(".root").style.opacity = 1;
                document.querySelectorAll("input").forEach(input => {
                    input.style.pointerEvents = "auto";
                })
            }
        }
        loading();
    });

    // map.on("mousemove", "all-points", (e) => {
    //     let feature = e.features[0];
    //     popup.setLngLat(e.lngLat);
    //     hoverOverFeature(map, popup, feature, "all-points")
    // })

    map.on("mousemove", "all-storms", (e) => {
        let feature = e.features[0];
        popup.setLngLat(e.lngLat);
        hoverOverFeature(map, popup, feature, "all-storms")
    })

    // map.on("mousemove", "all-storm-sub-paths", (e) => {
    //     let feature = e.features[0];
    //     popup.setLngLat(e.lngLat);
    //     hoverOverFeature(map, popup, feature, "all-storm-sub-paths")
    // })

    map.on("click", "all-storms", (e) => {
        handleStormInfo(e);
    })

    // map.on("click", "all-storm-sub-paths", (e) => {
    //     handleStormInfo(e);
    // })

    map.on("mouseleave", "all-storms", () => {
        leaveStormHighlight();
    });

    // map.on("mouseleave", "all-storm-sub-paths", () => {
    //     leaveStormHighlight();
    // });

    // map.on("mouseleave", "all-points", () => {
    //     leaveStormHighlight();
    // });

// EVENT HANDLERS //

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

    const handleIntensity = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const intensity = e.target.innerHTML;

        // reset variables
        intensityVals = updateIntensityVals(intensity, intensityVals);
        filter = updateFilterIntensity(filter, intensityVals);

        // gathers map features based on filter (NOT ACCURATE - ONLY QUERIES INSIDE VIEWPORT)
        let selectedFeautres = map.querySourceFeatures("all-storms", { filter: filter });

        // return 1 dimensional array for use by D3
        const sortedHistogramByMonth = generateHistogramData(selectedFeautres)

        // garbage collect large selected feature object
        selectedFeautres = {};

        // redraw the histogram and map features
        stackedToGrouped(sortedHistogramByMonth);
        filterAll(map, filter);

        // DIRTY TRICK TO FORCE REDRAW //
        toggleAllStormsVisibility(map, "none");
        toggleAllStormsVisibility(map, "visible");
    }

    const updateSeasonRange = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target.id === "start-year") {
            startYear = parseInt(e.target.value);
            seasonRange = setSeasonRange(startYear, endYear);
        } else if (e.target.id === "end-year") {
            endYear = parseInt(e.target.value);
            seasonRange = setSeasonRange(startYear, endYear);
        }

        e.target.style.border = "2px solid red";
        setTimeout(() => {
            e.target.style.border = "1px solid #696969";
        }, 1000);

        filter = updateFilterSeason(filter, seasonRange);
        
        // gathers map features based on filter (NOT ACCURATE - ONLY QUERIES INSIDE VIEWPORT)
        let selectedFeautres = map.querySourceFeatures("all-storms", { filter: filter });

        // return 1 dimensional array for use by D3
        const sortedHistogramByMonth = generateHistogramData(selectedFeautres)

        // garbage collect large selected feature object
        selectedFeautres = {};

        // redraw the histogram and map features
        stackedToGrouped(sortedHistogramByMonth);
        filterAll(map, filter);

        // DIRTY TRICK TO FORCE REDRAW //
        toggleAllStormsVisibility(map, "none");
        toggleAllStormsVisibility(map, "visible");
    }

    const updateName = (e) => {
        e.preventDefault();
        e.stopPropagation();
        stormName = e.target.value.toUpperCase();
        filter = updateFilterName(filter, stormName);
        
        // gathers map features based on filter (NOT ACCURATE - ONLY QUERIES INSIDE VIEWPORT)
        let selectedFeautres = map.querySourceFeatures("all-storms", { filter: filter });

        // return 1 dimensional array for use by D3
        const sortedHistogramByMonth = generateHistogramData(selectedFeautres)

        // garbage collect large selected feature object
        selectedFeautres = {};

        // redraw the histogram and map features
        stackedToGrouped(sortedHistogramByMonth);
        filterAll(map, filter);

        // DIRTY TRICK TO FORCE REDRAW //
        toggleAllStormsVisibility(map, "none");
        toggleAllStormsVisibility(map, "visible");
    }

    const updateHoverOver = (e) => {
        e.target.style.backgroundColor = "#eeeeee";
    }

    const updateHoverOut = (e) => {
        const style = document.getElementById(e.target.id).style.backgroundColor;
        e.target.style.backgroundColor = style;
    }

    const handleBasin = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let basin = e.target;
        basinList = updateBasinList(basin, basinList);

        filter = updateFilterBasin(filter, basinList);

        // gathers map features based on filter (NOT ACCURATE - ONLY QUERIES INSIDE VIEWPORT)
        let selectedFeautres = map.querySourceFeatures("all-storms", { filter: filter });

        // return 1 dimensional array for use by D3
        const sortedHistogramByMonth = generateHistogramData(selectedFeautres)

        // garbage collect large selected feature object
        selectedFeautres = {};

        // redraw the histogram and map features
        stackedToGrouped(sortedHistogramByMonth);
        filterAll(map, filter);

        // DIRTY TRICK TO FORCE REDRAW //
        toggleAllStormsVisibility(map, "none");
        toggleAllStormsVisibility(map, "visible");
    }

    const handleMonth = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let month = e.target;
        months = updateMonths(month, months);

        filter = updateFilterMonth(filter, months);
        
        // gathers map features based on filter (NOT ACCURATE - ONLY QUERIES INSIDE VIEWPORT)
        let selectedFeautres = map.querySourceFeatures("all-storms", { filter: filter });

        // return 1 dimensional array for use by D3
        const sortedHistogramByMonth = generateHistogramData(selectedFeautres)

        // garbage collect large selected feature object
        selectedFeautres = {};

        // redraw the histogram and map features
        stackedToGrouped(sortedHistogramByMonth);
        filterAll(map, filter);

        // DIRTY TRICK TO FORCE REDRAW //
        toggleAllStormsVisibility(map, "none");
        toggleAllStormsVisibility(map, "visible");
    }


// HISTOGRAM EVENT LISTENER //
    let timeline = document.getElementById("timeline");

    new ResizeSensor(timeline, function () {
        document.getElementById("months-histogram").remove();
        stackedToGrouped();
    });

// EVENT LISTENERS //

    document.getElementById("name").addEventListener("input", updateName);

    document.querySelectorAll(".basin").forEach(item => {
        item.addEventListener("click", handleBasin);
    });

    document.querySelectorAll(".month").forEach(item => {
        item.addEventListener("click", handleMonth);
    });

    // document.getElementById("detailed-paths").addEventListener("mouseover", 
    //     (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         e.target.style.background = "#eeeeee";
    //         e.target.style.cursor = "pointer";
    //     }
    // )

    // document.getElementById("detailed-paths").addEventListener("mouseleave",
    //     (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         e.target.style.background = "#ffffff";
    //         e.target.style.cursor = "none";
    //     }
    // )

    document.getElementById("close-info-box").addEventListener("click", 
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById("info-box").style.display = "none";
            // [intensityVals, startYear, endYear, seasonRange, stormName, basinList, months, filter] = resetFields(map, mapCenter, zoomLevel);

            filterAll(map, filter);
            toggleAllStormsVisibility(map, "visible");

            // REACTIVATES BOTTOM PANEL //

            document.querySelectorAll(".bottom-panel input").forEach(input => {
                input.style.opacity = "1";
                input.style.pointerEvents = "auto";
            })

            document.querySelectorAll(".bottom-panel button").forEach(input => {
                input.style.opacity = "1";
                input.style.pointerEvents = "auto";
            })

            document.querySelectorAll(".bottom-panel ul").forEach(input => {
                input.style.opacity = "1";
                input.style.pointerEvents = "auto";
            })

            // reset intensity selectors
            intensityVals.forEach(intensity => {
                document.getElementById(`hi-${intensity}`).style.backgroundColor = intensityColor(intensity);
            })

            // reset basin selectors
            document.querySelectorAll(".basin").forEach(basin => {
                const basinName = basin.innerHTML[0] + basin.innerHTML[basin.innerHTML.indexOf(" ") + 1];

                if(basinList.includes(basinName)) {
                    basin.style.color = "red";
                } else {
                    basin.style.color = "black";
                }
            });

            // reset month selectors
            document.querySelectorAll(".month").forEach(month => {
                if (months.includes(month.innerHTML)) {
                    month.style.color = "red";
                } else {
                    month.style.color = "black";
                }
            });

            // reset start year selector
            document.getElementById("start-year").value = startYear;
            document.getElementById("start-year").style.border = "1px solid black";

            // reset end year selector
            document.getElementById("end-year").value = endYear;
            document.getElementById("end-year").style.border = "1px solid black";

            // reset name selector
            const storm = document.getElementById("name");
            storm.value = stormName;
            if(stormName === "") {
                storm.style.border = "1px solid black";
            } else {
                storm.style.border = "2px solid red";
            }
        }
    )

    // document.getElementById("detailed-paths").addEventListener("click",
    //     (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         toggleDetailedPaths(map);
            // map.setPaintProperty("all-points", "circle-color", "red")

            // CANNOT SEEM TO REDRAW AFTER FILTER CHANGE - DIRTY TRICK TO FORCE REDRAW //

            // toggleAllStormsVisibility(map, "visible");
            // toggleAllStormsVisibility(map, "none");
        // }
    // )

    document.getElementById("reset-fields").addEventListener("click",
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            [intensityVals, startYear, endYear, seasonRange, stormName, basinList, months, filter] = resetFields(map, mapCenter, zoomLevel);
            
            filterAll(map, filter);

            // CANNOT SEEM TO REDRAW AFTER FILTER CHANGE - DIRTY TRICK TO FORCE REDRAW //

            toggleAllStormsVisibility(map, "none");
            toggleAllStormsVisibility(map, "visible");

            // reload histogram
            const loading = () => {
                if (!map.isStyleLoaded()) {
                    setTimeout(loading, 200);
                } else {
                    // gathers map features based on filter (NOT ACCURATE - ONLY QUERIES INSIDE VIEWPORT)
                    let selectedFeautres = map.querySourceFeatures("all-storms", { filter: filter });

                    // return 1 dimensional array for use by D3
                    const sortedHistogramByMonth = generateHistogramData(selectedFeautres)

                    // garbage collect large selected feature object
                    selectedFeautres = {};

                    // redraw the histogram and map features
                    stackedToGrouped(sortedHistogramByMonth);
                }
            }
            loading();
        }
    )

    document.querySelectorAll(".update").forEach(item => {
        item.addEventListener("click", handleIntensity);
        item.addEventListener("mousenter", updateHoverOver);
        item.addEventListener("mouseout", updateHoverOut);
    });


    document.getElementById("start-year").addEventListener("input", updateSeasonRange);
    document.getElementById("end-year").addEventListener("input", updateSeasonRange);

});