"use strict";
import * as THREE from 'three';
import { TinitialiseScene, character, camera } from "./scene.mjs";
import { initializeColor, initializeMeshes } from "./colorOptions.mjs";

export function loadScene() {
  TinitialiseScene();
}

function saveImage(userId) {
  const saveConfirm = confirm("An image of the avatar will now be downloaded");

  if (saveConfirm) {
    requestAnimationFrame(() => {
      const canvas = document.getElementById("sceneCanvas");

      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      const fileType = canvas.toDataURL("image/webp");

      const downloadLink = document.createElement("a");
      downloadLink.href = fileType;
      downloadLink.download = `avatar_test.webp`;

      downloadLink.click();
    });
  } else {
    return;
  }
}

const checkBtn = document.getElementById("checkBtn");
checkBtn.addEventListener("click", saveImage);

const menuOptions = document.querySelectorAll("[menuOption]");

document.addEventListener("DOMContentLoaded", function () {
  if (menuOptions.length > 0) {
    setupOptionsMenu(menuOptions[0]);
  }
  menuOptions.forEach((option) => {
    option.addEventListener("click", function (event) {
      event.stopPropagation(); // Stop the click event from bubbling up
      setupOptionsMenu(this);
    });
  });
  const hairParentTab = document.getElementById("hairParent");
  hairParentTab.click(); //clicking on first tab to open it at page startup
});

function setupOptionsMenu(menuOption) {
  const menuOptionValue = menuOption.getAttribute("menuOption");
  const jsonFile = menuOption.getAttribute("jsonFile");

  // Remove child elements from colorSelector
  while (colorSelector.firstChild) {
    colorSelector.removeChild(colorSelector.firstChild);
  }

    // Initialize color or meshes based on JSON file
    if (jsonFile != null && jsonFile != 'meshCategories' && jsonFile != 'accessories') {
        initializeColor(menuOptionValue, jsonFile);
    } else if (jsonFile == 'meshCategories' || jsonFile == 'accessories') {
        initializeMeshes(jsonFile , menuOptionValue);
    } else {
        console.log("anError");
    }
}
const parentTabs = document.querySelectorAll(".tab");

parentTabs.forEach((parentTab) => {
  parentTab.addEventListener("click", function () {
    const parentId = this.id;
    const childrenTab = document.querySelector(`.${parentId}-hidden-tab`);

    parentTabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    switch (parentId) {
      case 'clothesParent':
        character.position.y = 2.2;
        camera.position.z = 8;
        break;
      case 'hairParent':
        character.position.y = 0;
        camera.position.z = 6;
        break;
      case 'eyeParent':
        character.position.y = 0;
        camera.position.z = 5;
        break;
      case 'skinParent':
        character.position.y = 2.2;
        camera.position.z = 8;
        break;
    }

    this.classList.toggle("active");

    const allHiddenTabs = document.querySelectorAll(".hidden-tab");
    allHiddenTabs.forEach((tab) => {
      if (tab !== childrenTab) {
        tab.style.display = "none";
      } else {
        tab.style.display = tab.style.display === "none" ? "block" : "none";
      }
    });
  });
});

const childrenTabs = document.querySelectorAll(".hidden-tab");
childrenTabs.forEach((childrenTab) => {
  childrenTab.addEventListener("click", function () {
    childrenTabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    this.classList.add("active");
  });
});

const undo = document.getElementById("undo");
const redo = document.getElementById("redo");

undo.addEventListener("click", () => {
  character.undo();
});
redo.addEventListener("click", () => {
  character.redo();
});