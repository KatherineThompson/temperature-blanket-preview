/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	window.addEventListener("load", function () {
	    $.getJSON("./data/wileyPost.json", function (days) {
	        // Eventually, these will be gathered from the data or user
	        var tempMin = 5;
	        var tempMax = 104;
	        var numColors = 10;
	        var degreeDiff = (tempMax - tempMin) / numColors;
	        var yarnColors = [];
	        var neutralColor = $("#neutralColor").val();
	        var triStepSize = 0;
	        var daySize = 4;
	        var scaleFactor = 1;
	        var colorStats = {};
	        var colorArea = {};
	        var colorPercents = {};
	
	        var canvas = document.getElementById("canvas").getContext("2d");
	        canvas.scale(scaleFactor, scaleFactor);
	        canvas.translate(1200, 0);
	
	        $("#submitButton").click(function () {
	            getColorInput();
	            neutralColor = $("#neutralColor").val();
	            drawBlanket(checkNeutralOptions());
	            calculatePercent();
	        });
	
	        function checkNeutralOptions() {
	            var isChecked = {};
	            $("input[type='checkbox']").each(function (index, color) {
	                if ($(color).prop("checked")) {
	                    isChecked[$(color).val()] = true;
	                } else {
	                    isChecked[$(color).val()] = false;
	                }
	            });
	            console.log(isChecked);
	            return isChecked;
	        }
	
	        function getColorInput() {
	            $("#colors input").each(function (index, color) {
	                yarnColors[index] = $(color).val();
	            });
	        }
	
	        function addColorStats() {
	            for (var i = 0; i < yarnColors.length; i++) {
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
	            var total = 0;
	            for (var property in colorArea) {
	                total += colorArea[property];
	            }
	
	            for (var _property in colorPercents) {
	                colorPercents[_property] = Math.round(colorArea[_property] / total * 10000) / 100;
	            }
	        }
	
	        function getColor(temp) {
	            if (temp >= tempMin && temp <= tempMax) {
	                var index = Math.floor((temp - tempMin) / degreeDiff);
	                return yarnColors[index];
	            }
	            var err = new Error("Temperature is out of bounds");
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
	            var today = days[i].CST.split("-");
	            var rowNum = void 0;
	
	            if (options.dayRow) {
	                rowNum = 4;
	            } else {
	                rowNum = 3;
	            }
	
	            if (days[i + 1]) {
	                var tomorrow = days[i + 1].CST.split("-");
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
	            var row1Temp = "Min TemperatureF";
	            var row2Temp = "Max TemperatureF";
	            var increase = true;
	
	            if (shape === "decrease") {
	                row1Temp = "Max TemperatureF";
	                row2Temp = "Min TemperatureF";
	                increase = false;
	            }
	
	            var color1 = getColor(parseInt(days[i][row1Temp]));
	            colorStats[color1]++;
	            drawRhombus(1, color1, i, extraRows, increase);
	
	            var color2 = getColor(parseInt(days[i][row2Temp]));
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
	            var dayOffset = i * daySize;
	            var extraLines = 2 * extraRows;
	            var topX = triStepSize + dayOffset + extraLines + 2 * (rowNum - 1);
	            var topY = triStepSize + dayOffset + extraLines + 2 * (rowNum - 1);
	            var midX = topX + 1;
	            var midY = topY + 1;
	            var bottomX = topX;
	            var bottomY = topY + 2;
	
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
	            var dayOffsetY = i * daySize;
	            var extraLines = 2 * extraRows;
	            var dayOffsetX = i * daySize;
	            var topX = triStepSize + dayOffsetX + extraLines + 2 * (rowNum - 1);
	            var topY = triStepSize + dayOffsetY + extraLines + 2 * (rowNum - 1);
	            var bottomX = triStepSize + dayOffsetX + extraLines + 2 * rowNum;
	            var bottomY = triStepSize + dayOffsetY + extraLines + 2 * rowNum;
	
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
	            var topY = triStepSize + days.length * daySize + 2 * extraRows;
	            canvas.beginPath();
	            canvas.moveTo(-triStepSize, topY);
	            canvas.lineTo(0, topY + 5);
	            canvas.lineTo(triStepSize, topY);
	            canvas.fillStyle = neutralColor;
	            canvas.fill();
	        }
	
	        function drawBlanket(options) {
	            // this is to draw a bias blanket
	            var extraRows = 0;
	            if (options.triangleCaps) {
	                triStepSize = 5;
	                drawTopTri();
	            }
	
	            if (options.dayRow) {
	                daySize = 6;
	            }
	
	            for (var i = 0; i < days.length; i++) {
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzY5NmFiZGU1ZmNlMTJkMDczZTQiLCJ3ZWJwYWNrOi8vLy4vYXBwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBLFFBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBWTtBQUN4QyxPQUFFLE9BQUYsQ0FBVSx1QkFBVixFQUFtQyxVQUFTLElBQVQsRUFBZTs7QUFFOUMsYUFBTSxVQUFVLENBQWhCO0FBQ0EsYUFBTSxVQUFVLEdBQWhCO0FBQ0EsYUFBTSxZQUFZLEVBQWxCO0FBQ0EsYUFBTSxhQUFhLENBQUMsVUFBVSxPQUFYLElBQW9CLFNBQXZDO0FBQ0EsYUFBTSxhQUFhLEVBQW5CO0FBQ0EsYUFBSSxlQUFlLEVBQUUsZUFBRixFQUFtQixHQUFuQixFQUFuQjtBQUNBLGFBQUksY0FBYyxDQUFsQjtBQUNBLGFBQUksVUFBVSxDQUFkO0FBQ0EsYUFBTSxjQUFjLENBQXBCO0FBQ0EsYUFBTSxhQUFhLEVBQW5CO0FBQ0EsYUFBTSxZQUFZLEVBQWxCO0FBQ0EsYUFBTSxnQkFBZ0IsRUFBdEI7O0FBRUEsYUFBTSxTQUFTLFNBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxVQUFsQyxDQUE2QyxJQUE3QyxDQUFmO0FBQ0EsZ0JBQU8sS0FBUCxDQUFhLFdBQWIsRUFBMEIsV0FBMUI7QUFDQSxnQkFBTyxTQUFQLENBQWlCLElBQWpCLEVBQXVCLENBQXZCOztBQUVBLFdBQUUsZUFBRixFQUFtQixLQUFuQixDQUF5QixZQUFXO0FBQ2hDO0FBQ0EsNEJBQWUsRUFBRSxlQUFGLEVBQW1CLEdBQW5CLEVBQWY7QUFDQSx5QkFBWSxxQkFBWjtBQUNBO0FBQ0gsVUFMRDs7QUFPQSxrQkFBUyxtQkFBVCxHQUErQjtBQUMzQixpQkFBTSxZQUFZLEVBQWxCO0FBQ0EsZUFBRSx3QkFBRixFQUE0QixJQUE1QixDQUFpQyxVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDcEQscUJBQUcsRUFBRSxLQUFGLEVBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBSCxFQUE2QjtBQUN6QiwrQkFBVSxFQUFFLEtBQUYsRUFBUyxHQUFULEVBQVYsSUFBNEIsSUFBNUI7QUFDSCxrQkFGRCxNQUVPO0FBQ0gsK0JBQVUsRUFBRSxLQUFGLEVBQVMsR0FBVCxFQUFWLElBQTRCLEtBQTVCO0FBQ0g7QUFDSixjQU5EO0FBT0EscUJBQVEsR0FBUixDQUFZLFNBQVo7QUFDQSxvQkFBTyxTQUFQO0FBQ0g7O0FBRUQsa0JBQVMsYUFBVCxHQUF5QjtBQUNyQixlQUFFLGVBQUYsRUFBbUIsSUFBbkIsQ0FBd0IsVUFBUyxLQUFULEVBQWdCLEtBQWhCLEVBQXVCO0FBQzNDLDRCQUFXLEtBQVgsSUFBb0IsRUFBRSxLQUFGLEVBQVMsR0FBVCxFQUFwQjtBQUNILGNBRkQ7QUFHSDs7QUFFRCxrQkFBUyxhQUFULEdBQTBCO0FBQ3RCLGtCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksV0FBVyxNQUEvQixFQUF1QyxHQUF2QyxFQUE0QztBQUN4Qyw0QkFBVyxXQUFXLENBQVgsQ0FBWCxJQUE0QixDQUE1QjtBQUNBLDJCQUFVLFdBQVcsQ0FBWCxDQUFWLElBQTJCLENBQTNCO0FBQ0EsK0JBQWMsV0FBVyxDQUFYLENBQWQsSUFBK0IsQ0FBL0I7QUFDSDtBQUNELHdCQUFXLFlBQVgsSUFBMkIsQ0FBM0I7QUFDQSx1QkFBVSxZQUFWLElBQTBCLGNBQWMsV0FBZCxHQUE0QixDQUF0RDs7O0FBR0EsMkJBQWMsWUFBZCxJQUE4QixDQUE5QjtBQUNIOztBQUVELGtCQUFTLGFBQVQsQ0FBdUIsUUFBdkIsRUFBaUMsS0FBakMsRUFBd0M7QUFDcEMsdUJBQVUsS0FBVixLQUFvQixXQUFXLENBQS9CO0FBQ0g7O0FBRUQsa0JBQVMsZ0JBQVQsR0FBNEI7QUFDeEIsaUJBQUksUUFBUSxDQUFaO0FBQ0Esa0JBQUssSUFBTSxRQUFYLElBQXVCLFNBQXZCLEVBQWtDO0FBQzlCLDBCQUFTLFVBQVUsUUFBVixDQUFUO0FBQ0g7O0FBRUQsa0JBQUssSUFBTSxTQUFYLElBQXVCLGFBQXZCLEVBQXNDO0FBQ2xDLCtCQUFjLFNBQWQsSUFBMEIsS0FBSyxLQUFMLENBQVksVUFBVSxTQUFWLElBQXNCLEtBQXZCLEdBQWdDLEtBQTNDLElBQW9ELEdBQTlFO0FBQ0g7QUFDSjs7QUFFRCxrQkFBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCO0FBQ3BCLGlCQUFJLFFBQVEsT0FBUixJQUFtQixRQUFRLE9BQS9CLEVBQXVDO0FBQ25DLHFCQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsQ0FBQyxPQUFPLE9BQVIsSUFBaUIsVUFBNUIsQ0FBZDtBQUNBLHdCQUFPLFdBQVcsS0FBWCxDQUFQO0FBQ0g7QUFDRCxpQkFBTSxNQUFNLElBQUksS0FBSixDQUFVLDhCQUFWLENBQVo7QUFDQSxpQkFBSSxJQUFKLEdBQVcsSUFBWDtBQUNBLGlCQUFJLE9BQUosR0FBYyxPQUFkO0FBQ0EsaUJBQUksT0FBSixHQUFjLE9BQWQ7QUFDQSxtQkFBTSxHQUFOO0FBQ0g7O0FBRUQsa0JBQVMsVUFBVCxHQUFzQjtBQUNsQixvQkFBTyxTQUFQO0FBQ0Esb0JBQU8sTUFBUCxDQUFjLENBQWQsRUFBaUIsQ0FBakI7QUFDQSxvQkFBTyxNQUFQLENBQWMsSUFBSSxXQUFsQixFQUErQixXQUEvQjtBQUNBLG9CQUFPLE1BQVAsQ0FBYyxJQUFJLFdBQWxCLEVBQStCLFdBQS9CO0FBQ0Esb0JBQU8sU0FBUCxHQUFtQixZQUFuQjtBQUNBLG9CQUFPLElBQVA7QUFDSDs7QUFFRCxrQkFBUyxhQUFULENBQXVCLENBQXZCLEVBQTBCLFNBQTFCLEVBQXFDLE9BQXJDLEVBQThDLFFBQTlDLEVBQXdEO0FBQ3BELGlCQUFNLFFBQVEsS0FBSyxDQUFMLEVBQVEsR0FBUixDQUFZLEtBQVosQ0FBa0IsR0FBbEIsQ0FBZDtBQUNBLGlCQUFJLGVBQUo7O0FBRUEsaUJBQUksUUFBUSxNQUFaLEVBQW9CO0FBQ2hCLDBCQUFTLENBQVQ7QUFDSCxjQUZELE1BRU87QUFDSCwwQkFBUyxDQUFUO0FBQ0g7O0FBRUQsaUJBQUksS0FBSyxJQUFJLENBQVQsQ0FBSixFQUFpQjtBQUNiLHFCQUFNLFdBQVcsS0FBSyxJQUFJLENBQVQsRUFBWSxHQUFaLENBQWdCLEtBQWhCLENBQXNCLEdBQXRCLENBQWpCO0FBQ0EscUJBQUksU0FBUyxNQUFNLENBQU4sQ0FBVCxJQUFxQixTQUFTLFNBQVMsQ0FBVCxDQUFULENBQXpCLEVBQWdEO0FBQzVDLHlCQUFJLFFBQUosRUFBYztBQUNkLHFDQUFZLE1BQVosRUFBb0IsWUFBcEIsRUFBa0MsQ0FBbEMsRUFBcUMsU0FBckMsRUFBZ0QsSUFBaEQ7QUFDQyxzQkFGRCxNQUVPO0FBQ0gscUNBQVksTUFBWixFQUFvQixZQUFwQixFQUFrQyxDQUFsQyxFQUFxQyxTQUFyQyxFQUFnRCxLQUFoRDtBQUNIO0FBQ0QsNEJBQU8sQ0FBUDtBQUNIO0FBQ0osY0FWRCxNQVVPO0FBQ0gsNkJBQVksTUFBWixFQUFvQixZQUFwQixFQUFrQyxDQUFsQyxFQUFxQyxTQUFyQyxFQUFnRCxLQUFoRDtBQUNBLHdCQUFPLENBQVA7QUFDSDtBQUNELG9CQUFPLENBQVA7QUFDSDs7QUFFRCxrQkFBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLFNBQXRCLEVBQWlDLE9BQWpDLEVBQTBDLEtBQTFDLEVBQWlEO0FBQzdDLGlCQUFJLFdBQVcsa0JBQWY7QUFDQSxpQkFBSSxXQUFXLGtCQUFmO0FBQ0EsaUJBQUksV0FBVyxJQUFmOztBQUVBLGlCQUFJLFVBQVUsVUFBZCxFQUEwQjtBQUN0Qiw0QkFBVyxrQkFBWDtBQUNBLDRCQUFXLGtCQUFYO0FBQ0EsNEJBQVcsS0FBWDtBQUNIOztBQUVELGlCQUFNLFNBQVMsU0FBUyxTQUFTLEtBQUssQ0FBTCxFQUFRLFFBQVIsQ0FBVCxDQUFULENBQWY7QUFDQSx3QkFBVyxNQUFYO0FBQ0EseUJBQVksQ0FBWixFQUFlLE1BQWYsRUFBdUIsQ0FBdkIsRUFBMEIsU0FBMUIsRUFBcUMsUUFBckM7O0FBRUEsaUJBQU0sU0FBUyxTQUFTLFNBQVMsS0FBSyxDQUFMLEVBQVEsUUFBUixDQUFULENBQVQsQ0FBZjtBQUNBLHdCQUFXLE1BQVg7O0FBRUEsaUJBQUksVUFBVSxVQUFWLElBQXdCLFVBQVUsVUFBdEMsRUFBa0Q7QUFDOUMsNkJBQVksQ0FBWixFQUFlLE1BQWYsRUFBdUIsQ0FBdkIsRUFBMEIsU0FBMUIsRUFBcUMsUUFBckM7QUFDSCxjQUZELE1BRU8sSUFBSSxVQUFVLFFBQVYsSUFBc0IsUUFBUSxNQUFsQyxFQUEwQztBQUM3Qyw0QkFBVyxDQUFYLEVBQWMsTUFBZCxFQUFzQixDQUF0QixFQUF5QixTQUF6QjtBQUNBLDRCQUFXLEtBQVg7QUFDSCxjQUhNLE1BR0EsSUFBSSxVQUFVLFFBQVYsSUFBc0IsQ0FBQyxRQUFRLE1BQW5DLEVBQTJDO0FBQzlDLDZCQUFZLENBQVosRUFBZSxNQUFmLEVBQXVCLENBQXZCLEVBQTBCLFNBQTFCO0FBQ0g7O0FBRUQsaUJBQUksUUFBUSxNQUFaLEVBQW9CO0FBQ2hCLDRCQUFXLFlBQVg7QUFDQSw2QkFBWSxDQUFaLEVBQWUsWUFBZixFQUE2QixDQUE3QixFQUFnQyxTQUFoQyxFQUEyQyxRQUEzQztBQUNIOztBQUVELGlCQUFJLFFBQVEsUUFBWixFQUFzQjtBQUNsQiw4QkFBYSxjQUFjLENBQWQsRUFBaUIsU0FBakIsRUFBNEIsT0FBNUIsRUFBcUMsUUFBckMsQ0FBYjtBQUNIOztBQUVELG9CQUFPLFNBQVA7QUFDSDs7QUFFRCxrQkFBUyxVQUFULENBQW9CLE1BQXBCLEVBQTRCLEtBQTVCLEVBQW1DLENBQW5DLEVBQXNDLFNBQXRDLEVBQWlEO0FBQzdDLGlCQUFNLFlBQVksSUFBSSxPQUF0QjtBQUNBLGlCQUFNLGFBQWEsSUFBSSxTQUF2QjtBQUNBLGlCQUFNLE9BQU8sY0FBYyxTQUFkLEdBQTBCLFVBQTFCLEdBQXVDLEtBQUssU0FBUyxDQUFkLENBQXBEO0FBQ0EsaUJBQU0sT0FBTyxjQUFjLFNBQWQsR0FBMEIsVUFBMUIsR0FBdUMsS0FBSyxTQUFTLENBQWQsQ0FBcEQ7QUFDQSxpQkFBTSxPQUFPLE9BQU8sQ0FBcEI7QUFDQSxpQkFBTSxPQUFPLE9BQU8sQ0FBcEI7QUFDQSxpQkFBTSxVQUFVLElBQWhCO0FBQ0EsaUJBQU0sVUFBVSxPQUFPLENBQXZCOztBQUVBLG9CQUFPLFNBQVA7QUFDQSxvQkFBTyxNQUFQLENBQWMsQ0FBQyxJQUFmLEVBQXFCLElBQXJCO0FBQ0Esb0JBQU8sTUFBUCxDQUFjLENBQUMsSUFBZixFQUFxQixJQUFyQjtBQUNBLG9CQUFPLE1BQVAsQ0FBYyxDQUFDLE9BQWYsRUFBd0IsT0FBeEI7QUFDQSxvQkFBTyxNQUFQLENBQWMsT0FBZCxFQUF1QixPQUF2QjtBQUNBLG9CQUFPLE1BQVAsQ0FBYyxJQUFkLEVBQW9CLElBQXBCO0FBQ0Esb0JBQU8sTUFBUCxDQUFjLElBQWQsRUFBb0IsSUFBcEI7QUFDQSxvQkFBTyxTQUFQLEdBQW1CLEtBQW5CO0FBQ0Esb0JBQU8sSUFBUDs7QUFFQSwyQkFBYyxJQUFkLEVBQW9CLEtBQXBCO0FBQ0g7O0FBRUQsa0JBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixLQUE3QixFQUFvQyxDQUFwQyxFQUF1QyxTQUF2QyxFQUFrRCxRQUFsRCxFQUE0RDtBQUN4RCxpQkFBTSxhQUFhLElBQUksT0FBdkI7QUFDQSxpQkFBTSxhQUFhLElBQUksU0FBdkI7QUFDQSxpQkFBSSxhQUFhLElBQUksT0FBckI7QUFDQSxpQkFBSSxPQUFPLGNBQWMsVUFBZCxHQUEyQixVQUEzQixHQUF3QyxLQUFLLFNBQVMsQ0FBZCxDQUFuRDtBQUNBLGlCQUFNLE9BQU8sY0FBYyxVQUFkLEdBQTJCLFVBQTNCLEdBQXdDLEtBQUssU0FBUyxDQUFkLENBQXJEO0FBQ0EsaUJBQUksVUFBVSxjQUFjLFVBQWQsR0FBMkIsVUFBM0IsR0FBd0MsSUFBSSxNQUExRDtBQUNBLGlCQUFNLFVBQVUsY0FBYyxVQUFkLEdBQTJCLFVBQTNCLEdBQXdDLElBQUksTUFBNUQ7O0FBRUEsaUJBQUksUUFBSixFQUFjO0FBQ1YsK0JBQWMsSUFBZCxFQUFvQixLQUFwQjtBQUNILGNBRkQsTUFFTztBQUNILDhCQUFhLENBQUMsS0FBSyxNQUFMLEdBQWMsQ0FBZixJQUFvQixPQUFqQztBQUNBLHFCQUFJLFlBQVksQ0FBaEIsRUFBbUI7QUFDZiw0QkFBTyxjQUFjLFVBQWQsR0FBMkIsVUFBM0IsR0FBd0MsS0FBSyxTQUFTLENBQWQsQ0FBL0M7QUFDQSwrQkFBVSxjQUFjLFVBQWQsR0FBMkIsVUFBM0IsR0FBd0MsSUFBSSxNQUF0RDtBQUNILGtCQUhELE1BR087QUFDSCw0QkFBTyxjQUFjLFVBQWQsR0FBMkIsS0FBSyxJQUFJLE9BQUosR0FBYyxTQUFuQixDQUEzQixHQUEyRCxLQUFLLFNBQVMsQ0FBZCxDQUFsRTtBQUNBLCtCQUFVLGNBQWMsVUFBZCxHQUEyQixLQUFLLElBQUksT0FBSixHQUFjLFNBQW5CLENBQTNCLEdBQTJELElBQUksTUFBekU7QUFDSDtBQUNELCtCQUFjLE9BQWQsRUFBdUIsS0FBdkI7QUFDSDs7QUFFRCxvQkFBTyxTQUFQO0FBQ0Esb0JBQU8sTUFBUCxDQUFjLENBQUMsSUFBZixFQUFxQixJQUFyQjtBQUNBLG9CQUFPLE1BQVAsQ0FBYyxDQUFDLE9BQWYsRUFBd0IsT0FBeEI7QUFDQSxvQkFBTyxNQUFQLENBQWMsT0FBZCxFQUF1QixPQUF2QjtBQUNBLG9CQUFPLE1BQVAsQ0FBYyxJQUFkLEVBQW9CLElBQXBCO0FBQ0Esb0JBQU8sU0FBUCxHQUFtQixLQUFuQjtBQUNBLG9CQUFPLElBQVA7QUFDRjs7QUFFRixrQkFBUyxhQUFULENBQXVCLFNBQXZCLEVBQWtDO0FBQzlCLGlCQUFNLE9BQU8sY0FBZSxLQUFLLE1BQUwsR0FBYyxPQUE3QixHQUF3QyxJQUFJLFNBQXpEO0FBQ0Esb0JBQU8sU0FBUDtBQUNBLG9CQUFPLE1BQVAsQ0FBYyxDQUFDLFdBQWYsRUFBNEIsSUFBNUI7QUFDQSxvQkFBTyxNQUFQLENBQWMsQ0FBZCxFQUFpQixPQUFPLENBQXhCO0FBQ0Esb0JBQU8sTUFBUCxDQUFjLFdBQWQsRUFBMkIsSUFBM0I7QUFDQSxvQkFBTyxTQUFQLEdBQW1CLFlBQW5CO0FBQ0Esb0JBQU8sSUFBUDtBQUNIOztBQUVELGtCQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBOEI7O0FBRTFCLGlCQUFJLFlBQVksQ0FBaEI7QUFDQSxpQkFBSSxRQUFRLFlBQVosRUFBMEI7QUFDdEIsK0JBQWMsQ0FBZDtBQUNBO0FBQ0g7O0FBRUQsaUJBQUksUUFBUSxNQUFaLEVBQW9CO0FBQ2hCLDJCQUFVLENBQVY7QUFDSDs7QUFFRCxrQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMscUJBQUksSUFBSSxDQUFDLEtBQUssTUFBTCxHQUFjLENBQWYsSUFBb0IsQ0FBNUIsRUFBK0I7QUFDM0IsaUNBQVksVUFBVSxDQUFWLEVBQWEsU0FBYixFQUF3QixPQUF4QixFQUFpQyxVQUFqQyxDQUFaO0FBQ0gsa0JBRkQsTUFFTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLE1BQUwsR0FBYyxDQUFmLElBQW9CLENBQTlCLEVBQWlDO0FBQ3BDLGlDQUFZLFVBQVUsQ0FBVixFQUFhLFNBQWIsRUFBd0IsT0FBeEIsRUFBaUMsUUFBakMsQ0FBWjtBQUNILGtCQUZNLE1BRUE7QUFDSCxpQ0FBWSxVQUFVLENBQVYsRUFBYSxTQUFiLEVBQXdCLE9BQXhCLEVBQWlDLFVBQWpDLENBQVo7QUFDSDtBQUNKO0FBQ0QsaUJBQUksUUFBUSxZQUFaLEVBQTBCO0FBQ3RCLCtCQUFjLFNBQWQ7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBLHFCQUFZLHFCQUFaO0FBQ0EsaUJBQVEsR0FBUixDQUFZLFVBQVo7QUFDQSxpQkFBUSxHQUFSLENBQVksU0FBWjtBQUNBLGlCQUFRLEdBQVIsQ0FBWSxhQUFaO0FBQ0gsTUFoUUQ7QUFpUUgsRUFsUUQsRSIsImZpbGUiOiJidWlsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kaXN0XCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA3Njk2YWJkZTVmY2UxMmQwNzNlNFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICQuZ2V0SlNPTihcIi4vZGF0YS93aWxleVBvc3QuanNvblwiLCBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICAgICAgLy8gRXZlbnR1YWxseSwgdGhlc2Ugd2lsbCBiZSBnYXRoZXJlZCBmcm9tIHRoZSBkYXRhIG9yIHVzZXJcclxuICAgICAgICBjb25zdCB0ZW1wTWluID0gNTtcclxuICAgICAgICBjb25zdCB0ZW1wTWF4ID0gMTA0O1xyXG4gICAgICAgIGNvbnN0IG51bUNvbG9ycyA9IDEwO1xyXG4gICAgICAgIGNvbnN0IGRlZ3JlZURpZmYgPSAodGVtcE1heCAtIHRlbXBNaW4pL251bUNvbG9ycztcclxuICAgICAgICBjb25zdCB5YXJuQ29sb3JzID0gW107XHJcbiAgICAgICAgbGV0IG5ldXRyYWxDb2xvciA9ICQoXCIjbmV1dHJhbENvbG9yXCIpLnZhbCgpO1xyXG4gICAgICAgIGxldCB0cmlTdGVwU2l6ZSA9IDA7XHJcbiAgICAgICAgbGV0IGRheVNpemUgPSA0O1xyXG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gMTtcclxuICAgICAgICBjb25zdCBjb2xvclN0YXRzID0ge307XHJcbiAgICAgICAgY29uc3QgY29sb3JBcmVhID0ge307ICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbG9yUGVyY2VudHMgPSB7fTsgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICBjYW52YXMuc2NhbGUoc2NhbGVGYWN0b3IsIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICBjYW52YXMudHJhbnNsYXRlKDEyMDAsIDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQoXCIjc3VibWl0QnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBnZXRDb2xvcklucHV0KCk7XHJcbiAgICAgICAgICAgIG5ldXRyYWxDb2xvciA9ICQoXCIjbmV1dHJhbENvbG9yXCIpLnZhbCgpO1xyXG4gICAgICAgICAgICBkcmF3QmxhbmtldChjaGVja05ldXRyYWxPcHRpb25zKCkpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVQZXJjZW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tOZXV0cmFsT3B0aW9ucygpIHtcclxuICAgICAgICAgICAgY29uc3QgaXNDaGVja2VkID0ge307XHJcbiAgICAgICAgICAgICQoXCJpbnB1dFt0eXBlPSdjaGVja2JveCddXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZigkKGNvbG9yKS5wcm9wKFwiY2hlY2tlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQ2hlY2tlZFskKGNvbG9yKS52YWwoKV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpc0NoZWNrZWRbJChjb2xvcikudmFsKCldID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpc0NoZWNrZWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gaXNDaGVja2VkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBnZXRDb2xvcklucHV0KCkge1xyXG4gICAgICAgICAgICAkKFwiI2NvbG9ycyBpbnB1dFwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBjb2xvcikge1xyXG4gICAgICAgICAgICAgICAgeWFybkNvbG9yc1tpbmRleF0gPSAkKGNvbG9yKS52YWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZENvbG9yU3RhdHMgKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHlhcm5Db2xvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yU3RhdHNbeWFybkNvbG9yc1tpXV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgY29sb3JBcmVhW3lhcm5Db2xvcnNbaV1dID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbG9yUGVyY2VudHNbeWFybkNvbG9yc1tpXV0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbG9yU3RhdHNbbmV1dHJhbENvbG9yXSA9IDA7XHJcbiAgICAgICAgICAgIGNvbG9yQXJlYVtuZXV0cmFsQ29sb3JdID0gdHJpU3RlcFNpemUgKiB0cmlTdGVwU2l6ZSAqIDI7XHJcbiAgICAgICAgICAgIC8vcHJvdmlkZXMgdGhlIGFyZWEgb2YgdGhlIHRvcCBhbmQgYm90dG9tIHRyaWFuZ2xlc1xyXG4gICAgICAgICAgICAvLyBhID0gaChiLzIpOyBoID0gdHJpU3RlcFNpemU7IGIgPSAyICogdHJpU3RlcFNpemVcclxuICAgICAgICAgICAgY29sb3JQZXJjZW50c1tuZXV0cmFsQ29sb3JdID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlQXJlYShzbWFsbGVyWCwgY29sb3IpIHtcclxuICAgICAgICAgICAgY29sb3JBcmVhW2NvbG9yXSArPSBzbWFsbGVyWCAqIDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVBlcmNlbnQoKSB7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gY29sb3JBcmVhKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbCArPSBjb2xvckFyZWFbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIGNvbG9yUGVyY2VudHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yUGVyY2VudHNbcHJvcGVydHldID0gTWF0aC5yb3VuZCgoY29sb3JBcmVhW3Byb3BlcnR5XSAvIHRvdGFsKSAqIDEwMDAwKSAvIDEwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbG9yKHRlbXApIHtcclxuICAgICAgICAgICAgaWYgKHRlbXAgPj0gdGVtcE1pbiAmJiB0ZW1wIDw9IHRlbXBNYXgpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKCh0ZW1wIC0gdGVtcE1pbikvZGVncmVlRGlmZik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geWFybkNvbG9yc1tpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGVtcGVyYXR1cmUgaXMgb3V0IG9mIGJvdW5kc1wiKTtcclxuICAgICAgICAgICAgZXJyLnRlbXAgPSB0ZW1wO1xyXG4gICAgICAgICAgICBlcnIudGVtcE1pbiA9IHRlbXBNaW47XHJcbiAgICAgICAgICAgIGVyci50ZW1wTWF4ID0gdGVtcE1heDtcclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBkcmF3VG9wVHJpKCkge1xyXG4gICAgICAgICAgICBjYW52YXMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5tb3ZlVG8oMCwgMCk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5saW5lVG8oMCArIHRyaVN0ZXBTaXplLCB0cmlTdGVwU2l6ZSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5saW5lVG8oMCAtIHRyaVN0ZXBTaXplLCB0cmlTdGVwU2l6ZSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5maWxsU3R5bGUgPSBuZXV0cmFsQ29sb3I7XHJcbiAgICAgICAgICAgIGNhbnZhcy5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTW9udGhFbmQoaSwgZXh0cmFSb3dzLCBvcHRpb25zLCBpbmNyZWFzZSkge1xyXG4gICAgICAgICAgICBjb25zdCB0b2RheSA9IGRheXNbaV0uQ1NULnNwbGl0KFwiLVwiKTtcclxuICAgICAgICAgICAgbGV0IHJvd051bTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRheVJvdykge1xyXG4gICAgICAgICAgICAgICAgcm93TnVtID0gNDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJvd051bSA9IDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChkYXlzW2kgKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9tb3Jyb3cgPSBkYXlzW2kgKyAxXS5DU1Quc3BsaXQoXCItXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHRvZGF5WzFdKSA8IHBhcnNlSW50KHRvbW9ycm93WzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmNyZWFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdSaG9tYnVzKHJvd051bSwgbmV1dHJhbENvbG9yLCBpLCBleHRyYVJvd3MsIHRydWUpOyBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcmF3UmhvbWJ1cyhyb3dOdW0sIG5ldXRyYWxDb2xvciwgaSwgZXh0cmFSb3dzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZHJhd1Job21idXMocm93TnVtLCBuZXV0cmFsQ29sb3IsIGksIGV4dHJhUm93cywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJvdyhpLCBleHRyYVJvd3MsIG9wdGlvbnMsIHNoYXBlKSB7XHJcbiAgICAgICAgICAgIGxldCByb3cxVGVtcCA9IFwiTWluIFRlbXBlcmF0dXJlRlwiO1xyXG4gICAgICAgICAgICBsZXQgcm93MlRlbXAgPSBcIk1heCBUZW1wZXJhdHVyZUZcIjtcclxuICAgICAgICAgICAgbGV0IGluY3JlYXNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzaGFwZSA9PT0gXCJkZWNyZWFzZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByb3cxVGVtcCA9IFwiTWF4IFRlbXBlcmF0dXJlRlwiO1xyXG4gICAgICAgICAgICAgICAgcm93MlRlbXAgPSBcIk1pbiBUZW1wZXJhdHVyZUZcIjtcclxuICAgICAgICAgICAgICAgIGluY3JlYXNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjb2xvcjEgPSBnZXRDb2xvcihwYXJzZUludChkYXlzW2ldW3JvdzFUZW1wXSkpO1xyXG4gICAgICAgICAgICBjb2xvclN0YXRzW2NvbG9yMV0rKztcclxuICAgICAgICAgICAgZHJhd1Job21idXMoMSwgY29sb3IxLCBpLCBleHRyYVJvd3MsIGluY3JlYXNlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yMiA9IGdldENvbG9yKHBhcnNlSW50KGRheXNbaV1bcm93MlRlbXBdKSk7XHJcbiAgICAgICAgICAgIGNvbG9yU3RhdHNbY29sb3IyXSsrO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNoYXBlID09PSBcImluY3JlYXNlXCIgfHwgc2hhcGUgPT09IFwiZGVjcmVhc2VcIikge1xyXG4gICAgICAgICAgICAgICAgZHJhd1Job21idXMoMiwgY29sb3IyLCBpLCBleHRyYVJvd3MsIGluY3JlYXNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJtaWRkbGVcIiAmJiBvcHRpb25zLmRheVJvdykge1xyXG4gICAgICAgICAgICAgICAgZHJhd01pZGRsZSgyLCBjb2xvcjIsIGksIGV4dHJhUm93cyk7XHJcbiAgICAgICAgICAgICAgICBpbmNyZWFzZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcIm1pZGRsZVwiICYmICFvcHRpb25zLmRheVJvdykge1xyXG4gICAgICAgICAgICAgICAgZHJhd1Job21idXMoMiwgY29sb3IyLCBpLCBleHRyYVJvd3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kYXlSb3cpIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yU3RhdHNbbmV1dHJhbENvbG9yXSsrO1xyXG4gICAgICAgICAgICAgICAgZHJhd1Job21idXMoMywgbmV1dHJhbENvbG9yLCBpLCBleHRyYVJvd3MsIGluY3JlYXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubW9udGhSb3cpIHtcclxuICAgICAgICAgICAgICAgIGV4dHJhUm93cyArPSBjaGVja01vbnRoRW5kKGksIGV4dHJhUm93cywgb3B0aW9ucywgaW5jcmVhc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZXh0cmFSb3dzO1xyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdNaWRkbGUocm93TnVtLCBjb2xvciwgaSwgZXh0cmFSb3dzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRheU9mZnNldCA9IGkgKiBkYXlTaXplO1xyXG4gICAgICAgICAgICBjb25zdCBleHRyYUxpbmVzID0gMiAqIGV4dHJhUm93cztcclxuICAgICAgICAgICAgY29uc3QgdG9wWCA9IHRyaVN0ZXBTaXplICsgZGF5T2Zmc2V0ICsgZXh0cmFMaW5lcyArIDIgKiAocm93TnVtIC0gMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvcFkgPSB0cmlTdGVwU2l6ZSArIGRheU9mZnNldCArIGV4dHJhTGluZXMgKyAyICogKHJvd051bSAtIDEpO1xyXG4gICAgICAgICAgICBjb25zdCBtaWRYID0gdG9wWCArIDE7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pZFkgPSB0b3BZICsgMTtcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tWCA9IHRvcFg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbVkgPSB0b3BZICsgMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhbnZhcy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY2FudmFzLm1vdmVUbygtdG9wWCwgdG9wWSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5saW5lVG8oLW1pZFgsIG1pZFkpO1xyXG4gICAgICAgICAgICBjYW52YXMubGluZVRvKC1ib3R0b21YLCBib3R0b21ZKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbyhib3R0b21YLCBib3R0b21ZKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbyhtaWRYLCBtaWRZKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbyh0b3BYLCB0b3BZKTtcclxuICAgICAgICAgICAgY2FudmFzLmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBjYW52YXMuZmlsbCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FsY3VsYXRlQXJlYSh0b3BYLCBjb2xvcik7ICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBkcmF3UmhvbWJ1cyhyb3dOdW0sIGNvbG9yLCBpLCBleHRyYVJvd3MsIGluY3JlYXNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRheU9mZnNldFkgPSBpICogZGF5U2l6ZTtcclxuICAgICAgICAgICAgY29uc3QgZXh0cmFMaW5lcyA9IDIgKiBleHRyYVJvd3M7XHJcbiAgICAgICAgICAgIGxldCBkYXlPZmZzZXRYID0gaSAqIGRheVNpemU7XHJcbiAgICAgICAgICAgIGxldCB0b3BYID0gdHJpU3RlcFNpemUgKyBkYXlPZmZzZXRYICsgZXh0cmFMaW5lcyArIDIgKiAocm93TnVtIC0gMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvcFkgPSB0cmlTdGVwU2l6ZSArIGRheU9mZnNldFkgKyBleHRyYUxpbmVzICsgMiAqIChyb3dOdW0gLSAxKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVggPSB0cmlTdGVwU2l6ZSArIGRheU9mZnNldFggKyBleHRyYUxpbmVzICsgMiAqIHJvd051bTtcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tWSA9IHRyaVN0ZXBTaXplICsgZGF5T2Zmc2V0WSArIGV4dHJhTGluZXMgKyAyICogcm93TnVtO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoaW5jcmVhc2UpIHtcclxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZUFyZWEodG9wWCwgY29sb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGF5T2Zmc2V0WCA9IChkYXlzLmxlbmd0aCAtIGkpICogZGF5U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChleHRyYVJvd3MgPCA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wWCA9IHRyaVN0ZXBTaXplICsgZGF5T2Zmc2V0WCArIGV4dHJhTGluZXMgLSAyICogKHJvd051bSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbVggPSB0cmlTdGVwU2l6ZSArIGRheU9mZnNldFggKyBleHRyYUxpbmVzIC0gMiAqIHJvd051bTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wWCA9IHRyaVN0ZXBTaXplICsgZGF5T2Zmc2V0WCArIDIgKiAoMiAqIGRheVNpemUgLSBleHRyYVJvd3MpIC0gMiAqIChyb3dOdW0gLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBib3R0b21YID0gdHJpU3RlcFNpemUgKyBkYXlPZmZzZXRYICsgMiAqICgyICogZGF5U2l6ZSAtIGV4dHJhUm93cykgLSAyICogcm93TnVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlQXJlYShib3R0b21YLCBjb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhbnZhcy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY2FudmFzLm1vdmVUbygtdG9wWCwgdG9wWSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5saW5lVG8oLWJvdHRvbVgsIGJvdHRvbVkpO1xyXG4gICAgICAgICAgICBjYW52YXMubGluZVRvKGJvdHRvbVgsIGJvdHRvbVkpO1xyXG4gICAgICAgICAgICBjYW52YXMubGluZVRvKHRvcFgsIHRvcFkpO1xyXG4gICAgICAgICAgICBjYW52YXMuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgICAgIGNhbnZhcy5maWxsKCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBkcmF3Qm90dG9tVHJpKGV4dHJhUm93cykge1xyXG4gICAgICAgICAgICBjb25zdCB0b3BZID0gdHJpU3RlcFNpemUgKyAoZGF5cy5sZW5ndGggKiBkYXlTaXplKSArIDIgKiBleHRyYVJvd3M7XHJcbiAgICAgICAgICAgIGNhbnZhcy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY2FudmFzLm1vdmVUbygtdHJpU3RlcFNpemUsIHRvcFkpO1xyXG4gICAgICAgICAgICBjYW52YXMubGluZVRvKDAsIHRvcFkgKyA1KTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbyh0cmlTdGVwU2l6ZSwgdG9wWSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5maWxsU3R5bGUgPSBuZXV0cmFsQ29sb3I7XHJcbiAgICAgICAgICAgIGNhbnZhcy5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdCbGFua2V0KG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgLy8gdGhpcyBpcyB0byBkcmF3IGEgYmlhcyBibGFua2V0IFxyXG4gICAgICAgICAgICBsZXQgZXh0cmFSb3dzID0gMDtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudHJpYW5nbGVDYXBzKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlTdGVwU2l6ZSA9IDU7XHJcbiAgICAgICAgICAgICAgICBkcmF3VG9wVHJpKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRheVJvdykge1xyXG4gICAgICAgICAgICAgICAgZGF5U2l6ZSA9IDY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAoZGF5cy5sZW5ndGggLSAxKSAvIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBleHRyYVJvd3MgPSBjcmVhdGVSb3coaSwgZXh0cmFSb3dzLCBvcHRpb25zLCBcImluY3JlYXNlXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSAoZGF5cy5sZW5ndGggLSAxKSAvIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBleHRyYVJvd3MgPSBjcmVhdGVSb3coaSwgZXh0cmFSb3dzLCBvcHRpb25zLCBcIm1pZGRsZVwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXh0cmFSb3dzID0gY3JlYXRlUm93KGksIGV4dHJhUm93cywgb3B0aW9ucywgXCJkZWNyZWFzZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50cmlhbmdsZUNhcHMpIHtcclxuICAgICAgICAgICAgICAgIGRyYXdCb3R0b21UcmkoZXh0cmFSb3dzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBhZGRDb2xvclN0YXRzKCk7XHJcbiAgICAgICAgZ2V0Q29sb3JJbnB1dCgpO1xyXG4gICAgICAgIGRyYXdCbGFua2V0KGNoZWNrTmV1dHJhbE9wdGlvbnMoKSk7ICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhjb2xvclN0YXRzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjb2xvckFyZWEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbG9yUGVyY2VudHMpO1xyXG4gICAgfSk7XHJcbn0pXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9hcHAvaW5kZXguanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9