"use strict";

const _ = require("lodash");

function getColor(temp, weatherParams, blanketParams) {
    if (_.inRange(temp, weatherParams.tempMin, weatherParams.tempMax + 1)){
        const degreeDiff = (weatherParams.tempMax - weatherParams.tempMin + 1) / blanketParams.numColors;
        const index = Math.floor((temp - weatherParams.tempMin) / degreeDiff);
        return blanketParams.colors[index];
    }
    const err = new Error("Temperature is out of bounds");
    err.temp = temp;
    err.tempMin = weatherParams.tempMin;
    err.tempMax = weatherParams.tempMax;
    throw err;
}

module.exports = getColor;