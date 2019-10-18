export const readStormData = (file, callback) => {
    const rawFile = new XMLHttpRequest();
    rawFile.responseType = "json";
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        debugger
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.response);
        }
    }
    rawFile.send(null);
}