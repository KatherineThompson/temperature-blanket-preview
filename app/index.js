"use strict";

const angular = require("angular");

angular.module("temperature-blanket", [])
    .controller("TemperatureBlanketCtrl", function($scope, getWeatherData) {
    
    getWeatherData().then(function(days) {
        $scope.weatherData = days;
        
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
    });
});

require("./get-weather-data");
require("./tb-canvas");
require("../index.scss");