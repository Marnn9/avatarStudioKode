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
                character[functionName](color);
            });
        }

    } catch (error) {
        console.error('Error initializing color selectors:', error);
    }
}

export async function initializeMeshes(category) {
    try {
        // Fetch the JSON file
        const response = await fetch(`./json/meshCategories.json`);
        const data = await response.json();
        const options = data[category];

        for (const option in options) {
            let meshSelected = document.createElement("div");
            
            meshSelected.className = "shadow-md p-3 rounded m-2 ratio ratio-1x1";
            meshSelected.style.width = '20%';

            // Set background image for the option
            meshSelected.style.backgroundImage = `url('./AvatarStudio/mediaAvatar/thumbnails/${options[option]}.png')`;
            meshSelected.style.backgroundSize = 'cover';
            meshSelected.style.backgroundPosition = 'center';

            colorSelectorContainer.appendChild(meshSelected);
            //console.log(options[option])

            meshSelected.addEventListener("click", () => {
                console.log(options[option]);
                character.changeMesh(category, options[option]);
            });
        }
    } catch (error) {
        console.error('Error initializing mesh categories:', error);
    }
}
