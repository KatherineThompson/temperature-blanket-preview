"use strict";

const angular = require("angular");
const _ = require("lodash");
const getColor = require("./get-color");

angular.module("temperature-blanket", [])
    .controller("TemperatureBlanketCtrl", function($scope, getWeatherData, $window, $document) {
    
    getWeatherData().then(function(days) {
        // $scope.canvasDimensions = _.merge(getCanvasDimensions(), {scaleFactor: .5});
        
        $scope.weatherParams = {
            tempMin: 5,
            tempMax: 104
        };
        
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
        
        // const canvas = $document[0].getElementById("canvas").getContext("2d");
        
        function getCanvasDimensions() {
            const canvasDiv = $document[0].getElementById("canvas-div");
            return {
                height: canvasDiv.clientHeight,
                width: canvasDiv.clientWidth
            };
        }
        
        // $window.addEventListener(
        //     "resize",
        //     () => $scope.$apply(() => $scope.canvasDimensions = getCanvasDimensions()),
        //     true
        // );
        
        // $scope.$watch("[canvasDimensions.width, canvasDimensions.height]", () => {
        //     canvas.translate($scope.canvasDimensions.width / 2, 0);
        //     canvas.scale($scope.canvasDimensions.scaleFactor, $scope.canvasDimensions.scaleFactor);
        //     drawBlanket(getDrawBlanketOpts());
        // }, true);
        
        // $scope.$watch("blanketParams", () => {
        //     drawBlanket(getDrawBlanketOpts());
        // }, true);
        
        function getDrawBlanketOpts() {
            return {
                triStepSize: $scope.blanketParams.options.triangleCaps ? 5 : 0,
                daySize: $scope.blanketParams.options.dayRow ? 6 : 4
            };
        }
        
        function drawTopTri(triStepSize) {
            canvas.beginPath();
            canvas.moveTo(0, 0);
            canvas.lineTo(0 + triStepSize, triStepSize);
            canvas.lineTo(0 - triStepSize, triStepSize);
            canvas.fillStyle = $scope.blanketParams.neutralColor;
            canvas.fill();
        }
        
        function checkMonthEnd(i, extraRows, options, increase, opts) {
            const today = days[i].CST.split("-");
            const rowNum = $scope.blanketParams.options.dayRow ? 4 : 3;
            
            if (days[i + 1]) {
                const tomorrow = days[i + 1].CST.split("-");
                if (parseInt(today[1]) < parseInt(tomorrow[1])) {
                    if (increase) {
                    drawRhombus(rowNum, $scope.blanketParams.neutralColor, i, extraRows, true, opts); 
                    } else {
                        drawRhombus(rowNum, $scope.blanketParams.neutralColor, i, extraRows, false, opts);
                    }
                    return true;
                }
            } else {
                drawRhombus(rowNum, $scope.blanketParams.neutralColor, i, extraRows, false, opts);
                return true;
            }
            return false;
        }
        
        function createRow(i, extraRows, shape, opts) {
            const row1Temp = shape === "decrease" ? "Max TemperatureF" : "Min TemperatureF";
            const row2Temp = shape === "decrease" ? "Min TemperatureF" : "Max TemperatureF";
            let increase = shape === "decrease" ? false : true ;
            
            const color1 = getColor(parseInt(days[i][row1Temp]), $scope.weatherParams, $scope.blanketParams);
            drawRhombus(1, color1, i, extraRows, increase, opts);
            
            const color2 = getColor(parseInt(days[i][row2Temp]), $scope.weatherParams, $scope.blanketParams);
            
            if (shape === "increase" || shape === "decrease") {
                drawRhombus(2, color2, i, extraRows, increase, opts);
            } else if (shape === "middle" && $scope.blanketParams.options.dayRow) {
                drawMiddle(2, color2, i, extraRows, opts);
                increase = false;
            } else if (shape === "middle" && !$scope.blanketParams.options.dayRow) {
                increase = false;
                drawRhombus(2, color2, i, extraRows, increase, opts);
            }
            
            if ($scope.blanketParams.options.dayRow) {
                drawRhombus(3, $scope.blanketParams.neutralColor, i, extraRows, increase, opts);
            }
            
            if ($scope.blanketParams.options.monthRow) {
                extraRows += checkMonthEnd(i, extraRows, $scope.blanketParams.options, increase, opts) ? 1 : 0;
            }
            
            return extraRows;
        }
       
        function drawMiddle(rowNum, color, i, extraRows, {triStepSize, daySize}) {
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
        }
        
        function drawRhombus(rowNum, color, i, extraRows, increase, {triStepSize, daySize}) {
            const dayOffsetY = i * daySize;
            const extraLines = 2 * extraRows;
            let dayOffsetX = i * daySize;
            let topX = triStepSize + dayOffsetX + extraLines + 2 * (rowNum - 1);
            const topY = triStepSize + dayOffsetY + extraLines + 2 * (rowNum - 1);
            let bottomX = triStepSize + dayOffsetX + extraLines + 2 * rowNum;
            const bottomY = triStepSize + dayOffsetY + extraLines + 2 * rowNum;
                    
            if (!increase) {
                dayOffsetX = (days.length - i) * daySize;
                if (extraRows < 7) {
                    topX = triStepSize + dayOffsetX + extraLines - 2 * (rowNum - 1);
                    bottomX = triStepSize + dayOffsetX + extraLines - 2 * rowNum;
                } else {
                    topX = triStepSize + dayOffsetX + 2 * (2 * daySize - extraRows) - 2 * (rowNum - 1);
                    bottomX = triStepSize + dayOffsetX + 2 * (2 * daySize - extraRows) - 2 * rowNum;
                }
            }
            
            canvas.beginPath();
            canvas.moveTo(-topX, topY);
            canvas.lineTo(-bottomX, bottomY);
            canvas.lineTo(bottomX, bottomY);
            canvas.lineTo(topX, topY);
            canvas.fillStyle = color;
            canvas.fill();
         }
        
        function drawBottomTri(extraRows, {triStepSize, daySize}) {
            const topY = triStepSize + (days.length * daySize) + 2 * extraRows;
            canvas.beginPath();
            canvas.moveTo(-triStepSize, topY);
            canvas.lineTo(0, topY + 5);
            canvas.lineTo(triStepSize, topY);
            canvas.fillStyle = $scope.blanketParams.neutralColor;
            canvas.fill();
        }
        
        function drawBlanket(opts) {
            // this is to draw a bias blanket 
            canvas.clearRect(-2400, 0, 4800, 4800);
            let extraRows = 0;
            if ($scope.blanketParams.options.triangleCaps) {
                drawTopTri(opts.triStepSize);
            }
            
            for (let i = 0; i < days.length; i++) {
                if (i < (days.length - 1) / 2) {
                    extraRows = createRow(i, extraRows, "increase", opts);
                } else if (i === (days.length - 1) / 2) {
                    extraRows = createRow(i, extraRows, "middle", opts);
                } else {
                    extraRows = createRow(i, extraRows, "decrease", opts);
                }
            }
            
            if ($scope.blanketParams.options.triangleCaps) {
                drawBottomTri(extraRows, opts);
            }
        }
        
        // drawBlanket(getDrawBlanketOpts());        
    });
});

require("./get-weather-data");