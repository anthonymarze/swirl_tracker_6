import { intensityCalculator } from "./intensity_calculator.mjs";
import { stormData } from './storm_data.mjs';
import fs from 'fs';

const createAllSubPaths = (dataset) => {
    const stormsTest = {
        "type": "FeatureCollection",
        "features": []
    };

    const basins = [];

    let previousSerial = "0";

    for (let i = 0; i < dataset.length; i++) {

        if(!basins.includes(dataset[i].Basin)){
            basins.push(dataset[i].Basin);
        }

        let serial = dataset[i].Serial_Num;

        if (previousSerial !== "0" && previousSerial === serial) {

            let startLng = dataset[i - 1].Longitude;
            let startLat = dataset[i - 1].Latitude;
            let endLng = dataset[i].Longitude;
            let endLat = dataset[i].Latitude;

            if (startLng >= 0 && dataset[i - 1].Basin !== "NA"){
                startLng -= 360;
            }

            if (endLng >= 0 && dataset[i].Basin !== "NA") {
                endLng -= 360;
            }

            let stormCoords = [
                [startLng, startLat],
                [endLng, endLat]
            ];

            let lineFeature = {
                "type": "Feature",
                "id": dataset[i - 1].Serial_Num,
                "properties": {
                    serial_num: dataset[i - 1].Serial_Num,
                    season: dataset[i - 1].Season,
                    num: dataset[i - 1].Num,
                    basin: dataset[i - 1].Basin,
                    sub_basin: dataset[i - 1].Sub_basin,
                    name: dataset[i - 1].Name,
                    nature: dataset[i - 1].Nature,
                    center: dataset[i - 1].Center,
                    track_type: dataset[i - 1].Track_type,
                    windpseed: dataset[i - 1]["Wind(WMO)"],
                    windpseed_percentile: dataset[i - 1]["Wind(WMO) Percentile"],
                    pressure: dataset[i - 1]["Pres(WMO)"],
                    pressure_percentile: dataset[i - 1]["Pres(WMO) Percentile"],
                    intensity: intensityCalculator(dataset[i - 1]["Wind(WMO)"], "value"),
                    color: intensityCalculator(dataset[i - 1]["Wind(WMO)"], "color")
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": stormCoords
                }
            };

            stormsTest.features.push(lineFeature);
            stormCoords = [];
        }

        previousSerial = serial;
    };

    const basinsStr = basins.join(" - ");

    const str = JSON.stringify(basinsStr);
    return str
}

fs.writeFile("./basins", createAllSubPaths(stormData), function (err) {

    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});