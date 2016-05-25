"use strict";
const path = require("path");

module.exports = {
    entry: path.join(__dirname, "app", "index.js"),
    output: {
       path: path.join(__dirname, "dist"),
       filename: "built.js"
    },
    devtool: "inline-source-map"
};