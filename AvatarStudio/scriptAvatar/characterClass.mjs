"use strict"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import { scenePositions } from "./scene.mjs";


const bodyParts = {
    iris: { name: 'eye002', child: 2 },
    hair: { name: 'hair_midlength' },
    head: { name: 'remeshed_joined' },
    shirt: { name: 'shirt_base' },
    lowerBody: { name: 'pants_jogging' },
    leg: null,
}

export class TCharacter extends THREE.Object3D {
    constructor() {
        super();

        const loader = new GLTFLoader();
        const localHairColor = localStorage.getItem("haircolor");
        const localEyeColor = localStorage.getItem("eyecolor");
        const localSkinColor = localStorage.getItem("skincolor");

        loader.load("./AvatarStudio/mediaAvatar/whiteSkin.gltf", (gltfModel) => {
            gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
            this.add(gltfModel.scene);

            function locateMesh(aBodyPart) {
                const mesh = gltfModel.scene.children.find(child => child.name === aBodyPart)
                if (mesh.name !== bodyParts.iris.name) {
                    // Create a new MeshPhongMaterial
                    const phongMaterial = new THREE.MeshPhongMaterial();
                    // Copy properties from MeshStandardMaterial to MeshPhongMaterial
                    phongMaterial.color.copy(mesh.material.color);
                    phongMaterial.map = mesh.material.map;
                    phongMaterial.normalMap = mesh.material.normalMap;
                    phongMaterial.normalScale.copy(mesh.material.normalScale);
                    phongMaterial.receiveShadow = true;
                    // You would need to do similar for other properties like roughness, emissive, etc.
                    mesh.material = phongMaterial;
                }

                return mesh;
            }
            console.log(gltfModel.scene);

            console.log(gltfModel.scene.parent.children);

            const eyeMaterial = locateMesh(bodyParts.iris.name);
            const hairMaterial = locateMesh(bodyParts.hair.name);
            const skinMaterial = locateMesh(bodyParts.head.name);
            const shirtMaterial = locateMesh(bodyParts.shirt.name);
            const pantsMaterial = locateMesh(bodyParts.lowerBody.name);

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
            };

            this.setTopColor = function (aColor) {
                shirtMaterial.material.color.set(aColor);
            };

            this.setBottomColor = function (aColor) {
                pantsMaterial.material.color.set(aColor);
            };

            this.setColor = function () {
                skinMaterial.material.color.set("#" + localSkinColor);
                eyeMaterial.children[2].material.color.set("#" + localEyeColor);
                hairMaterial.material.color.set("#" + localHairColor);
            }
            if ((localEyeColor && localHairColor && localSkinColor) !== null) {
                this.setColor();
            }
        });
    }
}