import { intensityCalculator } from "./intensity_calculator.mjs";

export const createGeoJSON = (dataset) => {
    const stormsTest = {
        "type": "FeatureCollection",
        "features": []
    };

    let previousSerial = "0";
    let max_windspeed_arr = [];
    let min_pressure_arr = [];
    let stormTrackCoords = [];
    let crossesIDL = false;

    for(let i = 0; i < dataset.length; i++){

        let serial = dataset[i].Serial_Num;

        let lineFeature = {};
        if (previousSerial !== "0"){
            lineFeature = {
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
                    track_type: dataset[i - 1].Track_type
                },
                "geometry": {
                    "type": "LineString"
                }
            };
        }

        if (previousSerial !== serial && previousSerial !== "0") {
            const noZeroPressure = min_pressure_arr.map(datum => {
                if(datum > 0){
                    return datum;
                }
            });

            if(crossesIDL === true) {
                stormTrackCoords = stormTrackCoords.map(coord => {
                    if(coord[0] >= 0){
                        return [coord[0] - 360, coord[1]]
                    } else {
                        return coord
                    }
                })
            }

            let newStormTrackCoords;

            lineFeature.properties["max_windspeed"] = Math.max(...max_windspeed_arr);
            lineFeature.properties["min_pressure"] = Math.min(...noZeroPressure);
            lineFeature.properties["intensity"] = intensityCalculator(Math.max(...max_windspeed_arr), "value");
            lineFeature.geometry["coordinates"] = newStormTrackCoords || stormTrackCoords;
            stormsTest.features.push(lineFeature);
            stormTrackCoords = [];
            min_pressure_arr = [];
            max_windspeed_arr = [];
            crossesIDL = false;
        }

        let lng = dataset[i].Longitude;
        let lat = dataset[i].Latitude;

        if (previousSerial !== "0"){
            if (dataset[i].Serial_Num === dataset[i - 1].Serial_Num){
                if (dataset[i].Longitude < -90 && dataset[i - 1].Longitude > 90 || dataset[i - 1].Longitude < -90 && dataset[i].Longitude > 90 ){
                    crossesIDL = true;
                }
            }
        }

        let stormCoords = [
            lng,
            lat
        ];

        stormTrackCoords.push(stormCoords);

        max_windspeed_arr.push(Number(dataset[i]["Wind(WMO)"]));

        min_pressure_arr.push(Number(dataset[i]["Pres(WMO)"]));

        previousSerial = serial;

    };

    const str = JSON.stringify(stormsTest);
    return str
}