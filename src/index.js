import './styles/index.scss';
import {readStormData} from './scripts/data_util';
import sandy from './data/sandy_testo.js';
// import 'terraformer-arcgis-parser';


document.addEventListener("DOMContentLoaded", () => {
    const stormList = document.createElement("ul");
    const stormDiv = document.getElementById("storm-list");

    let stormData = [];
    const stormDataGeo = {
        features: [],
        type: "FeatureCollection"
    };

    function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
    console.log(sandy)
    debugger
    
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
        // Testing logging data
    // d3.json("../assets/data/genres.json").then((data) => {
    // console.log(data);
    // });
        
    download(stormDataGeo, 'json.txt', 'text/plain');

        // console.log(stormDataGeo);
        // const fs = require('fs');
        // fs.writeFile("test.txt", stormDataGeo, function (err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
});