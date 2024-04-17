"use strict"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import { scenePositions } from "./scene.mjs";
import fs from 'fs';


const bodyParts = {
    iris: { name: 'eyes'},
    hair: { name: 'hair_midlength' },
    head: { name: 'skin' },
    shirt: { name: 'shirt_base' },
    pants: { name: 'pants_jogging' },
    leg: null,
}

export class TCharacter extends THREE.Object3D {
    constructor() {
        super();

        const loader = new GLTFLoader();
        const localHairColor = localStorage.getItem("haircolor");
        const localEyeColor = localStorage.getItem("eyecolor");
        const localSkinColor = localStorage.getItem("skincolor");


        const categoryNames = ['shirt', 'hair', 'eyebrow', 'pants', 'cap', 'necklace', 'shoes', 'sunglasses', 'skirt', 'dress', 'halo', 'body', 'gloves', 'BezierCircle', 'Sphere', 'Plane'];

        loader.load("./AvatarStudio/mediaAvatar/character/avatar.gltf", (gltfModel) => {
            gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
            this.add(gltfModel.scene);

            function locateMeshColor(aBodyPart) {
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

            const eyeMaterial = locateMeshColor(bodyParts.iris.name);
            const hairMaterial = locateMeshColor(bodyParts.hair.name);
            const skinMaterial = locateMeshColor(bodyParts.head.name);
            const shirtMaterial = locateMeshColor(bodyParts.shirt.name);
            const pantsMaterial = locateMeshColor(bodyParts.pants.name);

            const lights = gltfModel.scene.children.filter(child => child.isLight);

            const eyebrows = gltfModel.scene.children.find(child => child.name === 'eyebrow')
            if (eyebrows) {
                gltfModel.scene.remove(eyebrows);
            }

            lights.forEach(light => {
                light.intensity = 40;
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


            function locateAllMeshes(scene) {
                const meshCategories = {};
            
                categoryNames.forEach(categoryName => {
                    const processedMeshes = new Set(); // Keep track of processed meshes
            
                    scene.children.forEach(child => {
                        if (child.name.startsWith(categoryName) && !processedMeshes.has(child)) {
                            const options = {};
                            let optionCounter = 1;
                            let currentChild = child;
                            do {
                                options[`option${optionCounter++}`] = currentChild.name;
                                processedMeshes.add(currentChild); // Mark the mesh as processed
                                // Hiding the mesh instead of removing it
                                currentChild.visible = false;
                                // Get the next child
                                currentChild = scene.children.find(nextChild => nextChild !== currentChild && nextChild.name.startsWith(categoryName) && !processedMeshes.has(nextChild));
                            } while (currentChild);
                            meshCategories[categoryName] = options;
                        }
                    });
                });
            
                startupMeshes(scene);
            
                // Call the function to hide meshes initially            
                // Save mesh categories to file
                // saveMeshCategoriesToFile(meshCategories, 'meshCategories.json');
            }

            function startupMeshes(scene) {
                const startCategories = ['hair', 'shirt', 'pants'];
            
                startCategories.forEach(category => {
                    const objectsInCategory = scene.children.filter(child => child.name.startsWith(category));
            
                    // Find the child object with the name stored in bodyParts[category].name
                    const childWithName = objectsInCategory.find(child => child.name === bodyParts[category].name);
            
                    if (childWithName) {
                        // If the child object is found, set its visibility to true
                        childWithName.visible = true;
                    }
                });
            }

            this.changeMesh = function (category, name) {

                const childWithName = gltfModel.scene.children.find(child => child.name === bodyParts[category].name);
                if (childWithName) {
                    childWithName.visible = false;
                }
                delete bodyParts[category].name //remove the old name 
                bodyParts[category].name = name; //set the new name when old is removed
                startupMeshes(gltfModel.scene);
            };

            function saveMeshCategoriesToFile(meshCategories, fileName) {
                const jsonData = JSON.stringify(meshCategories, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
            
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }

            locateAllMeshes(gltfModel.scene);
        });
        
    }
}