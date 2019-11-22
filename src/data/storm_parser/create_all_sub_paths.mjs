import { intensityCalculator } from "./intensity_calculator.mjs";

export const createAllSubPaths = (dataset) => {
    const stormsTest = {
        "type": "FeatureCollection",
        "features": []
    };

    let previousSerial = "0";

    for (let i = 0; i < dataset.length; i++) {

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

    const str = JSON.stringify(stormsTest);
    return str
}