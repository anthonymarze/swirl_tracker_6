export default function updateBasinList(basin, basinList) {
    
    // FORMATS BASIN NAME //

    let basinName = basin.innerHTML;
    basinName = basinName[0] + basinName[basinName.indexOf(" ") + 1];

    debugger

    // REMOVES EMPTY STRING AT START OF NEW CYCLE //

    if (basinList.includes("")) {
        basinList = [];
    }

    if (!basinList.includes(basinName)) {
        basinList.push(basinName);
        basin.style.border = "1px solid red";

    } else {
        let basinIdx = basinList.indexOf(basinName);
        basinList.splice(basinIdx, 1);
        basin.style.border = "none";

        // LEAVE EMPTY STRING IF EMPTY //

        if (basinList.length === 0) {
            basinList.push("")
        }
    }

    return basinList;
}