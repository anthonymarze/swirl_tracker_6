import toggleAllStormsVisibility from './toggleAllStormsVisibility.js';

export default function toggleDetailedPaths(map) {
    if (map.getLayoutProperty("all-storms", "visibility") === "visible") {
        toggleAllStormsVisibility(map, "none");
        document.getElementById("detailed-paths").style.backgroundColor = "#e6e6e6";
    }
    else if (map.getLayoutProperty("all-storms", "visibility") === "none") {
        toggleAllStormsVisibility(map, "visible");
        document.getElementById("detailed-paths").style.backgroundColor = "#fff";
    }
}