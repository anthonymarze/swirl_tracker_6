export default function toggleAllStormsVisibility(map, visibility) {
    let opposite;
    if(visibility === "visible") {
        opposite = "none";
    } else if (visibility === "none") {
        opposite = "visible";
    }

    map.setLayoutProperty("all-storm-sub-paths", "visibility", opposite);
    // map.setLayoutProperty("all-points", "visibility", opposite)
    map.setLayoutProperty("all-storms", "visibility", visibility);
}