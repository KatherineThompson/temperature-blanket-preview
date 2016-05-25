"use strict";
const path = require("path");

module.exports = {
    // entry: path.join(__dirname, "app", "index.js"),
    entry: "./app/index.js",
    output: {
       path: path.join(__dirname, "dist"),
       filename: "built.js",
       publicPath:"/dist"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                excluder: /node_modules/,
                loader: "babel-loader",
                query: { presets: ["es2015"]}
            }
        ]
        // noParse: [/foundation-apps/, /lodash/, /angular.js$/]    
    },
    devtool: "inline-source-map"
};