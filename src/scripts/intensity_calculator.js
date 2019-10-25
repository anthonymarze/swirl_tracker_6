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