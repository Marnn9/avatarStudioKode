"use strict";
import * as dat from "dat.gui";



export function TControls() {
    //add the gui controls here so it is easily separated

    const gui = new dat.GUI();
    const colorChanger = { color: cubeMaterial.color.getHex() };

    gui.addColor(colorChanger, 'color').onChange(function (color) {
        cubeMaterial.color.set(color);
        // Set the color of the loaded model's material to the same color
        if (modelMaterial) {
            modelMaterial.color.set(color);
        }
    });


    addControls();

}