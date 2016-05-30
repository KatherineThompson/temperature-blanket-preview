"use strict";

const test = require("tape");
const getCoordinates = require("../app/get-coordinates");
const getBlanketComponents = require("../app/get-blanket-components");
const weatherData = require("../data/wileyPost.json");

test("getCoordinates", t => {
    const weatherParams = {
        tempMin: 5,
        tempMax: 104
    };
    
    const blanketParams = {
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
        neutralColor: "#6C7073"
    };
    
    t.test("triangles", t => {
        t.plan(1);
        
        blanketParams.options = {
            dayRow: false,
            monthRow: false,
            triangleCaps: true
        };
        
        const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
        const topTri = {color: "#6C7073", points: [{x: 0, y: 0}, {x: 5, y: 5}, {x: -5, y: 5}]};
        const bottomTri = {color: "#6C7073", points: [{x: -5, y: 1465}, {x: 5, y: 1465}, {x: 0, y: 1470}]};
        const coordinates = getCoordinates(blanketComponents);
        
        t.deepEqual(
            [coordinates[0], coordinates[coordinates.length - 1]],
            [topTri, bottomTri],
            "the top and bottom triangle have the correct coordinates"
        );
    });
    
    t.test("first and last rows", t => {
        t.test("with triangles", t => {
           t.plan(1); 
           
            blanketParams.options = {
                dayRow: false,
                monthRow: false,
                triangleCaps: true
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const firstRow = {color: "#624070", points: [{x: -5, y: 5}, {x: -7, y: 7}, {x: 7, y: 7}, {x: 5, y: 5}]};
            const lastRow = {
                color: "#4B4D6B",
                points: [{x: -7, y: 1463}, {x: -5, y: 1465}, {x: 5, y: 1465}, {x: 7, y: 1463}]
            };
            const coordinates = getCoordinates(blanketComponents);
            
            t.deepEqual(
                [coordinates[1], coordinates[coordinates.length - 2]],
                [firstRow, lastRow],
                "the first and last rows have the correct coordinates when there are triangle caps"
            );
        });
        
        t.test("without triangles", t => {
           t.plan(1); 
           
            blanketParams.options = {
                dayRow: false,
                monthRow: false,
                triangleCaps: false
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const firstRow = {color: "#624070", points: [{x: 0, y: 0}, {x: 2, y: 2}, {x: -2, y: 2}]};
            const lastRow = {
                color: "#4B4D6B",
                points: [{x: -2, y: 1458}, {x: 2, y: 1458}, {x: 0, y: 1460}]
            };
            const coordinates = getCoordinates(blanketComponents);
            
            t.deepEqual(
                [coordinates[0], coordinates[coordinates.length - 1]],
                [firstRow, lastRow],
                "the first and last rows have the correct coordinates when there are not triangle capss"
            );
        });
    });
    
    t.test("middle", t => {
        t.test("even num rows", t => {
            t.plan(1);
            
            blanketParams.options = {
                dayRow: false,
                monthRow: false,
                triangleCaps: false
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const lastIncreaseRow = {
                color: "#EBC05B",
                points: [{x: -728, y: 728}, {x: -730, y: 730}, {x: 730, y: 730}, {x: 728, y: 728}]
            };
            const firstDecreaseRow = {
                color: "#9D1F33",
                points: [{x: -730, y: 730}, {x: -728, y: 732}, {x: 728, y: 732}, {x: 730, y: 730}]
            };
            const coordinates = getCoordinates(blanketComponents);
            
            t.deepEqual(
                [coordinates[364], coordinates[365]],
                [lastIncreaseRow, firstDecreaseRow],
                "the last increase row and first decrease row have the correct coordinates"
            );
        });
        
        t.test("odd num rows", t => {
            t.plan(1);
            
            blanketParams.options = {
                dayRow: false,
                monthRow: true,
                triangleCaps: false
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const middleRow = {
                color: "#EBC05B",
                points: [
                    {x: -740, y: 740},
                    {x: -741, y: 741},
                    {x: -740, y: 742},
                    {x: 740, y: 742},
                    {x: 741, y: 741},
                    {x: 740, y: 740}
                ]
            };
            const coordinates = getCoordinates(blanketComponents);
            
            t.deepEqual(
                coordinates[370],
                middleRow,
                "the first and last rows have the correct coordinates when there are not triangle capss"
            );
        });
    });
});
