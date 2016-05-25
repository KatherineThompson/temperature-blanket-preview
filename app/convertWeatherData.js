"use strict"

const fs = require("fs");
fs.readFile(process.argv[2], "utf8", function(err, fileContents) {
    
    if (err) {
        throw err;
    }
        
    const lines = fileContents.split("\r\n");
    const header = lines[0];

    const headerSplit = header.split(",");
    let days = lines.slice(1);
    if (lines[lines.length - 1] === "") {
        days = lines.slice(1, lines.length - 1);
    }

    const dayObjs = [];

    for (let i = 0; i < days.length; i++) {
        const separated = days[i].split(",");
        const dayObj = {};
        for (let k = 0; k < headerSplit.length; k++) {
            dayObj[headerSplit[k].trim()] = separated[k].trim();
        }
        dayObjs.push(dayObj);
    }
    fs.writeFile(process.argv[3], JSON.stringify(dayObjs), function(err) {
        if (err) {
            throw err;
        }
        console.log("File written successfully");
    });
});