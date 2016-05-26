"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("temperature-blanket", [])
    .controller("TemperatureBlanketCtrl", function($scope, getWeatherData) {
    
    getWeatherData().then(function(days) {
        // Eventually, these will be gathered from the data or user
        const tempMin = 5;
        const tempMax = 104;
        const numColors = 10;
        const degreeDiff = (tempMax - tempMin)/numColors;
        const yarnColors = [];
        let neutralColor = $("#neutralColor").val();
        let triStepSize = 0;
        let daySize = 4;
        const scaleFactor = 1;
        const colorStats = {};
        const colorArea = {};    
        const colorPercents = {};  
        $scope.defaultColors = [
                "#332546",
                "#624070",
                "#4B4D6B",
                "#074771",
                "#31473D",
                "#48634C",
                "#EBC05B",
                "#D56133",
                "#9D1F33",
                "#7C1623",
                "#000000",
                "#333333",
                "#666666",
                "#aaaaaa",
                "#dddddd",
                "#ffffff"
        ];
        $scope.blanketParams = {
            numColors: 10,
            colors: []
        };
        
        function matchDefaultColors() {
            _.range($scope.blanketParams.colors.length, $scope.blanketParams.numColors)
                .forEach(num => $scope.blanketParams.colors.push($scope.defaultColors[num]));
        }
        
        $scope.$watch($scope.blanketParams.numColors, () => {
            matchDefaultColors();
        }, true);
        
        const canvas = document.getElementById("canvas").getContext("2d");
        canvas.scale(scaleFactor, scaleFactor);
        canvas.translate(1200, 0);
        
        $scope.updateOptions = function() {
            getColorInput();
            neutralColor = $("#neutralColor").val();
            drawBlanket(checkNeutralOptions());
            calculatePercent();
        }
        
        function checkNeutralOptions() {
            const isChecked = {};
            $("input[type='checkbox']").each(function(index, color) {
                if($(color).prop("checked")) {
                    isChecked[$(color).val()] = true;
                } else {
                    isChecked[$(color).val()] = false;
                }
            });
            console.log(isChecked);
            return isChecked;
        }
        
        function getColorInput() {
            $("#colors input").each(function(index, color) {
                yarnColors[index] = $(color).val();
            });
        }
        
        function addColorStats () {
            for (let i = 0; i < yarnColors.length; i++) {
                colorStats[yarnColors[i]] = 0;
                colorArea[yarnColors[i]] = 0;
                colorPercents[yarnColors[i]] = 0;
            }
            colorStats[neutralColor] = 0;
            colorArea[neutralColor] = triStepSize * triStepSize * 2;
            //provides the area of the top and bottom triangles
            // a = h(b/2); h = triStepSize; b = 2 * triStepSize
            colorPercents[neutralColor] = 0;
        }
        
        function calculateArea(smallerX, color) {
            colorArea[color] += smallerX * 4;
        }
        
        function calculatePercent() {
            let total = 0;
            for (const property in colorArea) {
                total += colorArea[property];
            }
            
            for (const property in colorPercents) {
                colorPercents[property] = Math.round((colorArea[property] / total) * 10000) / 100;
            }
        }
       
        function getColor(temp) {
            if (temp >= tempMin && temp <= tempMax){
                const index = Math.floor((temp - tempMin)/degreeDiff);
                return yarnColors[index];
            }
            const err = new Error("Temperature is out of bounds");
            err.temp = temp;
            err.tempMin = tempMin;
            err.tempMax = tempMax;
            throw err;
        }
        
        function drawTopTri() {
            canvas.beginPath();
            canvas.moveTo(0, 0);
            canvas.lineTo(0 + triStepSize, triStepSize);
            canvas.lineTo(0 - triStepSize, triStepSize);
            canvas.fillStyle = neutralColor;
            canvas.fill();
        }
        
        function checkMonthEnd(i, extraRows, options, increase) {
            const today = days[i].CST.split("-");
            let rowNum;
            
            if (options.dayRow) {
                rowNum = 4;
            } else {
                rowNum = 3;
            }
            
            if (days[i + 1]) {
                const tomorrow = days[i + 1].CST.split("-");
                if (parseInt(today[1]) < parseInt(tomorrow[1])) {
                    if (increase) {
                    drawRhombus(rowNum, neutralColor, i, extraRows, true); 
                    } else {
                        drawRhombus(rowNum, neutralColor, i, extraRows, false);
                    }
                    return 1;
                }
            } else {
                drawRhombus(rowNum, neutralColor, i, extraRows, false);
                return 1;
            }
            return 0;
        }
        
        function createRow(i, extraRows, options, shape) {
            let row1Temp = "Min TemperatureF";
            let row2Temp = "Max TemperatureF";
            let increase = true;
            
            if (shape === "decrease") {
                row1Temp = "Max TemperatureF";
                row2Temp = "Min TemperatureF";
                increase = false;
            } 
            
            const color1 = getColor(parseInt(days[i][row1Temp]));
            colorStats[color1]++;
            drawRhombus(1, color1, i, extraRows, increase);
            
            const color2 = getColor(parseInt(days[i][row2Temp]));
            colorStats[color2]++;
            
            if (shape === "increase" || shape === "decrease") {
                drawRhombus(2, color2, i, extraRows, increase);
            } else if (shape === "middle" && options.dayRow) {
                drawMiddle(2, color2, i, extraRows);
                increase = false;
            } else if (shape === "middle" && !options.dayRow) {
                drawRhombus(2, color2, i, extraRows);
            }
            
            if (options.dayRow) {
                colorStats[neutralColor]++;
                drawRhombus(3, neutralColor, i, extraRows, increase);
            }
            
            if (options.monthRow) {
                extraRows += checkMonthEnd(i, extraRows, options, increase);
            }
            
            return extraRows;
        }
       
        function drawMiddle(rowNum, color, i, extraRows) {
            const dayOffset = i * daySize;
            const extraLines = 2 * extraRows;
            const topX = triStepSize + dayOffset + extraLines + 2 * (rowNum - 1);
            const topY = triStepSize + dayOffset + extraLines + 2 * (rowNum - 1);
            const midX = topX + 1;
            const midY = topY + 1;
            const bottomX = topX;
            const bottomY = topY + 2;
            
            canvas.beginPath();
            canvas.moveTo(-topX, topY);
            canvas.lineTo(-midX, midY);
            canvas.lineTo(-bottomX, bottomY);
            canvas.lineTo(bottomX, bottomY);
            canvas.lineTo(midX, midY);
            canvas.lineTo(topX, topY);
            canvas.fillStyle = color;
            canvas.fill();
            
            calculateArea(topX, color);    
        }
        
        function drawRhombus(rowNum, color, i, extraRows, increase) {
            const dayOffsetY = i * daySize;
            const extraLines = 2 * extraRows;
            let dayOffsetX = i * daySize;
            let topX = triStepSize + dayOffsetX + extraLines + 2 * (rowNum - 1);
            const topY = triStepSize + dayOffsetY + extraLines + 2 * (rowNum - 1);
            let bottomX = triStepSize + dayOffsetX + extraLines + 2 * rowNum;
            const bottomY = triStepSize + dayOffsetY + extraLines + 2 * rowNum;
                    
            if (increase) {
                calculateArea(topX, color);
            } else {
                dayOffsetX = (days.length - i) * daySize;
                if (extraRows < 7) {
                    topX = triStepSize + dayOffsetX + extraLines - 2 * (rowNum - 1);
                    bottomX = triStepSize + dayOffsetX + extraLines - 2 * rowNum;
                } else {
                    topX = triStepSize + dayOffsetX + 2 * (2 * daySize - extraRows) - 2 * (rowNum - 1);
                    bottomX = triStepSize + dayOffsetX + 2 * (2 * daySize - extraRows) - 2 * rowNum;
                }
                calculateArea(bottomX, color);
            }
            
            canvas.beginPath();
            canvas.moveTo(-topX, topY);
            canvas.lineTo(-bottomX, bottomY);
            canvas.lineTo(bottomX, bottomY);
            canvas.lineTo(topX, topY);
            canvas.fillStyle = color;
            canvas.fill();
         }
        
        function drawBottomTri(extraRows) {
            const topY = triStepSize + (days.length * daySize) + 2 * extraRows;
            canvas.beginPath();
            canvas.moveTo(-triStepSize, topY);
            canvas.lineTo(0, topY + 5);
            canvas.lineTo(triStepSize, topY);
            canvas.fillStyle = neutralColor;
            canvas.fill();
        }
        
        function drawBlanket(options) {
            // this is to draw a bias blanket 
            let extraRows = 0;
            if (options.triangleCaps) {
                triStepSize = 5;
                drawTopTri();
            }
            
            if (options.dayRow) {
                daySize = 6;
            }
            
            for (let i = 0; i < days.length; i++) {
                if (i < (days.length - 1) / 2) {
                    extraRows = createRow(i, extraRows, options, "increase");
                } else if (i === (days.length - 1) / 2) {
                    extraRows = createRow(i, extraRows, options, "middle");
                } else {
                    extraRows = createRow(i, extraRows, options, "decrease");
                }
            }
            if (options.triangleCaps) {
                drawBottomTri(extraRows);
            }
        }
        addColorStats();
        getColorInput();
        drawBlanket(checkNeutralOptions());        
        console.log(colorStats);
        console.log(colorArea);
        console.log(colorPercents);
    });
});

require("./get-weather-data");