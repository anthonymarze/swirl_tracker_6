import './styles/index.scss';
import mapboxgl from 'mapbox-gl';
import { intensityCalculator, intensityColor } from './scripts/intensity_calculator.js';
import { basinNames } from './scripts/basin_names';
import { getMaxBounds } from './scripts/get_max_bounds';

document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aG9ueW1hcnplIiwiYSI6ImNrMjZoOWU0MzBnOHMzbG8wZDN1NzByYnQifQ.Yb4cvywiiVs1hvKcTHCnAA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/anthonymarze/ck1rzyn8353181cowdfa754zg?optimize=true',
        center: [-77.38, 39], // starting position
        zoom: 3
    });

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

    const popup = new mapboxgl.Popup({
        closeButton: false
    });
    let selected = "";

    const colorizedPath = (path) => {
        let counter = 1;
        

        path.slice(1).forEach(point => {
            let coords = [];
            coords.push(path[counter - 1].geometry.coordinates);
            coords.push(path[counter].geometry.coordinates);

            let geojson = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": coords,
                        "type": "LineString"
                    }
                }]
            };

            map.addSource(`${path[0].properties.serial_num}-${counter}`, {
                type: 'geojson',
                lineMetrics: true,
                data: datar
            });

            counter += 1;
        })

        counter = 1;

        path.slice(1).forEach(point => {
            console.log(intensityCalculator(path[counter - 1].properties.wind, "color"));
            
            map.addLayer({
                "type": 'line',
                "source": `${path[0].properties.serial_num}-${counter}`,
                "id": `${path[0].properties.serial_num}-${counter}`,
                "paint": {
                    "line-width": 3,
                    "line-gradient": [
                        "interpolate",
                        ["linear"],
                        ["line-progress"],
                        0, intensityCalculator(path[counter - 1].properties.wind, "color"),
                        1, intensityCalculator(path[counter].properties.wind, "color")
                    ]
                },
                "layout": {
                    "line-cap": "round",
                    "line-join": "round"
                }
            });
            counter += 1;
        })
    }

    map.on('load', () => {
        
        map.addControl(new mapboxgl.NavigationControl());
            map.addSource("all-storms", {
                type: 'geojson',
                data: "http://anthonymarze.com/assets/all_storms.geojson"
            });
        map.addSource("all-storm-sub-paths", {
            type: 'geojson',
            data: "http://anthonymarze.com/assets/all_storm_sub_paths.geojson"
        });
        map.addSource('allDataPoints', {
            type: 'vector',
            lineMetrics: true,
            url: 'mapbox://anthonymarze.849mm1vv',
        });

        map.addLayer({
            "id": "all-storm-sub-paths",
            "type": "line",
            "source": "all-storm-sub-paths",
            "paint": {
                "line-width": 4,
                "line-color": ["get", "color"]
            }
        });

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
            }
        });

        map.addLayer({
            "id": "all-storms-highlighted",
            "type": "line",
            "source": "all-storms",
            "paint": {
                "line-width": 4,
                "line-gap-width": 3,
                "line-blur": 15
            },
            "layout": {
                "visibility": "visible"
            },
            "filter": ["==", "serial_num", ""]
        })

        map.addLayer({
            "id": "all-points",
            "type": "circle",
            "source": "allDataPoints",
            "source-layer": "mapbox_storm_data-17ruvm",
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
                "visibility": "none"
            }
        })
    });

    map.on("mousemove", "all-storms", (e) => {
        map.getCanvas().style.cursor = 'pointer';
        let feature = e.features[0];

        popup.setLngLat(e.lngLat);
        popup.setHTML(`<h3>${feature.properties.name} (${feature.properties.season})</h3>`);
        popup.addTo(map);

        map.setFilter("all-storms-highlighted", ["==", "serial_num", `${feature.properties.serial_num}`]);
        map.setPaintProperty("all-storms-highlighted", "line-color", intensityColor(feature.properties.intensity));
        map.setLayoutProperty("all-storms", "visibility", "visible");
    })

    map.on("click", "all-storms", (e) => {
        map.getCanvas().style.cursor = 'pointer';
        let feature = e.features[0];

        selected = feature.properties.serial_num;

        map.fitBounds(getMaxBounds(feature.geometry.coordinates), 
            { padding: { top: 150, bottom: 150, left: 150, right: 150 }});

        document.getElementById("sample-name").innerHTML = `${feature.properties.name}`;
        document.getElementById("sample-basin").innerHTML = `basin: ${basinNames(feature.properties.basin)}`;
        document.getElementById("sample-season").innerHTML = `year: ${feature.properties.season}`;
        document.getElementById("sample-max-wind").innerHTML = `maximum windspeed: ${feature.properties.max_windspeed} knots`;
        document.getElementById("sample-min-pressure").innerHTML = `minimum pressure: ${feature.properties.min_pressure} millibars`;
        document.getElementById("sample-coordinates").innerHTML = `coords: ${feature.geometry.coordinates}`;  
    })

    map.on("mouseleave", "all-storms", () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
        map.setFilter("all-storms-highlighted", ["==", "serial_num", ""]);
    });

    const clickedUpdate = (e) => {
        let val = event.target.innerHTML;
        e.preventDefault();
        e.stopPropagation();

        if(val === "colorized-path"){
            if(selected === ""){
                return
            } else {
                map.setFilter("all-points", ["==", "serial_num", selected]);
                map.setLayoutProperty("all-points", "visibility", "visible");
                setTimeout(() => {
                    let oneStormData = map.querySourceFeatures('allDataPoints', {
                    sourceLayer: "mapbox_storm_data-17ruvm",
                    filter: ["==", "serial_num", selected]
                    });
                    colorizedPath(oneStormData);
                }, 1000)
            }
        } else if(!toggledVals.includes(val)) {
            toggledVals.push(val)
            let filter = ["in", "intensity"];
            toggledVals.forEach(tVal => {
                filter.push(tVal)
            })
            map.setFilter("all-storm-sub-paths", filter)
            map.setFilter("all-storms", filter)
        } else {
            let valIdx = toggledVals.indexOf(val);
            toggledVals.splice(valIdx, 1);
            let filter = ["in", "intensity"];
            toggledVals.forEach(tVal => {
                filter.push(tVal)
            })
            map.setFilter("all-storm-sub-paths", filter)
            map.setFilter("all-storms", filter)
        }
    }

    document.querySelectorAll(".update").forEach(item => {
        item.addEventListener("click", clickedUpdate);
    });

    // map.on('load', () => {
    //     map.addLayer
    // })

    // const download = (filename, text)=> {
    //     var element = document.createElement('a');
    //     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    //     element.setAttribute('download', filename);

    //     element.style.display = 'none';
    //     document.body.appendChild(element);

    //     element.click();

    //     document.body.removeChild(element);
    // };

    // download("test.txt", createGeoJSON(stormTestList));

    // const stormList = document.createElement("ul");
    // const stormDiv = document.getElementById("storm-list");
});