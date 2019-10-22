import { intensityCalculator } from "./intensity_calculator";

export const createGeoJSON = (dataset) => {
    const stormsTest = {
        // type: 'geojson',
        // lineMetrics: true,
        // data: 
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

        // let pointFeature = {
        //     "type": "Feature",
        //     "properties": {
        //         serial_num: dataPoint.Serial_Num,
        //         season: dataPoint.Season,
        //         num: dataPoint.Num,
        //         basin: dataPoint.Basin,
        //         sub_basin: dataPoint.Sub_basin,
        //         name: dataPoint.Name,
        //         ISO_time: dataPoint.ISO_time,
        //         nature: dataPoint.Nature,
        //         wind: dataPoint["Wind(WMO)"],
        //         pressure: dataPoint["Pres(WMO)"],
        //         center: dataPoint.Center,
        //         wind_percentile: dataPoint["Wind(WMO) Percentile"],
        //         pressure_percentile: dataPoint["Pres(WMO) Percentile"],
        //         track_type: dataPoint.Track_type
        //     },
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             dataPoint.Latitude,
        //             dataPoint.Longitude
        //         ]
        //     }
        // };
    });

    // if(dataPoint["Wind(WMO)"] > max_windspeed){
    //     max_windspeed = dataPoint["Wind(WMO)"];
    // }

    // if(dataPoint["Pres(WMO)"] > max_pressure){
    //     max_pressure = dataPoint["Pres(WMO)"];
    // }

    // intensity = intensityCalculator(max_windspeed, "value");

    // const txtFile = "test.txt";
    const str = JSON.stringify(stormsTest);
    // const file = new File([str], txtFile);
    return str
}
