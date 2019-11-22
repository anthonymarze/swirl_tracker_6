// {
//     "Serial_Num": "N/A",
//         "Season": "Year",
//             "Num": "#",
//                 "Basin": "BB",
//                     "Sub_basin": "BB",
//                         "Name": "N/A",
//                             "ISO_time": "YYYY-MM-DD HH:MM:SS",
//                                 "Nature": "N/A",
//                                     "Latitude": "deg_north",
//                                         "Longitude": "deg_east",
//                                             "Wind(WMO)": "kt",
//                                                 "Pres(WMO)": "mb",
//                                                     "Center": "N/A",
//                                                         "Wind(WMO) Percentile": "%",
//                                                             "Pres(WMO) Percentile": "%",
//                                                                 "Track_type": "N/A"
// }

// "coordinates": [[89.5, -11.1], [88.2, -11.3], [86.8, -11.7], [85.7, -11.5], [85.1, -11.3], [84.9, -11.1], [84.7, -11], [84.4, -11.3], [84.1, -12.2], [83.6, -13], [82.5, -13.8], [81.4, -14.5], [80.6, -14.9], [79.7, -15.2], [78.5, -15.6], [78, -15.7], [77.4, -15.9], [76.8, -16.1], [76.3, -16.2], [75.8, -16.4], [75.1, -16.7], [74.4, -17], [73.6, -17.3], [73, -17.5], [72, -17.6], [70.7, -17.7], [70.4, -17.8], [69.9, -18.1], [69, -18.4], [68, -18.4], [67.3, -18.2], [66.6, -17.9], [65.7, -17.6], [65.2, -17.3], [64.9, -17.1], [64.7, -17], [63.9, -16.7], [63.5, -16.6], [62.7, -16.1], [62, -15.5], [61.2, -15], [60.1, -14.4], [58.8, -14.2], [58.4, -14.5], [57.2, -14.7], [55.9, -14.8], [54.9, -15.1], [53.7, -16.3]]}},

export const intensityCalculator = (maxWindSpeed, selector) => {
    if(selector === "color"){
        if (maxWindSpeed >= 137) {
            return "#ff6060";
        } else if (maxWindSpeed < 137 && maxWindSpeed >= 113) {
            return "#ff8f20";
        } else if (maxWindSpeed < 113 && maxWindSpeed >= 96) {
            return "#ffc140";
        } else if (maxWindSpeed < 96 && maxWindSpeed >= 83) {
            return "#ffe775";
        } else if (maxWindSpeed < 83 && maxWindSpeed >= 64) {
            return "#ffffcc";
        } else if (maxWindSpeed < 64 && maxWindSpeed >= 34) {
            return "#00faf4";
        } else if (maxWindSpeed < 34) {
            return "#5ebaff";
        } else {
            return "#cccccc";
        }
    } else if(selector === "value") {
        if (maxWindSpeed >= 137) {
            return "5";
        } else if (maxWindSpeed < 137 && maxWindSpeed >= 113) {
            return "4";
        } else if (maxWindSpeed < 113 && maxWindSpeed >= 96) {
            return "3";
        } else if (maxWindSpeed < 96 && maxWindSpeed >= 83) {
            return "2";
        } else if (maxWindSpeed < 83 && maxWindSpeed >= 64) {
            return "1";
        } else if (maxWindSpeed < 64 && maxWindSpeed >= 34) {
            return "TS";
        } else if (maxWindSpeed < 34) {
            return "TD";
        } else {
            return "undefined";
        }
    }
}

export const intensityColor = (intensity) => {
    if (intensity === "5") {
        return "#ff6060";
    } else if (intensity === "4") {
        return "#ff8f20";
    } else if (intensity === "3") {
        return "#ffc140";
    } else if (intensity === "2") {
        return "#ffe775";
    } else if (intensity === "1") {
        return "#ffffcc";
    } else if (intensity === "TS") {
        return "#00faf4";
    } else if (intensity === "TD") {
        return "#5ebaff";
    } else {
        return "#cccccc";
    }
}