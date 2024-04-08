"use strict"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import { scenePositions } from "./scene.mjs";


const bodyParts = {
    iris: {name: 'eye002', child: 2},
    hair: {name :'hair_midlength'},
    head: {name: 'remeshed_joined', ears: {name: 'EARS', }},
    shirt: {name: 'shirt_base'},
    lowerBody: {name: 'pants_jogging'},
    leg: null,
}

export class TCharacter extends THREE.Object3D {
    constructor() {
        super(); 

        const loader = new GLTFLoader();
        const localHairColor = localStorage.getItem("haircolor");
        const localEyeColor = localStorage.getItem("eyecolor");
        const localSkinColor = localStorage.getItem("skincolor");

        loader.load("./AvatarStudio/mediaAvatar/baseModel.gltf", (gltfModel) => {
            //this.irisOfEye = gltfModel.scene.children[2].material;
            gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
            this.add(gltfModel.scene);

            function locateMesh (aBodyPart){
                const material = gltfModel.scene.children.find(child => child.name === aBodyPart)
                return material;
            }
            console.log(gltfModel.scene);

            console.log(gltfModel.scene.parent.children);

            const eyeMaterial = locateMesh(bodyParts.iris.name);
            const hairMaterial = locateMesh(bodyParts.hair.name);
            const skinMaterial = locateMesh(bodyParts.head.name);
            const earMaterial = locateMesh(bodyParts.head.ears.name);

            const shirtMaterial = locateMesh(bodyParts.shirt.name);
            const pantsMaterial = locateMesh(bodyParts.lowerBody.name);
            console.log(shirtMaterial);
            
            const lights = gltfModel.scene.children.filter(child => child.isLight);

            const eyebrows = gltfModel.scene.children.find(child => child.name === 'eyebrow')
            if (eyebrows) {
                gltfModel.scene.remove(eyebrows);
            }
            lights.forEach(light => {

                light.intensity = 1;
            });

            this.setIrisColor = function (aColor) {
                
                eyeMaterial.children[1].material.color.set(aColor);
                eyeMaterial.children[1].material.transparent = true
            };
           
            this.setHairColor = function (aColor) {
                hairMaterial.material.color.set(aColor); 
            };

            this.setSkinColor = function (aColor) {
                skinMaterial.material.color.set(aColor);
                //earMaterial.material.color.set(aColor)
            };

            this.setTopColor = function (aColor) {
                shirtMaterial.material.color.set(aColor); 
            };

            this.setBottomColor = function (aColor) {
                pantsMaterial.material.color.set(aColor); 
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