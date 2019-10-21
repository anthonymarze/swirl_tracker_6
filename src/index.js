import './styles/index.scss';
import { readStormData } from './scripts/data_util';
import { sandy } from './data/sandy_testo.js';
import { stormTestList } from './data/storm_test';
// import 'terraformer-arcgis-parser';


document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aG9ueW1hcnplIiwiYSI6ImNrMXJ6OXB0bDA4aDczZ211NmhjeXRqb3AifQ.93nxr5Fug4soMvAqoBNlWQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/anthonymarze/ck1rzyn8353181cowdfa754zg',
        center: [-77.38, 39], // starting position
        zoom: 3 // starting zoom
    });

    let sandCord = [];
    sandy.forEach(dot => {
        sandCord.push([dot.Longitude, dot.Latitude]);
    })

    let stormCoords;

    let stormPaths = [];
    for (let i = 0; i < stormTestList.length; i++) {
        stormCoords = [stormTestList[i].Longitude, stormTestList[i].Latitude];
        if (i === 0) {
            stormPaths.push([stormTestList[i].Name, stormCoords]);
        } else if (stormTestList[i].Serial_Num !== stormTestList[i - 1].Serial_Num) {
            stormPaths.push([stormTestList[i].Name, stormCoords]);
        } else {
            stormPaths[stormPaths.length - 1].push(stormCoords);
        }
    }
    debugger

    stormPaths.forEach(path => {
        debugger
        map.on('load', function () {

            map.addLayer({
                "id": path[0],
                "type": "line",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": path.slice(1)
                        }
                    }
                },
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "rebeccapurple",
                    "line-width": 1
                }
            });
        });
    });


    const stormList = document.createElement("ul");
    const stormDiv = document.getElementById("storm-list");

    let stormData = [];
    const stormDataGeo = {
        features: [],
        type: "FeatureCollection"
    };

    stormData.push(sandy);

    for (let i = 0; i < stormData[0].length; i++) {
        stormDataGeo.features.push({
            type: "Feature",
            properties: {
                Serial_Num: stormData[0][i].Serial_Num,
                Season: stormData[0][i].Season,
                Num: stormData[0][i].Num,
                Basin: stormData[0][i].Basin,
                Sub_basin: stormData[0][i].Sub_basin,
                Name: stormData[0][i].Name,
                ISO_time: stormData[0][i].ISO_time,
                Nature: stormData[0][i].Nature,
                // "Wind(WMO)": stormData[0][i]."Wind(WMO)",
                // "Pres(WMO)": stormData[0][i]."Pres(WMO)",
                Center: stormData[0][i].Center,
                // "Wind(WMO) Percentile": stormData[0][i]."Wind(WMO) Percentile",
                // "Pres(WMO) Percentile": stormData[0][i]."Pres(WMO) Percentile",
                Track_type: stormData[0][i].Track_type
            },
            geometry: {
                coordinates: [stormData[0][i].Latitude,
                stormData[0][i].Longitude],
                type: "point"
            }
        })
    }

    let sandyBlob = new Blob([JSON.stringify(stormDataGeo)], { type: "text/plain" });
    let sandyReader = new FileReader();

    sandyReader.addEventListener("loadend", (e) => {
        stormDiv.innerHTML = e.srcElement.result;
    })

    sandyReader.readAsText(sandyBlob);

    // let link = document.createElement("a");
    // link.href = url;
    // link.innerText = "Sandy Info";
    // let head = document.createElement("meta");
    // head.charset = "utf-8";
    // stormDiv.appendChild(head);
    // stormDiv.appendChild(link);

    // Testing logging data
    // d3.json("../assets/data/genres.json").then((data) => {
    // console.log(data);
    // });
});