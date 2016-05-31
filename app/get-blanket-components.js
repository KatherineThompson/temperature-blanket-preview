"use strict";

const getColor = require("./get-color");
const moment = require("moment");

function getBlanketComponents(weatherParams, blanketParams, weatherData) {
    const components = [];
    const numDaySeparators = blanketParams.options.dayRow ? weatherData.length - 1 : 0;
    const numMonthSeparators = blanketParams.options.monthRow ? 11 : 0;
    const numRows = weatherData.length * 2 + numDaySeparators + numMonthSeparators;
    // numRows excludes triangle caps
    
    function pushRow(color) {
        components.push({type: "row", color});
    }
    
    function getMonth(day) {
        return moment(day, "YYYY-M-D").month();
    }
    
    weatherData.forEach((day, index) => {
        const minTempColor = day["Min TemperatureF"] ?
            getColor(parseInt(day["Min TemperatureF"]), weatherParams, blanketParams) : blanketParams.neutralColor;
        const maxTempColor = day["Max TemperatureF"] ?
            getColor(parseInt(day["Max TemperatureF"]), weatherParams, blanketParams) : blanketParams.neutralColor;
        
        if (components.length <= numRows / 2) {
            pushRow(minTempColor);
            pushRow(maxTempColor);
        } else {
            pushRow(maxTempColor);
            pushRow(minTempColor);
        }
        
        if (index !== weatherData.length - 1) {
            if (blanketParams.options.dayRow) {
                pushRow(blanketParams.neutralColor);
            }
            const todaysMonth = getMonth(day.CST);
            const tomorrowsMonth = getMonth(weatherData[index + 1].CST);
            if (blanketParams.options.monthRow && todaysMonth < tomorrowsMonth) {
                pushRow(blanketParams.neutralColor);
            }
        }
    });
    
    if (blanketParams.options.triangleCaps) {
        components.unshift({type: "triangle", color: blanketParams.neutralColor});
        components.push({type: "triangle", color: blanketParams.neutralColor});
    }

    return components;
}

module.exports = getBlanketComponents;