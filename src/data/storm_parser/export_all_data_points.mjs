import { createAllDataPoints } from "./create_all_data_points.mjs";
import { stormData } from './storm_data.mjs';
import fs from 'fs';

fs.writeFile("./all_storm_data_points", createAllDataPoints(stormData), function (err) {

    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});