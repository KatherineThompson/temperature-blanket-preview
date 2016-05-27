"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("temperature-blanket", [])
    .controller("TemperatureBlanketCtrl", function($scope, getWeatherData, $window) {
    
    getWeatherData().then(function(days) {
        const yarnColors = [];
        const neutralColor = $("#neutralColor").val();
        const colorStats = {};
        const colorArea = {};    
        const colorPercents = {};  
        
        $scope.canvasDimensions = {
            height: window.innerHeight,
            width: (window.innerWidth / 12) * 9,
            scaleFactor: .5
        };
        
        $scope.weatherParams = {
            tempMin: 5,
            tempMax: 104,
        }
        
        
        $scope.blanketParams = {
            numColors: 10,
            colors: [
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
                "#666666",
                "#aaaaaa",
                "#dddddd",
                "#ffffff"
            ],
            options: {
                dayRow: true,
                monthRow: true,
                triangleCaps: true
            },
            neutralColor: "#6C7073",
            triStepSize: 5,
            daySize: 6
        };
        
        const canvas = document.getElementById("canvas").getContext("2d");
        
        window.addEventListener("resize", function() {
            $scope.$apply(() => {
                $scope.canvasDimensions.height = $window.innerHeight;
                $scope.canvasDimensions.width = ($window.innerWidth/ 12) * 9;
            });
        }, true);
        
        $scope.$watch("[canvasDimensions.width, canvasDimensions.height]", () => {
            canvas.translate($scope.canvasDimensions.width / 2, 0);
            canvas.scale($scope.canvasDimensions.scaleFactor, $scope.canvasDimensions.scaleFactor);
            drawBlanket();
        }, true);
        
        $scope.$watch("blanketParams", () => {
            $scope.blanketParams.triStepSize = $scope.blanketParams.options.triangleCaps ? 5 : 0;
            $scope.blanketParams.daySize = $scope.blanketParams.options.dayRow ? 6 : 4;
            drawBlanket();
        }, true);
        
        function addColorStats () {
            for (let i = 0; i < yarnColors.length; i++) {
                colorStats[yarnColors[i]] = 0;
                colorArea[yarnColors[i]] = 0;
                colorPercents[yarnColors[i]] = 0;
            }
            colorStats[neutralColor] = 0;
            colorArea[neutralColor] = $scope.blanketParams.triStepSize * $scope.blanketParams.triStepSize * 2;
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
            if (_.inRange(temp, $scope.weatherParams.tempMin, $scope.weatherParams.tempMax + 1)){
                const degreeDiff = ($scope.weatherParams.tempMax - $scope.weatherParams.tempMin) /
                    $scope.blanketParams.numColors;
                const index = Math.floor((temp - $scope.weatherParams.tempMin) / degreeDiff);
                return $scope.blanketParams.colors[index];
            }
            const err = new Error("Temperature is out of bounds");
            err.temp = temp;
            err.tempMin = $scope.weatherParams.tempMin;
            err.tempMax = $scope.weatherParams.tempMax;
            throw err;
        }
        
        function drawTopTri() {
            canvas.beginPath();
            canvas.moveTo(0, 0);
            canvas.lineTo(0 + $scope.blanketParams.triStepSize, $scope.blanketParams.triStepSize);
            canvas.lineTo(0 - $scope.blanketParams.triStepSize, $scope.blanketParams.triStepSize);
            canvas.fillStyle = $scope.blanketParams.neutralColor;
            canvas.fill();
        }
        
        function checkMonthEnd(i, extraRows, options, increase) {
            const today = days[i].CST.split("-");
            const rowNum = $scope.blanketParams.options.dayRow ? 4 : 3;
            
            if (days[i + 1]) {
                const tomorrow = days[i + 1].CST.split("-");
                if (parseInt(today[1]) < parseInt(tomorrow[1])) {
                    if (increase) {
                    drawRhombus(rowNum, neutralColor, i, extraRows, true); 
                    } else {
                        drawRhombus(rowNum, neutralColor, i, extraRows, false);
                    }
                    return true;
                }
            } else {
                drawRhombus(rowNum, neutralColor, i, extraRows, false);
                return true;
            }
            return false;
        }
        
        function createRow(i, extraRows, options, shape) {
            const row1Temp = shape === "decrease" ? "Max TemperatureF" : "Min TemperatureF";
            const row2Temp = shape === "decrease" ? "Min TemperatureF" : "Max TemperatureF";
            let increase = shape === "decrease" ? false : true ;
            
            const color1 = getColor(parseInt(days[i][row1Temp]));
            colorStats[color1]++;
            drawRhombus(1, color1, i, extraRows, increase);
            
            const color2 = getColor(parseInt(days[i][row2Temp]));
            colorStats[color2]++;
            
            if (shape === "increase" || shape === "decrease") {
                drawRhombus(2, color2, i, extraRows, increase);
            } else if (shape === "middle" && $scope.blanketParams.options.dayRow) {
                drawMiddle(2, color2, i, extraRows);
                increase = false;
            } else if (shape === "middle" && !$scope.blanketParams.options.dayRow) {
                drawRhombus(2, color2, i, extraRows);
            }
            
            if ($scope.blanketParams.options.dayRow) {
                colorStats[neutralColor]++;
                drawRhombus(3, neutralColor, i, extraRows, increase);
            }
            
            if ($scope.blanketParams.options.monthRow) {
                extraRows += checkMonthEnd(i, extraRows, options, increase) ? 1 : 0;
            }
            
            return extraRows;
        }
       
        function drawMiddle(rowNum, color, i, extraRows) {
            const dayOffset = i * $scope.blanketParams.daySize;
            const extraLines = 2 * extraRows;
            const topX = $scope.blanketParams.triStepSize + dayOffset + extraLines + 2 * (rowNum - 1);
            const topY = $scope.blanketParams.triStepSize + dayOffset + extraLines + 2 * (rowNum - 1);
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
            const dayOffsetY = i * $scope.blanketParams.daySize;
            const extraLines = 2 * extraRows;
            let dayOffsetX = i * $scope.blanketParams.daySize;
            let topX = $scope.blanketParams.triStepSize + dayOffsetX + extraLines + 2 * (rowNum - 1);
            const topY = $scope.blanketParams.triStepSize + dayOffsetY + extraLines + 2 * (rowNum - 1);
            let bottomX = $scope.blanketParams.triStepSize + dayOffsetX + extraLines + 2 * rowNum;
            const bottomY = $scope.blanketParams.triStepSize + dayOffsetY + extraLines + 2 * rowNum;
                    
            if (increase) {
                calculateArea(topX, color);
            } else {
                dayOffsetX = (days.length - i) * $scope.blanketParams.daySize;
                if (extraRows < 7) {
                    topX = $scope.blanketParams.triStepSize + dayOffsetX + extraLines - 2 * (rowNum - 1);
                    bottomX = $scope.blanketParams.triStepSize + dayOffsetX + extraLines - 2 * rowNum;
                } else {
                    topX = $scope.blanketParams.triStepSize + dayOffsetX + 2 * (2 * $scope.blanketParams.daySize - extraRows) - 2 * (rowNum - 1);
                    bottomX = $scope.blanketParams.triStepSize + dayOffsetX + 2 * (2 * $scope.blanketParams.daySize - extraRows) - 2 * rowNum;
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
            const topY = $scope.blanketParams.triStepSize + (days.length * $scope.blanketParams.daySize) + 2 * extraRows;
            canvas.beginPath();
            canvas.moveTo(-$scope.blanketParams.triStepSize, topY);
            canvas.lineTo(0, topY + 5);
            canvas.lineTo($scope.blanketParams.triStepSize, topY);
            canvas.fillStyle = neutralColor;
            canvas.fill();
        }
        
        function drawBlanket() {
            // this is to draw a bias blanket 
            const options = $scope.blanketParams.options;
            let extraRows = 0;
            if ($scope.blanketParams.options.triangleCaps) {
                drawTopTri();
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
            if ($scope.blanketParams.options.triangleCaps) {
                drawBottomTri(extraRows);
            }
        }
        addColorStats();
        drawBlanket();        
    });
});

require("./get-weather-data");