import filterAll from './filterAll.js';
import toggleAllStormsVisibility from './toggleAllStormsVisibility.js';

export default function resetFields(map, defaultFilter){

    // NOT SURE WHAT IS HAPPENING WITH SET TIMEOUT HERE //

    setTimeout(
        map.flyTo({
            zoom: 3,
            center: [-77.38, 39],
            essential: true
        })
        , 5000);

    filterAll(map, defaultFilter);
    toggleAllStormsVisibility(map, "visible");
    document.getElementById("detailed-paths").style.backgroundColor = "#fff";
    document.getElementById("start-year").value = "2000";
    document.getElementById("name").value = "";

    // CLEARS INFO BOX INFORMATION //

    const detailBox = document.getElementById("detail-box");

    for(let i = 0; i < detailBox.childElementCount; i++) {
        detailBox.children[i].innerHTML = "";
    }

    document.getElementById("info-box").style.display = "none";
}