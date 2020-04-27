export default function createDefaultFilter(intensity, season, name, basin, month) {
    let filter = ["all",
        ["match", ["get", "intensity"], intensity, true, false],
        ["match", ["get", "season"], season, true, false],
        // ["match", ["slice", ["get", "name"], 0, stormName.length], stormName, true, false],
        ["in", name, ["get", "name_sub_strings"]],
        ["match", ["get", "basin"], basin, true, false],
        ["match", ["get", "month"], month, true, false],
    ];

    return filter;
}