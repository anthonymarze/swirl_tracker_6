import { createGeoJSON } from "./create_geo_json.mjs";
import { stormData } from './storm_data.mjs';
import fs from 'fs';

fs.writeFile("./all_storm_paths_new", createGeoJSON(stormData), function (err) {

    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});