"use strict";
import { TinitialiseScene } from './scene.mjs';

export function loadScene() {
    TinitialiseScene();

}

/* const {canvasForImg} = TinitialiseScene();
canvasForImg();
 */
function saveImage (userId) {
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

