"use strict";

const angular = require("angular");
const getCoordinates = require("./get-coordinates");
const getBlanketComponents = require("./get-blanket-components");
const _ = require("lodash");

angular.module("temperature-blanket").directive("tbCanvas", function($window) {
    return {
        template: `<canvas
                        height="{{canvasDimensions.height}}"
                        width="{{canvasDimensions.width}}">
                        Visualization of weather data as a knitted or crocheted blanket
                    </canvas>`,
                    
        link: function(scope, element) {
            element.addClass("grid-block small-9");
            
            const canvas = element.find("canvas")[0].getContext("2d");
            
            scope.canvasDimensions = getCanvasDimensions();
            
            $window.addEventListener(
                "resize",
                () => scope.$apply(() => scope.canvasDimensions = getCanvasDimensions()),
                true
            );
            
            function drawBlanket() {
                if (scope.blanketParams && scope.weatherParams && scope.weatherData) {
                    const blanketComponents = getBlanketComponents(
                        scope.weatherParams,
                        scope.blanketParams,
                        scope.weatherData
                    );
                    const coordinates = getCoordinates(blanketComponents);
                    const lastPoints = _.last(coordinates).points;
                    const blanketDiagonalPoint = _.last(lastPoints).y;
                    const smallestCanvasDimension = scope.canvasDimensions.height < scope.canvasDimensions.width ?
                        scope.canvasDimensions.height : scope.canvasDimensions.width;
                    
                    const scaleFactor = smallestCanvasDimension / blanketDiagonalPoint;
                    
                    renderBlanket(coordinates, scaleFactor);
                }
            }
            
            scope.$watch(
                "[blanketParams, canvasDimensions.width, canvasDimensions.height, weatherData]",
                drawBlanket,
                true
            );
            
            function getCanvasDimensions() {
                return {
                    height: element[0].clientHeight,
                    width: element[0].clientWidth
                };
            }
            
            function clearCanvas() {
                canvas.setTransform(1, 0, 0, 1, 0, 0);
                canvas.clearRect(0, 0, scope.canvasDimensions.width, scope.canvasDimensions.height);
            }
            
            function renderBlanket(coordinates, scaleFactor)  {
                clearCanvas();
                canvas.translate(scope.canvasDimensions.width / 2 + 0.5, 0.5);
                canvas.scale(scaleFactor, scaleFactor);
                coordinates.forEach(shape => {
                    canvas.beginPath();
                    shape.points.forEach((point, index) => {
                        if (index === 0) {
                            canvas.moveTo(point.x, point.y);
                        } else {
                            canvas.lineTo(point.x, point.y);
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