"use strict"

window.addEventListener("load", function () {
    
    $.getJSON("wileyPost.json", function(days) {
        // Eventually, these will be gathered from the data or user
        const tempMin = 5;
        const tempMax = 104;
        const numColors = 10;
        const degreeDiff = (tempMax - tempMin)/numColors;
        const yarnColors = [];
        let neutralColor = $("#neutralColor").val();
        const triStepSize = 5;
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
            drawBlanket();
            calculatePercent();
        });
        
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
        
        function checkMonthEnd(i, extraRows, increase) {
            const today = days[i]["CST"].split("-");
            if (days[i + 1]) {
                const tomorrow = days[i + 1]["CST"].split("-");
                if (parseInt(today[1]) < parseInt(tomorrow[1])) {
                    if (increase) {
                    drawRhombus(4, neutralColor, i, extraRows, true); 
                    } else {
                        drawRhombus(4, neutralColor, i, extraRows, false);
                    }
                    return 1;
                }
            } else {
                drawRhombus(4, neutralColor, i, extraRows, false);
                return 1;
            }
            return 0;
        }
        
        function createRow(i, extraRows, shape) {
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
            } else if (shape === "middle") {
                drawMiddle(2, color2, i, extraRows);
                increase = false;
            }
            
            colorStats[neutralColor]++;
            drawRhombus(3, neutralColor, i, extraRows, increase);
            
            extraRows += checkMonthEnd(i, extraRows, increase);
            return extraRows;
        }
       
        function drawMiddle(rowNum, color, i, extraRows) {
            const dayOffset = i * 6;
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
            const dayOffsetY = i * 6;
            const extraLines = 2 * extraRows;
            let dayOffsetX = i * 6;
            let topX = triStepSize + dayOffsetX + extraLines + 2 * (rowNum - 1);
            let topY = triStepSize + dayOffsetY + extraLines + 2 * (rowNum - 1);
            let bottomX = triStepSize + dayOffsetX + extraLines + 2 * rowNum;
            let bottomY = triStepSize + dayOffsetY + extraLines + 2 * rowNum;
                    
            if (increase) {
                calculateArea(topX, color);
            } else {
                dayOffsetX = (days.length - i) * 6;
                if (extraRows < 7) {
                    topX = triStepSize + dayOffsetX + extraLines - 2 * (rowNum - 1);
                    bottomX = triStepSize + dayOffsetX + extraLines - 2 * rowNum;
                } else {
                    topX = triStepSize + dayOffsetX + 2 * (12 - extraRows) - 2 * (rowNum - 1);
                    bottomX = triStepSize + dayOffsetX + 2 * (12 - extraRows) - 2 * rowNum;
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
            const topY = triStepSize + (days.length * 6) + 2 * extraRows;
            canvas.beginPath();
            canvas.moveTo(-triStepSize, topY);
            canvas.lineTo(0, topY + 5);
            canvas.lineTo(triStepSize, topY);
            canvas.fillStyle = neutralColor;
            canvas.fill();
        }
        
        function drawBlanket() {
            // this is to draw a bias blanket with 1 row max, 1 row min, 1 row between days, 2 rows between months
            let extraRows = 0;
            drawTopTri();
            for (let i = 0; i < days.length; i++) {
                if (i < (days.length - 1) / 2) {
                    extraRows = createRow(i, extraRows, "increase");
                } else if (i === (days.length - 1) / 2) {
                    extraRows = createRow(i, extraRows, "middle");
                } else {
                    extraRows = createRow(i, extraRows, "decrease");
                }
            }
            drawBottomTri(extraRows);
        }
        addColorStats();
        getColorInput();
        drawBlanket();        
        console.log(colorStats);
        console.log(colorArea);
        console.log(colorPercents);
    });
})