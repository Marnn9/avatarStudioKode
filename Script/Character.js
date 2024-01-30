"use strict"
import { GLTFLoader } from "../three.js-master/build/GLTFLoader.js";
import * as THREE from '../three.js-master/src/Three.js';


const bodyParts = {
    head: null,
    neck: null,
    arm: null,
    chest: null,
    lowerBody: null,
    leg: null,
}

export class TCharacter extends THREE.Object3D {
    constructor(scene) {
        super(); //class constructor

        const loader = new GLTFLoader();
        

        loader.load("../media/Boy-smaller-file.gltf", (gltfModel) => {
            //this.irisOfEye = gltfModel.scene.children[2].material;
            gltfModel.scene.position.set(0, 0, 0);
            //gltfModel.scene.rotation.y = -Math.PI / 2;
            this.add(gltfModel.scene);

            const lights = gltfModel.scene.children.filter(child => child.isLight);

            /* const eyebrows = gltfModel.scene.children.find(child => child.name === 'eyebrow')
            if (eyebrows) {
                // Remove the eyebrows from their parent
                gltfModel.scene.remove(eyebrows);
            } */
            // Set the intensity of each light
            lights.forEach(light => {
               
                light.intensity = 1;
            });
            const eyeMaterial = gltfModel.scene.children[8].children[2].material
            console.log(eyeMaterial)

            // Define setIrisColor as a method of the class
            this.setIrisColor = function (aColor) {
                eyeMaterial.color.set(aColor);  // Set a default color for testing
            };
            const hairMaterial = gltfModel.scene.children[11].material
            console.log(hairMaterial)
            this.setHairColor = function (aColor) {
                hairMaterial.color.set(aColor);  // Set a default color for testing
            };
        });
    }
}
