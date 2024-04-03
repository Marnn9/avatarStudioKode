"use strict"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import { avatarFeatures, scenePositions } from "./scene.mjs";

export class TCharacterOptions extends THREE.Object3D {
    constructor(scene) {
        super();

        const loader = new GLTFLoader();
        let activeEyebrow = null;
        let activeType = null;
        const localBrows = localStorage.getItem("browtype");
        if(localBrows !== null){
            avatarFeatures.browType = localBrows;
            activeType = avatarFeatures.browType;
            if (activeType == 1) {
                loader.load("AvatarStudio/mediaAvatar/eyebrows.gltf", (gltfModel) => {
                    gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
                    activeType = 1;
                    avatarFeatures.browType = activeType;
                    this.add(gltfModel.scene);
                    activeEyebrow = gltfModel.scene;
                });
            } else {
                loader.load("AvatarStudio/mediaAvatar/eyebrows-1.gltf", (gltfModel) => {
                    gltfModel.scene.position.set(0, 1, 2);
                    activeType = 2;
                    avatarFeatures.browType = activeType;
                    this.add(gltfModel.scene);
                    activeEyebrow = gltfModel.scene;
                });
            }
        }

        const loadEyebrowsButton = document.getElementById('option2');

        loadEyebrowsButton.addEventListener('click', () => {

            if (activeEyebrow) {
                this.remove(activeEyebrow);
            }

            loader.load("AvatarStudio/mediaAvatar/eyebrows.gltf", (gltfModel) => {
                gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
                activeType = 1;
                avatarFeatures.browType = activeType;
                this.add(gltfModel.scene);
                activeEyebrow = gltfModel.scene;

            });
        });

        const loadEyebrows2Button = document.getElementById('option1');

        loadEyebrows2Button.addEventListener('click', () => {
            loader.load("AvatarStudio/mediaAvatar/eyebrows-1.gltf", (gltfModel) => {

                if (activeEyebrow) {
                    this.remove(activeEyebrow);
                }

                gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
                activeType = 2;
                avatarFeatures.browType = activeType;
                this.add(gltfModel.scene);
                activeEyebrow = gltfModel.scene;
            });
        });



    }
}
