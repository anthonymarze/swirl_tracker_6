// const { DOM, require } = new observablehq.Library;

// require()('@observablehq/stacked-to-grouped-bars').then(data => {

import * as d3 from "d3";
import { intensityColor } from './intensity_calculator.js';

export default function stackedToGrouped(monthlyData) {
    // let monthlyData = [];
    // for(let i = 0; i < 12; i++) {
    //     monthlyData = monthlyData.concat([1, 2, 3, 4, 5, 6, 7]);
    // }
    const intensities = ["TD", "TS", "1", "2", "3", "4", "5"];

    const height = 120;
    // const barPadding = 10;

    const svg = d3.select('#timeline').append('svg')
        .style("opacity", "1")
        .attr("width", '100%')
        .attr("height", height)
        .attr("id", "months-histogram");

    const width = document.getElementById("months-histogram").clientWidth;

    const barWidth = (width / (monthlyData.length));

    for(let i = 0; i < monthlyData.length; i ++) {
            svg.selectAll("rect")
                .data(monthlyData)
                .enter()
                .append("rect")
                .attr("y", function (d) {
                    return height - (d * 10);
                })
                .attr("height", function (d) {
                    return d * 10;
                })
                .attr("width", barWidth)
                .attr("transform", function (d, i) {
                    const translate = [barWidth * i, 0];
                    return "translate(" + translate + ")";
                })
                .style("fill", function (d, i) {
                    return intensityColor(intensities[i % 7]);
                });
    }

    // const chart = svg.selectAll("rect")
    //     .data(monthlyData)
    //     .enter()
    //     .append("rect")
    //     .attr("y", function(d) {
    //         return height - (d * 10);
    //     })
    //     .attr("height", function(d) {
    //         return d * 10;
    //     })
    //     .attr("width", barWidth)
    //     .attr("transform", function(d, i) {
    //         const translate = [barWidth * i, 0];
    //         return "translate(" + translate + ")";
    //     })
    //     .style("fill", "green");
}

