import { intensityCalculator } from "./intensity_calculator.mjs";

export const createAllDataPoints = (dataset) => {
    const stormsTest = {
        "type": "FeatureCollection",
        "features": []
    };

    for (let i = 0; i < dataset.length; i++) {

        let lng = dataset[i].Longitude;
        let lat = dataset[i].Latitude;

        if (lng >= 0 && dataset[i].Basin !== "NA") {
            lng -= 360;
        }

        let stormCoords = [
            [lng, lat]
        ];

        let lineFeature = {
            "type": "Feature",
            "id": dataset[i].Serial_Num,
            "properties": {
                serial_num: dataset[i].Serial_Num,
                season: dataset[i].Season,
                num: dataset[i].Num,
                basin: dataset[i].Basin,
                sub_basin: dataset[i].Sub_basin,
                name: dataset[i].Name,
                nature: dataset[i].Nature,
                center: dataset[i].Center,
                track_type: dataset[i].Track_type,
                ISO_time: dataset[i].ISO_time,
                windpseed: dataset[i]["Wind(WMO)"],
                windpseed_percentile: dataset[i]["Wind(WMO) Percentile"],
                pressure: dataset[i]["Pres(WMO)"],
                pressure_percentile: dataset[i]["Pres(WMO) Percentile"],
                intensity: intensityCalculator(dataset[i]["Wind(WMO)"], "value"),
                color: intensityCalculator(dataset[i]["Wind(WMO)"], "color")
            },
            "geometry": {
                "type": "Point",
                "coordinates": stormCoords
            }
        };

        stormsTest.features.push(lineFeature);
    };

    const str = JSON.stringify(stormsTest);
    return str
}