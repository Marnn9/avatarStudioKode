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
        setupOptionsMenu(menuOptions[0]);
    }
    menuOptions.forEach(option => {
        option.addEventListener('click', function(event) {
            event.stopPropagation(); // Stop the click event from bubbling up
            setupOptionsMenu(this);
        });
    });
});

function setupOptionsMenu(menuOption) {
    const menuOptionValue = menuOption.getAttribute('menuOption');
    const jsonFile = menuOption.getAttribute('jsonFile');

    
    // Remove child elements from colorSelector
    while (colorSelector.firstChild) {
        colorSelector.removeChild(colorSelector.firstChild);
    }

    // Initialize color or meshes based on JSON file
    if (jsonFile != null && jsonFile != 'meshCategories') {
        initializeColor(menuOptionValue, jsonFile);
    } else if (jsonFile == 'meshCategories') {
        initializeMeshes(menuOptionValue);
    } else {
        console.log("anError");
    }
}
const parentTabs = document.querySelectorAll('.tab');

    parentTabs.forEach(parentTab => {
        let clickCount = 0; // Move clickCount declaration inside the loop

        parentTab.addEventListener('click', function () {
            const parentId = this.id;

            // Increment the click count for each click
            clickCount++;
           
            // Remove the 'active' class from all tabs
            parentTabs.forEach(tab => {
                tab.classList.remove('active');
            });

            // Add the 'active' class to the clicked tab
            this.classList.add('active');

            // Toggle the visibility of the corresponding hidden tabs based on the click count
            const allHiddenTabs = document.querySelectorAll('.hidden-tab');
            allHiddenTabs.forEach(tab => {
                if (!tab.classList.contains(`${parentId}-hidden-tab`)) {
                    tab.style.display = 'none'; // Toggle display based on click count
                } else {
                    tab.style.display = clickCount % 2 === 0 ? 'none' : 'block';
                    ; // Always show the tab corresponding to the clicked parent
                }
            });
        });
    });



