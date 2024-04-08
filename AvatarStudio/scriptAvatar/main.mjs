"use strict";
import { TinitialiseScene } from './scene.mjs';
import { initializeColor } from './colorOptions.mjs'


export function loadScene() {
    TinitialiseScene();
    //initializeSkinColorSelectors();

}
const menuOptions = document.querySelectorAll('[menuOption]');


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

document.addEventListener("DOMContentLoaded", function () {
    if (menuOptions.length > 0) {
        handleMenuOptionClick(menuOptions[0]);
    }
    menuOptions.forEach(option => {
        option.addEventListener('click', function () {
            handleMenuOptionClick(this);
        });
    });
});

function handleMenuOptionClick(menuOption) {
    const defaultColor = '#CECECE';
    const selectedColor = '#9B5EF5';
    const menuOptionValue = menuOption.getAttribute('menuOption');
    const colorJsonFile = menuOption.getAttribute('colorJson');
    const parentObject = menuOption.getAttribute('parent');

    menuOptions.forEach(previous => {
        previous.style.backgroundColor = defaultColor;
    });
    menuOption.style.backgroundColor = selectedColor;

    while (colorSelector.firstChild) {
        colorSelector.removeChild(colorSelector.firstChild);
    }

    if (colorJsonFile != null) {
        initializeColor(menuOptionValue, colorJsonFile);
    } else if (parentObject != null) {
        console.log("Parent clicked, load child options");
        //set the active to the first child of the parent (and make parent smaller?)
        //load this.children so you only get the children of the clicked menu option
    } else {
        console.log("anError");
    }
}