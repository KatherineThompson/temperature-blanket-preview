"use strict";

function getCoordinates(blanketComponents) {
    let xOffset = 0;
    let yOffset = 0;
    return blanketComponents.map((component, index) => {
        const newComponent = {color: component.color};
        if (component.type === "triangle") {
            const triStepSize = 5;
            if (index === 0) {
                newComponent.points = [
                    {x: 0, y: 0},
                    {x: 0 + triStepSize, y: triStepSize},
                    {x: 0 - triStepSize, y: triStepSize}
                ];
                
                xOffset += triStepSize;
                yOffset += triStepSize;
            } else {
                newComponent.points = [
                    {x: -xOffset, y: yOffset},
                    {x: xOffset, y: yOffset},
                    {x: xOffset - triStepSize, y: yOffset + triStepSize}
                ];
                
                xOffset -= triStepSize;
                yOffset += triStepSize;
            }
        } else if (component.type === "row") {
            const rowStepSize = 2;
            if (index === 0) {
                newComponent.points = [
                    {x: 0, y: 0},
                    {x: 0 + rowStepSize, y: rowStepSize},
                    {x: 0 - rowStepSize, y: rowStepSize}
                ];
                
                xOffset += rowStepSize;
                yOffset += rowStepSize;
            } else if (blanketComponents.length % 2 !== 0 && index === Math.floor(blanketComponents.length / 2)) {
                newComponent.points = [
                    {x: -xOffset, y: yOffset},
                    {x: -xOffset - rowStepSize / 2, y: yOffset + rowStepSize / 2},
                    {x: -xOffset, y: yOffset + rowStepSize},
                    {x: xOffset, y: yOffset + rowStepSize},
                    {x: xOffset + rowStepSize / 2, y: yOffset + rowStepSize / 2},
                    {x: xOffset, y: yOffset}
                ];
                
                yOffset += rowStepSize;
            } else if (index < blanketComponents.length / 2) {
                newComponent.points = [
                    {x: -xOffset, y: yOffset},
                    {x: -xOffset - rowStepSize, y: yOffset + rowStepSize},
                    {x: xOffset + rowStepSize, y: yOffset + rowStepSize},
                    {x: xOffset, y: yOffset}
                ];
                
                xOffset += rowStepSize;
                yOffset += rowStepSize;
            } else if (index < blanketComponents.length - 1) {
                newComponent.points = [
                    {x: -xOffset, y: yOffset},
                    {x: -xOffset + rowStepSize, y: yOffset + rowStepSize},
                    {x: xOffset - rowStepSize, y: yOffset + rowStepSize},
                    {x: xOffset, y: yOffset}
                ];
                
                xOffset -= rowStepSize;
                yOffset += rowStepSize;
            } else {
                newComponent.points = [
                    {x: -xOffset, y: yOffset},
                    {x: xOffset, y: yOffset},
                    {x: xOffset - rowStepSize, y: yOffset + rowStepSize}
                ];
                
                xOffset -= rowStepSize;
                yOffset += rowStepSize;
            }
        }
        return newComponent;
    });
}

module.exports = getCoordinates;