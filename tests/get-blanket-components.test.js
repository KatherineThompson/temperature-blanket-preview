"use strict";

const test = require("tape");
const getBlanketComponents = require("../app/get-blanket-components");
const weatherData = require("../data/wileyPost.json");
const missingDayData = require("../data/edmond.json");

test("getBlanketComponents", t => {
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
        t.test("triangles exist", t => {
            t.plan(1);
            
            blanketParams.options = {
                dayRow: true,
                monthRow: true,
                triangleCaps: true
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const expectedTriangleComponent = {type: "triangle", color: "#6C7073"};
            
            t.deepEqual(
                [blanketComponents[0], blanketComponents[1106]],
                [expectedTriangleComponent, expectedTriangleComponent],
                "the first and last elements are the correct triangle objects"
            );
        });
        
        t.test("no triangles", t => {
            t.plan(1);
            
            blanketParams.options = {
                dayRow: true,
                monthRow: true,
                triangleCaps: false
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            
            const expectedFirstComponent = {type: "row", color: "#624070"};
            const expectedLastComponent = {type: "row", color: "#4B4D6B"};
            
            t.deepEqual(
                [blanketComponents[0], blanketComponents[1104]],
                [expectedFirstComponent, expectedLastComponent],
                "the first and last elements are not triangle objects"
            );
        });
    });
    
    t.test("day separators", t => {
        t.test("day separators exist", t => {
            t.plan(2);
            
            blanketParams.options = {
                dayRow: true,
                monthRow: true,
                triangleCaps: true
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const expectedDaySeparator = {type: "row", color: "#6C7073"};
            const expectedLengthWithDaySeparators = 1107;
            
            t.deepEqual(
                blanketComponents[3],
                expectedDaySeparator,
                "the fourth element is the correct day separator"
            );
            
            t.equal(
                blanketComponents.length,
                expectedLengthWithDaySeparators,
                "the array is the correct length when there are day separators"
            );
            
        });
        
        t.test("no day separators", t => {
            t.plan(2);
            
            blanketParams.options = {
                dayRow: false,
                monthRow: true,
                triangleCaps: true
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const expectedNotDaySeparator = {type: "row", color: "#4B4D6B"};
            const expectedLengthWithoutDaySeparators = 743;
            
            t.deepEqual(
                blanketComponents[3],
                expectedNotDaySeparator,
                "the fourth element is the correct min temp of the second day and not a day separator"
            );
            
            t.equal(
                blanketComponents.length,
                expectedLengthWithoutDaySeparators,
                "the array is the correct length when there are no day separators"
            );
        });
    });
    
    t.test("month separators", t => {
        t.test("month separators exist", t => {
            t.plan(2);
            
            blanketParams.options = {
                dayRow: true,
                monthRow: true,
                triangleCaps: true
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const expectedMonthSeparator = {type: "row", color: "#6C7073"};
            const expectedLengthWithMonthSeparators = 1107;
            
            t.deepEqual(
                blanketComponents[94],
                expectedMonthSeparator,
                "the 95th element is the correct month separator"
            );
            
            t.equal(
                blanketComponents.length,
                expectedLengthWithMonthSeparators,
                "the array is the correct length when there are month separators"
            );
        });
        
        t.test("no month separators", t => {
            t.plan(2);
            
            blanketParams.options = {
                dayRow: true,
                monthRow: false,
                triangleCaps: true
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const expectedNotMonthSeparator = {type: "row", color: "#624070"};
            const expectedLengthWithoutMonthSeparators = 1096;
            
            t.deepEqual(
                blanketComponents[94],
                expectedNotMonthSeparator,
                "the 95th element is the min temp of 02/01/15, not a month separator"
            );
            
            t.equal(
                blanketComponents.length,
                expectedLengthWithoutMonthSeparators,
                "the array is the correct length when there are no month separators"
            );
        });
    });
    
    t.test("min and max temp colors change order in middle", t => {
        t.test("top and bottom", t => {
            t.plan(1);
            
            blanketParams.options = {
                dayRow: true,
                monthRow: true,
                triangleCaps: true
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const expectedFirst = {type: "row", color: "#624070"};
            const expectedSecond = {type: "row", color: "#4B4D6B"};
            const expectedSecondToLast = {type: "row", color: "#074771"};
            const expectedLast = {type: "row", color: "#4B4D6B"};
            
            t.deepEqual(
                [blanketComponents[1], blanketComponents[2], blanketComponents[1101], blanketComponents[1102]],
                [expectedFirst, expectedSecond, expectedSecondToLast, expectedLast],
                "the order of the min and max temperatures is different at the top and bottom"
            );
        });
        
        t.test("at middle", t => {
            t.plan(1);
            
            blanketParams.options = {
                dayRow: false,
                monthRow: false,
                triangleCaps: false
            };
            
            const blanketComponents = getBlanketComponents(weatherParams, blanketParams, weatherData);
            const expectedFirst = {type: "row", color: "#EBC05B"};
            const expectedSecond = {type: "row", color: "#9D1F33"};
            const expectedSecondToLast = {type: "row", color: "#9D1F33"};
            const expectedLast = {type: "row", color: "#EBC05B"};
            
            t.deepEqual(
                [blanketComponents[364], blanketComponents[365], blanketComponents[366], blanketComponents[367]],
                [expectedFirst, expectedSecond, expectedSecondToLast, expectedLast],
                "the order of the min and max temperatures is different in the middle"
            );
        });
    });
    
    t.test("missing data", t => {
        t.plan(1);
        
        blanketParams.options = {
            dayRow: false,
            monthRow: false,
            triangleCaps: false
        };
        
        const blanketComponents = getBlanketComponents(weatherParams, blanketParams, missingDayData);
        const expectedNeutralRow = {type: "row", color: "#6C7073"};
        
        t.deepEqual(
            [blanketComponents[98], blanketComponents[99]],
            [expectedNeutralRow, expectedNeutralRow],
            "for missing data, the correct neutral color is used"
        );
    });
});