import { createAllSubPaths } from "./create_all_sub_paths.mjs";
import { stormData } from './storm_data.mjs';
import fs from 'fs';

fs.writeFile("./all_storm_sub_paths", createAllSubPaths(stormData), function (err) {

    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});