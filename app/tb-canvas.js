"use strict";

const angular = require("angular");
const getCoordinates = require("./get-coordinates");
const getBlanketComponents = require("./get-blanket-components");
const _ = require("lodash");

angular.module("temperature-blanket").directive("tbCanvas", function($window, $document) {
    return {
        template: `<canvas id="canvas"
                        height="{{canvasDimensions.height}}"
                        width="{{canvasDimensions.width}}">
                        Visualization of weather data as a knitted or crocheted blanket
                    </canvas>`,
                    
        link: function(scope, element) {
            element.addClass("grid-block small-9");
            
            const canvas = $document[0].getElementById("canvas").getContext("2d");
            
            scope.canvasDimensions = getCanvasDimensions();
            
            $window.addEventListener(
                "resize",
                () => scope.$apply(() => scope.canvasDimensions = getCanvasDimensions()),
                true
            );
            
            scope.$watch("blanketParams", () => {
                if (scope.blanketParams && scope.weatherParams && scope.weatherData) {
                    const blanketComponents = getBlanketComponents(
                        scope.weatherParams,
                        scope.blanketParams,
                        scope.weatherData
                    );
                    const coordinates = getCoordinates(blanketComponents);
                    drawBlanket(coordinates);
                }
            }, true);
            
            scope.$watch("[canvasDimensions.width, canvasDimensions.height]", () => {
                if (scope.blanketParams && scope.weatherParams && scope.weatherData) {
                    const blanketComponents = getBlanketComponents(
                        scope.weatherParams,
                        scope.blanketParams,
                        scope.weatherData
                    );
                    const coordinates = getCoordinates(blanketComponents);
                    drawBlanket(coordinates);
                }
            }, true);
            
            function getCanvasDimensions() {
                return {
                    height: element[0].clientHeight,
                    width: element[0].clientWidth,
                    scaleFactor: 0.5
                };
            }
            
            function clearCanvas() {
                canvas.setTransform(1, 0, 0, 1, 0, 0);
                canvas.clearRect(0, 0, scope.canvasDimensions.width, scope.canvasDimensions.height);
            }
            
            function drawBlanket(coordinates)  {
                clearCanvas();
                const lineOffset = scope.blanketParams.options.triangleCaps ? 0.5 : 0;
                canvas.translate(scope.canvasDimensions.width / 2 + lineOffset, lineOffset);
                canvas.scale(scope.canvasDimensions.scaleFactor, scope.canvasDimensions.scaleFactor);
                coordinates.map(shape => {
                    canvas.beginPath();
                    shape.points.forEach((point, index) => {
                        if (index === 0) {
                            canvas.moveTo(shape.points[index].x, shape.points[index].y);
                        } else {
                            canvas.lineTo(shape.points[index].x, shape.points[index].y);
                        }
                    });
                    canvas.fillStyle = shape.color;
                    canvas.fill();
                });
            }
        },
        
        scope: {
            blanketParams: "=",
            weatherParams: "=",
            weatherData: "="
        }
    };
});