import { intensityCalculator } from "./intensity_calculator.mjs";
import { stormData } from './storm_data.mjs';

const fs = require('fs');

fs.writeFile("/Downloads/all_storm_paths", createGeoJSON(stormData), function (err) {

    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

const createGeoJSON = (dataset) => {
    const stormsTest = {
        "type": "FeatureCollection",
        "features": []
    };

    let previousSerial = "0";
    let max_windspeed_arr = [];
    let min_pressure_arr = [];
    let stormTrackCoords = [];

    dataset.forEach(dataPoint => {

        let stormCoords = [
            dataPoint.Longitude,
            dataPoint.Latitude
        ];

        let serial = dataPoint.Serial_Num;

        let lineFeature = {
            "type": "Feature",
            "id": dataPoint.Serial_Num,
            "properties": {
                serial_num: dataPoint.Serial_Num,
                season: dataPoint.Season,
                num: dataPoint.Num,
                basin: dataPoint.Basin,
                sub_basin: dataPoint.Sub_basin,
                name: dataPoint.Name,
                nature: dataPoint.Nature,
                center: dataPoint.Center,
                track_type: dataPoint.Track_type
            },
            "geometry": {
                "type": "LineString"
            }
        };
        
        if(previousSerial !== serial && previousSerial !== "0"){
            lineFeature.properties["max_windspeed"] = Math.max(...max_windspeed_arr);
            lineFeature.properties["min_pressure"] = Math.min(...min_pressure_arr);
            lineFeature.properties["intensity"] = intensityCalculator(Math.max(...max_windspeed_arr), "value");
            lineFeature.geometry["coordinates"] = stormTrackCoords;
            stormsTest.features.push(lineFeature);
            stormTrackCoords = [];
            min_pressure_arr = [];
            max_windspeed_arr = [];
        }
        
        stormTrackCoords.push(stormCoords);

        max_windspeed_arr.push(Number(dataPoint["Wind(WMO)"]));

        min_pressure_arr.push(Number(dataPoint["Pres(WMO)"]));

        previousSerial = serial;

    });

    const str = JSON.stringify(stormsTest);
    return str
}
