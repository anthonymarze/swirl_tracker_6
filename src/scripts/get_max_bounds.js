export const getMaxBounds = (coords) => {
    let minLat = coords[0][0];
    let minLong = coords[0][1];
    let maxLat = coords[0][0];
    let maxLong = coords[0][1];

    coords.forEach(coord => {
        if(coord[0] < minLat){
            minLat = coord[0];
        };
        if (coord[1] < minLong) {
            minLong = coord[1];
        };
        if (coord[0] > maxLat) {
            maxLat = coord[0];
        };
        if (coord[1] > maxLong) {
            maxLong = coord[1];
        };
    });

    return [[minLat, minLong], [maxLat, maxLong]];
}