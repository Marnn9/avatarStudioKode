"use strict"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import { scenePositions } from "./scene.mjs";
import fs from 'fs';


const bodyParts = {
    iris: { name: 'eyes', child: 2 },
    hair: { name: 'hair_midlength' },
    head: { name: 'skin' },
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
            const pantsMaterial = locateMeshColor(bodyParts.lowerBody.name);

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

            this.changeMesh = function (aNewMesh, aType) {
                const updatedMesh = loadMesh(aNewMesh);
                this.remove(aType); //the type could be eyebrow.. in some way we need to store all eyebrows so we can remove them using the type and add new
                gltfModel.scene.add(updatedMesh);
            }

            function locateAllMeshes(scene) {
                const categoryNames = ['shirt', 'hair', 'eyebrow', 'pants', 'cap', 'necklace', 'shoes', 'sunglasses', 'skirt', 'dress', 'halo', 'body', 'gloves', 'BezierCircle', 'Sphere', 'Plane'];
                //const bodyPartsArray = [bodyParts.hair.name, bodyParts.head.name, bodyParts.iris.name, bodyParts.leg.name, bodyParts.lowerBody.name, bodyParts.shirt.name, gltfModel.scene.children.filter(child => child.isLight)]
                const meshCategories = {};
            
                categoryNames.forEach(categoryName => {
                    const options = {};
                    let optionCounter = 1;
                    
                    scene.children.forEach(child => {
                        if (child.name.startsWith(categoryName)) {
                            let currentChild = child; 
                            do {
                                options[`option${optionCounter++}`] = currentChild.name;
                                scene.remove(currentChild);
                                // Get the next child
                                currentChild = scene.children.find(nextChild => nextChild !== currentChild && nextChild.name.startsWith(categoryName));
                                meshCategories[categoryName] = options;
                            } while (currentChild);
                        }
                    });
            
                    
                });
                //setting up initial scene
                /* scene.children = scene.children.filter(child => child.name === 'skin');
                scene.children = scene.filter(child => child.isLight); */

                saveMeshCategoriesToFile(meshCategories, 'meshCategories.json');
            }

            function initializeScene(scene) {
                // scene.children = ;
                //setting all the nessasary children for the scene and adding to the object bodyparts etc.
            }

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

        /* function locateAllMeshes (){
            //categiries is named, shirt and hair
            foreach (categoryName in gltfModel.scene){
                const sceneMeshes = gltfModel.scene.children.find(child => child.name === categoryName)
                //set all meshes with the same category name in one object
                //continue to next categoryName
                //when all categories has been sorted, send them sorted to a json file
            }
        } */


    }
}