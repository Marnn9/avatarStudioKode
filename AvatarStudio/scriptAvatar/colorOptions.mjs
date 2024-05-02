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
           
            colorSelector.className = "shadow-md p-3 rounded m-2 ratio ratio-1x1 color-selector"; // Added 'color-selector' class
            colorSelector.style.backgroundColor = color;
            colorSelector.style.width = '20%';

            colorSelectorContainer.appendChild(colorSelector);

            colorSelector.addEventListener("click", () => {
                // Remove border from previously selected color
                const prevSelected = document.querySelector('.color-selector.border');
                if (prevSelected) {
                    prevSelected.classList.remove('border', 'border-5');
                }
                
                // Apply border to the selected color
                colorSelector.classList.add('border', 'border-5');
                
                // Set character color
                character.setColor(aMenuObject, color);
            });
        }

    } catch (error) {
        console.error('Error initializing color selectors:', error);
    }
}

export async function initializeMeshes(jsonfile, category) {
    try {
        // Fetch the JSON file
        const response = await fetch(`./json/${jsonfile}.json`);
        const data = await response.json();
        const options = data[category];

        for (const option in options) {
            let meshSelected = document.createElement("div");
            
            meshSelected.className = "shadow-md p-3 rounded m-2 ratio ratio-1x1 mesh-selector"; // Added 'mesh-selector' class
            meshSelected.style.width = '20%';

            // Set background image for the option
           
            meshSelected.style.backgroundImage = `url('./AvatarStudio/mediaAvatar/thumbnails/${options[option]}.png')`;
            meshSelected.style.backgroundSize = 'cover';
            meshSelected.style.backgroundPosition = 'center';

            colorSelectorContainer.appendChild(meshSelected);

            meshSelected.addEventListener("click", () => {
                // Remove border from previously selected mesh
                const prevSelected = document.querySelector('.mesh-selector.border');
                if (prevSelected) {
                    prevSelected.classList.remove('border', 'border-5');
                }
                
                // Apply border to the selected mesh
                meshSelected.classList.add('border', 'border-5');
                
                // Change mesh
                character.changeMesh(category, options[option]);
            });
        }
    } catch (error) {
        console.error('Error initializing mesh categories:', error);
    }
}
