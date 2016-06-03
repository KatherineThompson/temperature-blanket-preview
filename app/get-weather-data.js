"use strict";

const angular = require("angular");

angular.module("temperature-blanket").factory("getWeatherData", function($http) {
    return location => $http.get(`./data/${location}.json`).then(response => response.data);
});