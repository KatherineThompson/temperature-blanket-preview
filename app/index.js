"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("temperature-blanket", ["foundation"])
    .controller("TemperatureBlanketCtrl", function($scope, getWeatherData) {
    
    $scope.locations = [
        {fileName: "arlington", fullName: "Arlington, VA, 2015"},
        {fileName: "chicago", fullName: "Chicago, IL, 2015"},
        {fileName: "dallas", fullName: "Dallas, TX, 2015"},
        {fileName: "edmond", fullName: "Edmond, OK, 2015"},
        {fileName: "houston", fullName: "Houston, TX, 2015"},
        {fileName: "losAngeles", fullName: "Los Angeles, CA, 2015"},
        {fileName: "newYork", fullName: "New York, NY, 2015"},
        {fileName: "wileyPost", fullName: "Oklahoma City, OK, 2015"},
        {fileName: "philadelphia", fullName: "Philadelphia, PA, 2015"},
        {fileName: "phoenix", fullName: "Phoenix, AZ, 2015"},
        {fileName: "sanAntonio", fullName: "San Antonio, TX, 2015"},
        {fileName: "sanDiego", fullName: "San Diego, CA, 2015"},
        {fileName: "sanJose", fullName: "San Jose, CA, 2015"},
        {fileName: "dc", fullName: "Washington, DC, 2015"}
    ];
        
    $scope.selectedLocation = $scope.locations[7];
    
    // Eventually this will be configurable in the UI so the color ranges can be adjusted.
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
        neutralColor: "#6C7073"
    };
    
    $scope.$watch("selectedLocation", () => {
        getWeatherData($scope.selectedLocation.fileName).then(function(days) {
            $scope.weatherData = days;
            $scope.weatherParams.tempMax = _(days).map("Max TemperatureF").map(_.toNumber).max();
            $scope.weatherParams.tempMin = _(days).map("Min TemperatureF").map(_.toNumber).min();
        });
    }, true);
    
});

require("./get-weather-data");
require("./tb-canvas");
require("../index.scss");
require("foundation-apps/dist/js/foundation-apps"); 
require("foundation-apps/dist/js/foundation-apps-templates"); 