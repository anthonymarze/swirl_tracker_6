import { intensityColor } from './intensity_calculator.js';

export default function updateIntensityVals(intensity, intensityVals) {

    // REMOVES EMPTY STRING AT START OF NEW CYCLE //

    if(intensityVals.includes("")){
        intensityVals = [];
    }

    if (!intensityVals.includes(intensity)) {
        intensityVals.push(intensity);
        document.getElementById(`hi-${intensity}`).style.backgroundColor = intensityColor(intensity);
    } else {
        let intensityIdx = intensityVals.indexOf(intensity);
        intensityVals.splice(intensityIdx, 1);

        // LEAVE EMPTY STRING IF EMPTY //

        if(intensityVals.length === 0){
            intensityVals.push("")
        }

        document.getElementById(`hi-${intensity}`).style.backgroundColor = "#FFF";
    }

    return intensityVals;
}