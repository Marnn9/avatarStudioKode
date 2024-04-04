import { character } from "./scene.mjs";

const colorSelectorContainer = document.getElementById("colorSelector");

export async function initializeColor(aMenuObject, aColorType) {
    try {
        
        const response = await fetch(`./json/${aColorType}.json`);
        const data = await response.json();
        const options = data.options || {};

        for (const option in options) {
            const color = options[option].hex;

            let colorSelector = document.createElement("div");

            colorSelector.id = option;
            colorSelector.className = "shadow-md p-3 rounded m-2 ratio ratio-1x1";
            colorSelector.style.backgroundColor = color;
            colorSelector.style.width = '20%';

            colorSelectorContainer.appendChild(colorSelector);

            colorSelector.addEventListener("click", () => {
                const functionName = `set${aMenuObject}Color`;
                character[functionName](color);                });
        }

    } catch (error) {
        console.error('Error initializing color selectors:', error);
    }
}

