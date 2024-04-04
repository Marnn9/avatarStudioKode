"use strict";
import { TinitialiseScene } from './scene.mjs';
 import {initializeColor} from './colorOptions.mjs'

export function loadScene() {
    TinitialiseScene();
    //initializeSkinColorSelectors();

}


function saveImage(userId) {
    const saveConfirm = confirm("An image of the avatar will now be downloaded");

    if (saveConfirm) {
        requestAnimationFrame(() => {
            const canvas = document.getElementById('sceneCanvas');

            if (!canvas) {
                console.error("Canvas not found");
                return;
            }

            const fileType = canvas.toDataURL('image/webp');

            const downloadLink = document.createElement('a');
            downloadLink.href = fileType;
            downloadLink.download = `avatar_test.webp`
            //downloadLink.download = `avatar_${userId}.svg`;

            downloadLink.click();
        });
    } else {
        return;
    }
}
const checkBtn = document.getElementById("checkBtn")
checkBtn.addEventListener("click", saveImage);

document.addEventListener("DOMContentLoaded", function() {
    const menuOptions = document.querySelectorAll('[menuOption]');
    const defaultColor = '#CECECE';
    const selectedColor = '#9B5EF5'; 

    function handleMenuOptionClick(menuOption) {
        const menuOptionValue = menuOption.getAttribute('menuOption');
        const colorJsonFile = menuOption.getAttribute('colorJson');

        menuOptions.forEach(previous => {
            previous.style.backgroundColor = defaultColor;
        });
        menuOption.style.backgroundColor = selectedColor;

        while (colorSelector.firstChild) {
            colorSelector.removeChild(colorSelector.firstChild);
        }
        initializeColor(menuOptionValue, colorJsonFile);
    }

    if (menuOptions.length > 0) {
        handleMenuOptionClick(menuOptions[0]);
    }

    menuOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleMenuOptionClick(this);
        });
    });
});
