"use strict";

const test = require("tape");
const getColor = require("../app/get-color");

test("getColor", t => {
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
        ]
    };
    
    t.test("temperature in middle of color range", t => {
        t.plan(1);
        const midRangeTemp = 50;
        const expectedColor = "#31473D";
        
        t.equal(
            getColor(midRangeTemp, weatherParams, blanketParams),
            expectedColor,
            "the function returns the expected color for a temperature in the middle of a range"
        );
    });
    t.test("temperature at beginning of color range", t => {
        t.plan(1);
        const beginningTemp = 55;
        const expectedColor = "#48634C";
        
        t.equal(
            getColor(beginningTemp, weatherParams, blanketParams),
            expectedColor,
            "the function returns the expected color for a temperature at the beginning of a range"
        );
    });
    t.test("temperature at end of color range", t => {
        t.plan(1);
        const endTemp = 54;
        const expectedColor = "#31473D";
        
        t.equal(
            getColor(endTemp, weatherParams, blanketParams),
            expectedColor,
            "the function returns the expected color for a temperature at the end of a range"
        );
    });
    t.test("coldest temperature", t => {
        t.plan(1);
        const coldestTemp = 5;
        const expectedColor = "#332546";
        
        t.equal(
            getColor(coldestTemp, weatherParams, blanketParams),
            expectedColor,
            "the function returns the expected color for the coldest temperature"
        );
    });
    t.test("hottest temperature", t => {
        t.plan(1);
        const hottestTemp = 104;
        const expectedColor = "#7C1623";
        
        t.equal(
            getColor(hottestTemp, weatherParams, blanketParams),
            expectedColor,
            "the function returns the expected color for the hottest temperature"
        );
    });
    t.test("out of range temperature", t => {
        t.plan(4);
        const outOfRangeTemp = 200;
        
        try {
            getColor(outOfRangeTemp, weatherParams, blanketParams);
            t.fail("Should have thrown an error");
        } catch (e) {
            t.equal(e.temp, outOfRangeTemp, "the temp on the error matches the out of range temp");
            t.equal(e.tempMin, weatherParams.tempMin, "the min temp on the error matches the min temp");
            t.equal(e.tempMax, weatherParams.tempMax, "the max temp on the error matches the max temp");
            t.equal(e.message, "Temperature is out of bounds", "the error message is correct");
        }
    });
});