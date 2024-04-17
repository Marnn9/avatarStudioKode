"use strict";
import { TinitialiseScene } from './scene.mjs';
import { initializeColor, initializeMeshes } from './colorOptions.mjs'


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

            downloadLink.click();
        });
    } else {
        return;
    }
}

const checkBtn = document.getElementById("checkBtn")
checkBtn.addEventListener("click", saveImage);

const menuOptions = document.querySelectorAll('[menuOption]');

document.addEventListener("DOMContentLoaded", function () {
    if (menuOptions.length > 0) {
        setupOptinsMenu(menuOptions[0]);
    }
    menuOptions.forEach(option => {
        option.addEventListener('click', function(event) {
            event.stopPropagation(); // Stop the click event from bubbling up
            setupOptinsMenu(this);
        });
    });
});

function setupOptinsMenu(menuOption) {
    const defaultColor = '#CECECE';
    const selectedColor = '#9B5EF5';
    const menuOptionValue = menuOption.getAttribute('menuOption');
    const jsonFile = menuOption.getAttribute('jsonFile');
    const parentAttribute = menuOption.getAttribute('parent');
    /* console.log(menuOptionValue);
    console.log(jsonFileFile); */

    menuOptions.forEach(previous => {
        previous.style.backgroundColor = defaultColor;
    });
   
    menuOption.style.backgroundColor = selectedColor;

    while (colorSelector.firstChild) {
        colorSelector.removeChild(colorSelector.firstChild);
    }
    if (jsonFile != null && jsonFile != 'meshCategories' ) {
        initializeColor(menuOptionValue, jsonFile);
    } else if (jsonFile == 'meshCategories'){
        initializeMeshes(menuOptionValue);
    }
    else {
        console.log("anError");
    }
}