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
            const originalCanvas = document.getElementById('sceneCanvas');

            if (!originalCanvas) {
                console.error("Canvas not found");
                return;
            }

            const newCanvas = document.createElement('canvas');
            const newCanvasContext = newCanvas.getContext('2d');

            const canvasWidth = 800; // Set your desired width
            const canvasHeight = 600; // Set your desired height

            newCanvas.width = canvasWidth;
            newCanvas.height = canvasHeight;

            // Set constant aspect ratio for rendering
            setConstantAspectRatio(canvasWidth, canvasHeight);

            newCanvasContext.drawImage(originalCanvas, 0, 0, canvasWidth, canvasHeight);

            const fileType = newCanvas.toDataURL('image/webp');

            const downloadLink = document.createElement('a');
            downloadLink.href = fileType;
            downloadLink.download = `avatar_test.webp`;

            downloadLink.click();
        });
    } else {
        return;
    }
}

function setConstantAspectRatio(width, height) {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Don't append the renderer.domElement or render the scene here
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