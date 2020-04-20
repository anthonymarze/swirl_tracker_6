import toggleAllStormsVisibility from './toggleAllStormsVisibility.js';

export default function toggleDetailedPaths(map) {
    if (map.getLayoutProperty("all-storms", "visibility") === "visible") {
        toggleAllStormsVisibility(map, "none");
        document.getElementById("detailed-paths").style.border = "2px solid red";
    }
    else if (map.getLayoutProperty("all-storms", "visibility") === "none") {
        toggleAllStormsVisibility(map, "visible");
        document.getElementById("detailed-paths").style.border = "1px solid #696969";
    }
}