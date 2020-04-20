import './styles/index.scss';
import mapboxgl from 'mapbox-gl';
import filterAll from './scripts/filterAll.js';
import setSeasonRange from './scripts/setSeasonRange.js';
import showStormInfo from './scripts/showStormInfo.js';
import loadAllSources from './mapFeatures/loadAllSources';
import toggleDetailedPaths from './scripts/toggleDetailedPaths';
import resetFields from './scripts/resetFields';
import hoverOverFeature from './scripts/hoverOverFeature';
import defineTimeIncrements from './scripts/defineTimeIncrements';
import updateIntensityVals from './scripts/updateIntensityVals';
import updateFilterName from './scripts/updateFilterName';
import updateFilterIntensity from './scripts/updateFilterIntensity';
import toggleAllStormsVisibility from './scripts/toggleAllStormsVisibility';
import updateFilterSeason from './scripts/updateFilterSeason';
import updateFilterBasin from './scripts/updateFilterBasin';
import updateBasinList from './scripts/updateBasinList';

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

    let intensityVals, startYear, endYear, seasonRange, stormName, basinList, filter;
    [intensityVals, startYear, endYear, seasonRange, stormName, basinList, filter] = resetFields(map, mapCenter, zoomLevel);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    defineTimeIncrements(months);

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
        intensityVals = updateIntensityVals(intensity, intensityVals);

        filter = updateFilterIntensity(filter, intensityVals);
        filterAll(map, filter);

        // CANNOT SEEM TO REDRAW AFTER FILTER CHANGE - DIRTY TRICK TO FORCE REDRAW //

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
        filterAll(map, filter);

        // CANNOT SEEM TO REDRAW AFTER FILTER CHANGE - DIRTY TRICK TO FORCE REDRAW //

        toggleAllStormsVisibility(map, "none");
        toggleAllStormsVisibility(map, "visible");
    }

    const updateName = (e) => {
        e.preventDefault();
        e.stopPropagation();
        stormName = e.target.value.toUpperCase();
        filter = updateFilterName(filter, stormName);
        filterAll(map, filter);

        // CANNOT SEEM TO REDRAW AFTER FILTER CHANGE - DIRTY TRICK TO FORCE REDRAW //

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
        filterAll(map, filter);

        // CANNOT SEEM TO REDRAW AFTER FILTER CHANGE - DIRTY TRICK TO FORCE REDRAW //

        toggleAllStormsVisibility(map, "none");
        toggleAllStormsVisibility(map, "visible");
    }



// EVENT LISTENERS //

    document.getElementById("name").addEventListener("input", updateName);

    document.querySelectorAll(".basin").forEach(item => {
        item.addEventListener("click", handleBasin);
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
            e.target.style.background = "#ffffff";
            e.target.style.cursor = "none";
        }
    )

    document.getElementById("close-info-box").addEventListener("click", 
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById("info-box").style.display = "none";
            [intensityVals, startYear, endYear, seasonRange, stormName, basinList, filter] = resetFields(map, mapCenter, zoomLevel);

            filterAll(map, filter);
            toggleAllStormsVisibility(map, "visible");
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
            [intensityVals, startYear, endYear, seasonRange, stormName, basinList, filter] = resetFields(map, mapCenter, zoomLevel);
            
            filterAll(map, filter);

            // CANNOT SEEM TO REDRAW AFTER FILTER CHANGE - DIRTY TRICK TO FORCE REDRAW //

            toggleAllStormsVisibility(map, "none");
            toggleAllStormsVisibility(map, "visible");
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