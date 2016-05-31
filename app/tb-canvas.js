"use strict";

const angular = require("angular");
const getCoordinates = require("./get-coordinates");
const getBlanketComponents = require("./get-blanket-components");
const weatherData = require("../data/wileyPost");

angular.module("temperature-blanket").directive("tb-canvas", function() {
    return {
        template: `<canvas id="canvas"
                        height="{{canvasDimensions.height}}"
                        width="{{canvasDimensions.width}}">
                        Visualization of weather data as a knitted or crocheted blanket
                    </canvas>`,
                    
        link: function(scope, element) {
            element.addClass("grid-block small-9");
            element.id("canvas-div");
            
            const canvas = $document[0].getElementById("canvas").getContext("2d");
            
            scope.canvasDimensions = _.merge(getCanvasDimensions(), {scaleFactor: .5});    
            canvas.translate($scope.canvasDimensions.width / 2, 0);
            canvas.scale($scope.canvasDimensions.scaleFactor, $scope.canvasDimensions.scaleFactor);
            
            
            const blanketComponents = getBlanketComponents(scope.weatherParams, scope.blanketParams, weatherData);
            const coordinates = getCoordinates(blanketComponents);
            drawBlanket(coordinates);
            
            $window.addEventListener(
                "resize",
                () => scope.$apply(() => scope.canvasDimensions = getCanvasDimensions()),
                true
            );
            
            scope.$watch("blanketParams", () => {
                drawBlanket(coordinates);
            }, true);
            
            $cope.$watch("[canvasDimensions.width, canvasDimensions.height]", () => {
                drawBlanket(coordinates);
            }, true);
            
            function getCanvasDimensions() {
                return {
                    height: element.clientHeight,
                    width: element.clientWidth
                };
            }
            
            function clearCanvas() {
                canvas.save();
                canvas.setTransform(1, 0, 0, 1, 0, 0);
                canvas.clearRect(0, 0, element.width, element.height);
                canvas.restore();
            }
            
            function drawBlanket(coordinates)  {
                debugger;
                clearCanvas();
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
            weatherParams: "="
        }
    };
});


        
        
        
        
        
        
        
