"use strict"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import { scenePositions } from "./scene.mjs";


const bodyParts = {
    iris: {name: 'eye_left', child: 2},
    hair: {name :'hair_joined'},
    ears: {name: 'EARS', },
    head: {name: 'BSurfaceMesh002'},
    lowerBody: null,
    leg: null,
}

export class TCharacter extends THREE.Object3D {
    constructor(scene) {
        super(); 

        const loader = new GLTFLoader();
        const localHairColor = localStorage.getItem("haircolor");
        const localEyeColor = localStorage.getItem("eyecolor");
        const localSkinColor = localStorage.getItem("skincolor");

        loader.load("AvatarStudio/mediaAvatar/Boy-smaller-file.gltf", (gltfModel) => {
            //this.irisOfEye = gltfModel.scene.children[2].material;
            gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
            this.add(gltfModel.scene);

            function locateMesh (aBodyPart){
                const material = gltfModel.scene.children.find(child => child.name === aBodyPart)
                return material;
            }

            //const eyeMaterial = locateMesh(bodyParts.iris.name).material;

            const lights = gltfModel.scene.children.filter(child => child.isLight);

            const eyebrows = gltfModel.scene.children.find(child => child.name === 'eyebrow')
            if (eyebrows) {
                gltfModel.scene.remove(eyebrows);
            }
            lights.forEach(light => {

                light.intensity = 1;
            });
            const eyeMaterial = gltfModel.scene.children.find(child => child.name === 'eye_left')
            console.log(eyeMaterial)

            this.setIrisColor = function (aColor) {
                eyeMaterial.children[2].material.color.set(aColor);  
            };
            const hairMaterial = gltfModel.scene.children.find(child => child.name === 'hair_joined')
            console.log(hairMaterial)
            this.setHairColor = function (aColor) {
                hairMaterial.material.color.set(aColor); 
            };

            const skinMaterial = gltfModel.scene.children.find(child => child.name === 'BSurfaceMesh002')
            const earMaterial = gltfModel.scene.children.find(child => child.name === 'EARS')
            console.log(skinMaterial)

            this.setSkinColor = function (aColor) {
                skinMaterial.material.color.set(aColor);
                earMaterial.material.color.set(aColor)
            };

            this.setColor = function () {
                skinMaterial.material.color.set("#" + localSkinColor);
                earMaterial.material.color.set("#" + localSkinColor);
                eyeMaterial.children[2].material.color.set("#" + localEyeColor);
                hairMaterial.material.color.set("#" + localHairColor);

            }
            if ((localEyeColor && localHairColor && localSkinColor) !== null) {
                this.setColor();
            }
        });



    }
}