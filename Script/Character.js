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

        loader.load("../media/eye_test.gltf", (gltfModel) => {
            this.irisOfEye = gltfModel.scene.children[2].material;
            gltfModel.scene.position.set(0, 0, 0);
            gltfModel.scene.rotation.y = -Math.PI / 2;
            this.add(gltfModel.scene);

            // Define setIrisColor as a method of the class
            this.setIrisColor = function (aColor) {
                this.irisOfEye.color.set(aColor);  // Set a default color for testing
            };
        });
    }
}
