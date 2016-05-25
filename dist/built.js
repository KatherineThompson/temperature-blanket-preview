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
/******/ 	__webpack_require__.p = "";
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
	    debugger;   
	    $.getJSON("./data/wileyPost.json", function(days) {
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
	        
	        const canvas = document.getElementById("canvas").getContext("2d");
	        canvas.scale(scaleFactor, scaleFactor);
	        canvas.translate(1200, 0);
	        
	        $("#submitButton").click(function() {
	            getColorInput();
	            neutralColor = $("#neutralColor").val();
	            drawBlanket(checkNeutralOptions());
	            calculatePercent();
	        });
	        
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
	            for (let property in colorArea) {
	                total += colorArea[property];
	            }
	            
	            for (let property in colorPercents) {
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
	            const today = days[i]["CST"].split("-");
	            let rowNum;
	            
	            if (options.dayRow) {
	                rowNum = 4;
	            } else {
	                rowNum = 3;
	            }
	            
	            if (days[i + 1]) {
	                const tomorrow = days[i + 1]["CST"].split("-");
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
	            let topY = triStepSize + dayOffsetY + extraLines + 2 * (rowNum - 1);
	            let bottomX = triStepSize + dayOffsetX + extraLines + 2 * rowNum;
	            let bottomY = triStepSize + dayOffsetY + extraLines + 2 * rowNum;
	                    
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
	})

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDdjMWUzY2ZhYjE4Njg5ZDFiMTkiLCJ3ZWJwYWNrOi8vLy4vYXBwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBO0FBQ0EsYztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCO0FBQ0Esa0M7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0EsNEJBQTJCLHVCQUF1QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEwQixpQkFBaUI7QUFDM0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTJCLGlCQUFpQjtBQUM1QztBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMLEVBQUMsQyIsImZpbGUiOiJidWlsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZDdjMWUzY2ZhYjE4Njg5ZDFiMTlcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBkZWJ1Z2dlcjsgICBcclxuICAgICQuZ2V0SlNPTihcIi4vZGF0YS93aWxleVBvc3QuanNvblwiLCBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICAgICAgLy8gRXZlbnR1YWxseSwgdGhlc2Ugd2lsbCBiZSBnYXRoZXJlZCBmcm9tIHRoZSBkYXRhIG9yIHVzZXJcclxuICAgICAgICBjb25zdCB0ZW1wTWluID0gNTtcclxuICAgICAgICBjb25zdCB0ZW1wTWF4ID0gMTA0O1xyXG4gICAgICAgIGNvbnN0IG51bUNvbG9ycyA9IDEwO1xyXG4gICAgICAgIGNvbnN0IGRlZ3JlZURpZmYgPSAodGVtcE1heCAtIHRlbXBNaW4pL251bUNvbG9ycztcclxuICAgICAgICBjb25zdCB5YXJuQ29sb3JzID0gW107XHJcbiAgICAgICAgbGV0IG5ldXRyYWxDb2xvciA9ICQoXCIjbmV1dHJhbENvbG9yXCIpLnZhbCgpO1xyXG4gICAgICAgIGxldCB0cmlTdGVwU2l6ZSA9IDA7XHJcbiAgICAgICAgbGV0IGRheVNpemUgPSA0O1xyXG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gMTtcclxuICAgICAgICBjb25zdCBjb2xvclN0YXRzID0ge307XHJcbiAgICAgICAgY29uc3QgY29sb3JBcmVhID0ge307ICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbG9yUGVyY2VudHMgPSB7fTsgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICBjYW52YXMuc2NhbGUoc2NhbGVGYWN0b3IsIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICBjYW52YXMudHJhbnNsYXRlKDEyMDAsIDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQoXCIjc3VibWl0QnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBnZXRDb2xvcklucHV0KCk7XHJcbiAgICAgICAgICAgIG5ldXRyYWxDb2xvciA9ICQoXCIjbmV1dHJhbENvbG9yXCIpLnZhbCgpO1xyXG4gICAgICAgICAgICBkcmF3QmxhbmtldChjaGVja05ldXRyYWxPcHRpb25zKCkpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVQZXJjZW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tOZXV0cmFsT3B0aW9ucygpIHtcclxuICAgICAgICAgICAgY29uc3QgaXNDaGVja2VkID0ge307XHJcbiAgICAgICAgICAgICQoXCJpbnB1dFt0eXBlPSdjaGVja2JveCddXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZigkKGNvbG9yKS5wcm9wKFwiY2hlY2tlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQ2hlY2tlZFskKGNvbG9yKS52YWwoKV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpc0NoZWNrZWRbJChjb2xvcikudmFsKCldID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpc0NoZWNrZWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gaXNDaGVja2VkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBnZXRDb2xvcklucHV0KCkge1xyXG4gICAgICAgICAgICAkKFwiI2NvbG9ycyBpbnB1dFwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBjb2xvcikge1xyXG4gICAgICAgICAgICAgICAgeWFybkNvbG9yc1tpbmRleF0gPSAkKGNvbG9yKS52YWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZENvbG9yU3RhdHMgKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHlhcm5Db2xvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yU3RhdHNbeWFybkNvbG9yc1tpXV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgY29sb3JBcmVhW3lhcm5Db2xvcnNbaV1dID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbG9yUGVyY2VudHNbeWFybkNvbG9yc1tpXV0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbG9yU3RhdHNbbmV1dHJhbENvbG9yXSA9IDA7XHJcbiAgICAgICAgICAgIGNvbG9yQXJlYVtuZXV0cmFsQ29sb3JdID0gdHJpU3RlcFNpemUgKiB0cmlTdGVwU2l6ZSAqIDI7XHJcbiAgICAgICAgICAgIC8vcHJvdmlkZXMgdGhlIGFyZWEgb2YgdGhlIHRvcCBhbmQgYm90dG9tIHRyaWFuZ2xlc1xyXG4gICAgICAgICAgICAvLyBhID0gaChiLzIpOyBoID0gdHJpU3RlcFNpemU7IGIgPSAyICogdHJpU3RlcFNpemVcclxuICAgICAgICAgICAgY29sb3JQZXJjZW50c1tuZXV0cmFsQ29sb3JdID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlQXJlYShzbWFsbGVyWCwgY29sb3IpIHtcclxuICAgICAgICAgICAgY29sb3JBcmVhW2NvbG9yXSArPSBzbWFsbGVyWCAqIDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVBlcmNlbnQoKSB7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHByb3BlcnR5IGluIGNvbG9yQXJlYSkge1xyXG4gICAgICAgICAgICAgICAgdG90YWwgKz0gY29sb3JBcmVhW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcGVydHkgaW4gY29sb3JQZXJjZW50cykge1xyXG4gICAgICAgICAgICAgICAgY29sb3JQZXJjZW50c1twcm9wZXJ0eV0gPSBNYXRoLnJvdW5kKChjb2xvckFyZWFbcHJvcGVydHldIC8gdG90YWwpICogMTAwMDApIC8gMTAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29sb3IodGVtcCkge1xyXG4gICAgICAgICAgICBpZiAodGVtcCA+PSB0ZW1wTWluICYmIHRlbXAgPD0gdGVtcE1heCl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoKHRlbXAgLSB0ZW1wTWluKS9kZWdyZWVEaWZmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB5YXJuQ29sb3JzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJUZW1wZXJhdHVyZSBpcyBvdXQgb2YgYm91bmRzXCIpO1xyXG4gICAgICAgICAgICBlcnIudGVtcCA9IHRlbXA7XHJcbiAgICAgICAgICAgIGVyci50ZW1wTWluID0gdGVtcE1pbjtcclxuICAgICAgICAgICAgZXJyLnRlbXBNYXggPSB0ZW1wTWF4O1xyXG4gICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdUb3BUcmkoKSB7XHJcbiAgICAgICAgICAgIGNhbnZhcy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY2FudmFzLm1vdmVUbygwLCAwKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbygwICsgdHJpU3RlcFNpemUsIHRyaVN0ZXBTaXplKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbygwIC0gdHJpU3RlcFNpemUsIHRyaVN0ZXBTaXplKTtcclxuICAgICAgICAgICAgY2FudmFzLmZpbGxTdHlsZSA9IG5ldXRyYWxDb2xvcjtcclxuICAgICAgICAgICAgY2FudmFzLmZpbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tNb250aEVuZChpLCBleHRyYVJvd3MsIG9wdGlvbnMsIGluY3JlYXNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvZGF5ID0gZGF5c1tpXVtcIkNTVFwiXS5zcGxpdChcIi1cIik7XHJcbiAgICAgICAgICAgIGxldCByb3dOdW07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kYXlSb3cpIHtcclxuICAgICAgICAgICAgICAgIHJvd051bSA9IDQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByb3dOdW0gPSAzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoZGF5c1tpICsgMV0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93ID0gZGF5c1tpICsgMV1bXCJDU1RcIl0uc3BsaXQoXCItXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHRvZGF5WzFdKSA8IHBhcnNlSW50KHRvbW9ycm93WzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmNyZWFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdSaG9tYnVzKHJvd051bSwgbmV1dHJhbENvbG9yLCBpLCBleHRyYVJvd3MsIHRydWUpOyBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcmF3UmhvbWJ1cyhyb3dOdW0sIG5ldXRyYWxDb2xvciwgaSwgZXh0cmFSb3dzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZHJhd1Job21idXMocm93TnVtLCBuZXV0cmFsQ29sb3IsIGksIGV4dHJhUm93cywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJvdyhpLCBleHRyYVJvd3MsIG9wdGlvbnMsIHNoYXBlKSB7XHJcbiAgICAgICAgICAgIGxldCByb3cxVGVtcCA9IFwiTWluIFRlbXBlcmF0dXJlRlwiO1xyXG4gICAgICAgICAgICBsZXQgcm93MlRlbXAgPSBcIk1heCBUZW1wZXJhdHVyZUZcIjtcclxuICAgICAgICAgICAgbGV0IGluY3JlYXNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzaGFwZSA9PT0gXCJkZWNyZWFzZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByb3cxVGVtcCA9IFwiTWF4IFRlbXBlcmF0dXJlRlwiO1xyXG4gICAgICAgICAgICAgICAgcm93MlRlbXAgPSBcIk1pbiBUZW1wZXJhdHVyZUZcIjtcclxuICAgICAgICAgICAgICAgIGluY3JlYXNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjb2xvcjEgPSBnZXRDb2xvcihwYXJzZUludChkYXlzW2ldW3JvdzFUZW1wXSkpO1xyXG4gICAgICAgICAgICBjb2xvclN0YXRzW2NvbG9yMV0rKztcclxuICAgICAgICAgICAgZHJhd1Job21idXMoMSwgY29sb3IxLCBpLCBleHRyYVJvd3MsIGluY3JlYXNlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yMiA9IGdldENvbG9yKHBhcnNlSW50KGRheXNbaV1bcm93MlRlbXBdKSk7XHJcbiAgICAgICAgICAgIGNvbG9yU3RhdHNbY29sb3IyXSsrO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHNoYXBlID09PSBcImluY3JlYXNlXCIgfHwgc2hhcGUgPT09IFwiZGVjcmVhc2VcIikge1xyXG4gICAgICAgICAgICAgICAgZHJhd1Job21idXMoMiwgY29sb3IyLCBpLCBleHRyYVJvd3MsIGluY3JlYXNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gXCJtaWRkbGVcIiAmJiBvcHRpb25zLmRheVJvdykge1xyXG4gICAgICAgICAgICAgICAgZHJhd01pZGRsZSgyLCBjb2xvcjIsIGksIGV4dHJhUm93cyk7XHJcbiAgICAgICAgICAgICAgICBpbmNyZWFzZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlID09PSBcIm1pZGRsZVwiICYmICFvcHRpb25zLmRheVJvdykge1xyXG4gICAgICAgICAgICAgICAgZHJhd1Job21idXMoMiwgY29sb3IyLCBpLCBleHRyYVJvd3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kYXlSb3cpIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yU3RhdHNbbmV1dHJhbENvbG9yXSsrO1xyXG4gICAgICAgICAgICAgICAgZHJhd1Job21idXMoMywgbmV1dHJhbENvbG9yLCBpLCBleHRyYVJvd3MsIGluY3JlYXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubW9udGhSb3cpIHtcclxuICAgICAgICAgICAgICAgIGV4dHJhUm93cyArPSBjaGVja01vbnRoRW5kKGksIGV4dHJhUm93cywgb3B0aW9ucywgaW5jcmVhc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gZXh0cmFSb3dzO1xyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdNaWRkbGUocm93TnVtLCBjb2xvciwgaSwgZXh0cmFSb3dzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRheU9mZnNldCA9IGkgKiBkYXlTaXplO1xyXG4gICAgICAgICAgICBjb25zdCBleHRyYUxpbmVzID0gMiAqIGV4dHJhUm93cztcclxuICAgICAgICAgICAgY29uc3QgdG9wWCA9IHRyaVN0ZXBTaXplICsgZGF5T2Zmc2V0ICsgZXh0cmFMaW5lcyArIDIgKiAocm93TnVtIC0gMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvcFkgPSB0cmlTdGVwU2l6ZSArIGRheU9mZnNldCArIGV4dHJhTGluZXMgKyAyICogKHJvd051bSAtIDEpO1xyXG4gICAgICAgICAgICBjb25zdCBtaWRYID0gdG9wWCArIDE7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pZFkgPSB0b3BZICsgMTtcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tWCA9IHRvcFg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbVkgPSB0b3BZICsgMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhbnZhcy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY2FudmFzLm1vdmVUbygtdG9wWCwgdG9wWSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5saW5lVG8oLW1pZFgsIG1pZFkpO1xyXG4gICAgICAgICAgICBjYW52YXMubGluZVRvKC1ib3R0b21YLCBib3R0b21ZKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbyhib3R0b21YLCBib3R0b21ZKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbyhtaWRYLCBtaWRZKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbyh0b3BYLCB0b3BZKTtcclxuICAgICAgICAgICAgY2FudmFzLmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBjYW52YXMuZmlsbCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FsY3VsYXRlQXJlYSh0b3BYLCBjb2xvcik7ICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBkcmF3UmhvbWJ1cyhyb3dOdW0sIGNvbG9yLCBpLCBleHRyYVJvd3MsIGluY3JlYXNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRheU9mZnNldFkgPSBpICogZGF5U2l6ZTtcclxuICAgICAgICAgICAgY29uc3QgZXh0cmFMaW5lcyA9IDIgKiBleHRyYVJvd3M7XHJcbiAgICAgICAgICAgIGxldCBkYXlPZmZzZXRYID0gaSAqIGRheVNpemU7XHJcbiAgICAgICAgICAgIGxldCB0b3BYID0gdHJpU3RlcFNpemUgKyBkYXlPZmZzZXRYICsgZXh0cmFMaW5lcyArIDIgKiAocm93TnVtIC0gMSk7XHJcbiAgICAgICAgICAgIGxldCB0b3BZID0gdHJpU3RlcFNpemUgKyBkYXlPZmZzZXRZICsgZXh0cmFMaW5lcyArIDIgKiAocm93TnVtIC0gMSk7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21YID0gdHJpU3RlcFNpemUgKyBkYXlPZmZzZXRYICsgZXh0cmFMaW5lcyArIDIgKiByb3dOdW07XHJcbiAgICAgICAgICAgIGxldCBib3R0b21ZID0gdHJpU3RlcFNpemUgKyBkYXlPZmZzZXRZICsgZXh0cmFMaW5lcyArIDIgKiByb3dOdW07XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChpbmNyZWFzZSkge1xyXG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlQXJlYSh0b3BYLCBjb2xvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkYXlPZmZzZXRYID0gKGRheXMubGVuZ3RoIC0gaSkgKiBkYXlTaXplO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhUm93cyA8IDcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BYID0gdHJpU3RlcFNpemUgKyBkYXlPZmZzZXRYICsgZXh0cmFMaW5lcyAtIDIgKiAocm93TnVtIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tWCA9IHRyaVN0ZXBTaXplICsgZGF5T2Zmc2V0WCArIGV4dHJhTGluZXMgLSAyICogcm93TnVtO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BYID0gdHJpU3RlcFNpemUgKyBkYXlPZmZzZXRYICsgMiAqICgyICogZGF5U2l6ZSAtIGV4dHJhUm93cykgLSAyICogKHJvd051bSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbVggPSB0cmlTdGVwU2l6ZSArIGRheU9mZnNldFggKyAyICogKDIgKiBkYXlTaXplIC0gZXh0cmFSb3dzKSAtIDIgKiByb3dOdW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVBcmVhKGJvdHRvbVgsIGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FudmFzLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjYW52YXMubW92ZVRvKC10b3BYLCB0b3BZKTtcclxuICAgICAgICAgICAgY2FudmFzLmxpbmVUbygtYm90dG9tWCwgYm90dG9tWSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5saW5lVG8oYm90dG9tWCwgYm90dG9tWSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5saW5lVG8odG9wWCwgdG9wWSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgY2FudmFzLmZpbGwoKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdCb3R0b21UcmkoZXh0cmFSb3dzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvcFkgPSB0cmlTdGVwU2l6ZSArIChkYXlzLmxlbmd0aCAqIGRheVNpemUpICsgMiAqIGV4dHJhUm93cztcclxuICAgICAgICAgICAgY2FudmFzLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjYW52YXMubW92ZVRvKC10cmlTdGVwU2l6ZSwgdG9wWSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5saW5lVG8oMCwgdG9wWSArIDUpO1xyXG4gICAgICAgICAgICBjYW52YXMubGluZVRvKHRyaVN0ZXBTaXplLCB0b3BZKTtcclxuICAgICAgICAgICAgY2FudmFzLmZpbGxTdHlsZSA9IG5ldXRyYWxDb2xvcjtcclxuICAgICAgICAgICAgY2FudmFzLmZpbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZHJhd0JsYW5rZXQob3B0aW9ucykge1xyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRvIGRyYXcgYSBiaWFzIGJsYW5rZXQgXHJcbiAgICAgICAgICAgIGxldCBleHRyYVJvd3MgPSAwO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50cmlhbmdsZUNhcHMpIHtcclxuICAgICAgICAgICAgICAgIHRyaVN0ZXBTaXplID0gNTtcclxuICAgICAgICAgICAgICAgIGRyYXdUb3BUcmkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGF5Um93KSB7XHJcbiAgICAgICAgICAgICAgICBkYXlTaXplID0gNjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IChkYXlzLmxlbmd0aCAtIDEpIC8gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4dHJhUm93cyA9IGNyZWF0ZVJvdyhpLCBleHRyYVJvd3MsIG9wdGlvbnMsIFwiaW5jcmVhc2VcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IChkYXlzLmxlbmd0aCAtIDEpIC8gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4dHJhUm93cyA9IGNyZWF0ZVJvdyhpLCBleHRyYVJvd3MsIG9wdGlvbnMsIFwibWlkZGxlXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBleHRyYVJvd3MgPSBjcmVhdGVSb3coaSwgZXh0cmFSb3dzLCBvcHRpb25zLCBcImRlY3JlYXNlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnRyaWFuZ2xlQ2Fwcykge1xyXG4gICAgICAgICAgICAgICAgZHJhd0JvdHRvbVRyaShleHRyYVJvd3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkZENvbG9yU3RhdHMoKTtcclxuICAgICAgICBnZXRDb2xvcklucHV0KCk7XHJcbiAgICAgICAgZHJhd0JsYW5rZXQoY2hlY2tOZXV0cmFsT3B0aW9ucygpKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbG9yU3RhdHMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbG9yQXJlYSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29sb3JQZXJjZW50cyk7XHJcbiAgICB9KTtcclxufSlcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==