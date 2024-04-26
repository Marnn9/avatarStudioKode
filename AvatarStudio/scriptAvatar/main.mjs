"use strict";
import * as THREE from 'three';
import { TinitialiseScene, character, camera } from "./scene.mjs";
import { showColors, showMeshes } from "./tabOptions.mjs";

const scene = new TinitialiseScene();
export function loadScene() {
  scene.load();
  const exportedAvatarData = character;
}

const checkBtn = document.getElementById("checkBtn");
checkBtn.addEventListener("click", () => {
  scene.saveImg('imgCanvas');
});

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
  if (jsonFile != null && jsonFile != 'meshCategories') {
    showColors(menuOptionValue, jsonFile);
  } else if (jsonFile == 'meshCategories') {
    showMeshes(jsonFile, menuOptionValue);
  } else {
    console.log("anError");
  }
}
const parentTabs = document.querySelectorAll(".tab");

parentTabs.forEach((parentTab) => {
  let clickCount = 0;

  parentTab.addEventListener("click", function () {
    const parentId = this.id;

    clickCount++;
    if (this.id == ('clothesParent')) {
      character.position.y = 2.2;
      camera.position.z = 8
    } else if (this.id == ('hairParent')) {
      character.position.y = 0;
      camera.position.z = 6
    } else if (this.id == ('eyeParent')) {
      character.position.y = 0;
      camera.position.z = 5
    } else if (this.id == ('skinParent')) {
      character.position.y = 2.2; //this makes the character hop when savng images ... ,aby only move the camera NOT the character?
      camera.position.z = 8
    }
    parentTabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    this.classList.add("active");

    const allHiddenTabs = document.querySelectorAll(".hidden-tab");
    allHiddenTabs.forEach((tab) => {
      if (!tab.classList.contains(`${parentId}-hidden-tab`)) {
        tab.style.display = "none";
      } else {
        tab.style.display = clickCount % 2 === 0 ? "none" : "block";
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
