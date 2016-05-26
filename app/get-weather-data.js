"use strict";

const angular = require("angular");

angular.module("temperature-blanket").factory("getWeatherData", function($http) {
    return () => $http.get("./data/wileyPost.json").then(response => response.data);
});