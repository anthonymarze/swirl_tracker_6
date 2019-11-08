import './styles/index.scss';
import mapboxgl from 'mapbox-gl';
import { intensityColor } from './scripts/intensity_calculator.js';

document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aG9ueW1hcnplIiwiYSI6ImNrMjZoOWU0MzBnOHMzbG8wZDN1NzByYnQifQ.Yb4cvywiiVs1hvKcTHCnAA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/anthonymarze/ck1rzyn8353181cowdfa754zg?optimize=true',
        center: [-77.38, 39], // starting position
        zoom: 3 // starting zoom
    });

    const intensityVals = ["TD", "TS", "1", "2", "3", "4", "5"];
    const popup = new mapboxgl.Popup({
        closeButton: false
    });

    map.on('load', () => {
        map.addControl(new mapboxgl.NavigationControl());
        map.addSource("storms2000", {
            type: 'vector',
            lineMetrics: true,
            url: 'mapbox://anthonymarze.87vqqpx1',
        });
        map.addSource('allDataPoints', {
            type: 'vector',
            lineMetrics: true,
            url: 'mapbox://anthonymarze.849mm1vv',
        });

        map.addLayer({
            "id": "all-storms",
            "type": "line",
            "source": "storms2000",
            "source-layer": "test_9-31jg2w",
            "paint": {
                "line-width": 10,
                "line-opacity": 0
            },
            "layout": {
                "visibility": "visible"
            }
        });

        map.addLayer({
            "id": "all-storms-highlighted",
            "type": "line",
            "source": "storms2000",
            "source-layer": "test_9-31jg2w",
            "paint": {
                "line-width": 5,
                "line-gap-width": 3,
                "line-blur": 10
            },
            "layout": {
                "visibility": "visible"
            },
            "filter": ["==", "serial_num", ""]
        })

        intensityVals.forEach(val => {
            if (!map.getLayer(val)) {
                map.addLayer({
                    "id": val,
                    "type": "line",
                    "source": "storms2000",
                    "source-layer": "test_9-31jg2w",
                    "paint": {
                        "line-color": intensityColor(val),
                        "line-width": 3
                    },
                    "filter": ["==", "intensity", val],
                    "layout": {
                        "visibility": "visible"
                    }
                })
            }
        })

        if (!map.getLayer("all-points")) {
            map.addLayer({
                "id": "all-points",
                "type": "circle",
                "source": "allDataPoints",
                "source-layer": "mapbox_storm_data-17ruvm",
                "paint": {
                    // "circle-radius": {
                    //     "base": 2,
                    //     "stops": [[12, 2], [22, 180]]
                    // },
                    "circle-color": "#696969"
                },
                // "filter": ["==", "season", 2000],
                "layout": {
                    "visibility": "none"
                }
            })
        }
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

        document.getElementById("sample-name").innerHTML = `${feature.properties.name}`;
        document.getElementById("sample-season").innerHTML = `year: ${feature.properties.season}`;
        document.getElementById("sample-max-wind").innerHTML = `maximum windspeed: ${feature.properties.max_windspeed} knots`;
        document.getElementById("sample-min-pressure").innerHTML = `minimum pressure: ${feature.properties.min_pressure} millibars`;
    })

    map.on("mouseleave", "all-storms", () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
        // map.setFilter('counties-highlighted', ['in', 'COUNTY', '']);
        // overlay.style.display = 'none';
        map.setFilter("all-storms-highlighted", ["==", "serial_num", ""]);
    });

    const clickedUpdate = (e) => {
        let val = event.target.innerHTML;
        e.preventDefault();
        e.stopPropagation();

        if(map.getLayoutProperty(val, "visibility") === "visible"){
            map.setLayoutProperty(val, "visibility", "none");
            document.getElementById(`hi-${val}`).style.backgroundColor = "#ffffff";
        } else {
            map.setLayoutProperty(val, "visibility", "visible");
            document.getElementById(`hi-${val}`).style.backgroundColor = intensityColor(val);
        }
    }


    // let counter = 1;

    // const detailedPath = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     map.addLayer({
    //         "type": 'line',
    //         "source": "storms2000",
    //         "source-layer": "test_9-31jg2w",
    //         id: sourceName.concat(numPoint),
    //         "paint": {
    //             "line-color": "red",
    //             "line-width": 6,
    //             "line-gradient": [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["line-progress"],
    //                 0, prevPointColor,
    //                 1, pointColor
    //             ]
    //         },
    //         "layout": {
    //             "visibility": "visibile",
    //             "line-cap": "round",
    //             "line-join": "round"
    //         }
    //     });

    //     numPoint += 1;
    //     prevPointColor = pointColor;
    // }

    document.querySelectorAll(".update").forEach(item => {
        item.addEventListener("click", clickedUpdate);
    });

    // map.on('load', () => {
    //     map.addLayer({
    //         "id": "tracks",
    //         "type": "MultiLineString",
    //         "source": {
    //             "type": "geojson",
    //             "data": createGeoJSON(stormTestList)
    //         }
    //     })
    // })

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


    // let stormCoords;
    // let counter = 0;
    // let stormPaths = [];

    // for(let i = 0; i < stormTestList.length; i++){
    //     stormCoords = [stormTestList[i].Longitude, stormTestList[i].Latitude];
    //     if(i === 0){
    //         stormPaths.push([stormTestList[i].Name, stormCoords]);
    //     } else if (stormTestList[i].Serial_Num !== stormTestList[i - 1].Serial_Num){
    //         stormPaths.push([stormTestList[i].Name, stormCoords]);
    //     } else {
    //         stormPaths[stormPaths.length - 1].push(stormCoords);
    //     }
    // }
    

    // map.on('load', () => {
    //     stormPaths.forEach(path => {

    //         let sourceNames = [];
    //         let prevPointColor = "";
    //         let pointColor;
    //         let numPoint = 1;

    //         map.addSource(sourceName, {
    //             type: 'geojson',
    //             lineMetrics: true,
    //             data: {
    //                 "type": "FeatureCollection",
    //                 "features": [{
    //                     "type": "Feature",
    //                     "properties": {},
    //                     "geometry": {
    //                         "type": "LineString",
    //                         "coordinates": path[1]
    //                     }
    //                 }]
    //             }
    //         });

    //         path.slice(1, path.length - 1).forEach(point => {

    //             if (stormTestList[counter]['Wind(WMO)'] > 157) {
    //                 pointColor = "#ff6060";
    //             } else if (stormTestList[counter]['Wind(WMO)'] < 157 && stormTestList[counter]['Wind(WMO)'] >= 130) {
    //                 pointColor = "#ff8f20";
    //             } else if (stormTestList[counter]['Wind(WMO)'] < 130 && stormTestList[counter]['Wind(WMO)'] >= 111) {
    //                 pointColor = "#ffc140";
    //             } else if (stormTestList[counter]['Wind(WMO)'] < 111 && stormTestList[counter]['Wind(WMO)'] >= 96) {
    //                 pointColor = "#ffe775";
    //             } else if (stormTestList[counter]['Wind(WMO)'] < 96 && stormTestList[counter]['Wind(WMO)'] >= 74) {
    //                 pointColor = "#ffffcc";
    //             } else if (stormTestList[counter]['Wind(WMO)'] < 74 && stormTestList[counter]['Wind(WMO)'] >= 39) {
    //                 pointColor = "#00faf4";
    //             } else if (stormTestList[counter]['Wind(WMO)'] < 39) {
    //                 pointColor = "#5ebaff";
    //             } else {
    //                 pointColor = "#cccccc";
    //             }

    //             if (prevPointColor === ""){
    //                 prevPointColor = pointColor;
    //             }

    //             let j = 2;
    //             let sourceName = path[0].concat(":" + numPoint);
    //             while(sourceNames.includes(sourceName)){
    //                 sourceName = path[0].concat("-" + j + ":" + numPoint);
    //                 j++;
    //             }
    //             sourceNames.push(sourceName);
    //             debugger

    //             if(numPoint === 1){
    //                 debugger
    //                 map.addSource(sourceName, {
    //                     type: 'geojson',
    //                     lineMetrics: true,
    //                     data: {
    //                         "type": "FeatureCollection",
    //                         "features": [{
    //                             "type": "Feature",
    //                             "properties": {},
    //                             "geometry": {
    //                                 "type": "LineString",
    //                                 "coordinates": path.slice(numPoint, numPoint + 2)
    //                             }
    //                         }]
    //                     }
    //                 });

    //             } 
    //             // else {
    //             //     debugger
    //             //     map.getSource(sourceName).setData({
    //             //         "type": "FeatureCollection",
    //             //         "features": [{
    //             //             "type": "Feature",
    //             //             "properties": {},
    //             //             "geometry": {
    //             //                 "type": "LineString",
    //             //                 "coordinates": path.slice(numPoint, numPoint + 2)
    //             //             }
    //             //         }]
    //             //     });
    //             // }

    //             map.addLayer({
    //                 type: 'line',
    //                 source:  sourceName,
    //                 id: sourceName.concat(numPoint),
    //                 paint: {
    //                     'line-color': 'red',
    //                     'line-width': 6,
    //                     'line-gradient': [
    //                         'interpolate',
    //                         ['linear'],
    //                         ['line-progress'],
    //                         0, prevPointColor,
    //                         1, pointColor
    //                     ]
    //                 },
    //                 layout: {
    //                 'line-cap': 'round',
    //                 'line-join': 'round'
    //                 }
    //             });

    //             numPoint += 1;
    //             prevPointColor = pointColor;
    //         })

    //         counter += 1;
    //     });

    // });

    // const stormList = document.createElement("ul");
    // const stormDiv = document.getElementById("storm-list");
});