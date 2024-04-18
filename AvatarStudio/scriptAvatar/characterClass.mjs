"use strict"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import { scenePositions } from "./scene.mjs";
import fs from 'fs';
import { all } from "three/examples/jsm/nodes/Nodes.js";


const bodyParts = {
    eye: { name: 'eyes', color: "#FFE7C0" },
    hair: { name: 'hair_midlength', color: "#FFE7C0" },
    eyebrow: { name: "eyebrow_hairier", color: "#23100C" },
    skin: { name: 'skin', color: "#FFE7C0" },
    shirt: { name: 'shirt_base', color: "#FFE7C0" },
    pants: { name: 'pants_jogging', color: "#FFE7C0" },
}

const allMoves = [];
let currentIndex = 0;

function saveSteps() {
    currentIndex++;
    allMoves.push(JSON.parse(JSON.stringify(bodyParts)));
    if (currentIndex > 11) {
        allMoves.shift();
        currentIndex--;
        //setMesh(gltfModel.scene);
    }
    console.log(currentIndex);
    console.log(allMoves);
}

export class TCharacter extends THREE.Object3D {
    constructor() {
        super();

        const loader = new GLTFLoader();
        const categoryNames = ['shirt', 'hair', 'eyebrow', 'pants', 'cap', 'necklace', 'shoes', 'sunglasses', 'skirt', 'dress', 'halo', 'body', 'gloves', 'BezierCircle', 'Sphere', 'Plane', 'beard', 'backdrop'];

        loader.load("./AvatarStudio/mediaAvatar/character/avatar.gltf", (gltfModel) => {
            gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
            this.add(gltfModel.scene);

            function locateMeshToPhong(aBodyPart) {
                const mesh = gltfModel.scene.children.find(child => child.name === aBodyPart)
                if (mesh.name !== bodyParts.eye.name) {

                    const phongMaterial = new THREE.MeshPhongMaterial();

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

            const eyeMesh = locateMeshToPhong(bodyParts.eye.name);
            const lights = gltfModel.scene.children.filter(child => child.isLight);

            lights.forEach(light => {
                light.intensity = 40;
            });

            this.setColor = function (aMeshCategory, aColor) {
                const locatedMesh = locateMeshToPhong(bodyParts[aMeshCategory].name);
                bodyParts[aMeshCategory].color = aColor;
                if (locatedMesh == eyeMesh) {
                    setChildColor(aColor);
                } else {
                    locatedMesh.material.color.set(aColor);
                }
                saveSteps();
            }

            this.undo = function () {
                if (currentIndex != 0) {
                    do {
                        currentIndex--;
                        if (currentIndex >= 0 && currentIndex < allMoves.length) {
                            const stepToShow = allMoves[currentIndex];
                            setMesh(gltfModel.scene, bodyParts, false);
                            setMesh(gltfModel.scene, stepToShow);
                        }
                    } while (currentIndex >= allMoves.length - 1 && currentIndex >= 0);
                }
            }

            this.redo = function () {
                if (currentIndex != allMoves.length - 1 && currentIndex != allMoves.length) {
                    currentIndex++
                    if (currentIndex <= 11) {
                        const stepToShow = allMoves[currentIndex];
                        setMesh(gltfModel.scene, bodyParts, false)
                        setMesh(gltfModel.scene, stepToShow);
                    }
                }

            }

            this.changeMesh = function (category, name) {

                const childWithName = gltfModel.scene.children.find(child => child.name === bodyParts[category].name);
                if (childWithName) {
                    childWithName.visible = false;
                }
                delete bodyParts[category].name //remove the old name 
                bodyParts[category].name = name; //set the new name when old is removed
                setMesh(gltfModel.scene, bodyParts);
                this.setColor(category, bodyParts[category].color);
            };

            function setChildColor(aColor) {
                eyeMesh.children[1].material.color.set(aColor);
                eyeMesh.children[1].material.transparent = true
            };

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

                setMesh(scene, bodyParts);
            }

            function setMesh(scene, anObject, bool = true) {
                for (const category in anObject) {
                    if (anObject.hasOwnProperty(category)) {
                        const childName = anObject[category].name;

                        // Find the child object with the specified name within the scene
                        const child = scene.children.find(child => child.name === childName);
                        if (child) {
                            // If the child object is found, set its visibility to true
                            if (childName !== 'eyes') {
                                child.visible = bool;
                                const locatedMesh = locateMeshToPhong(childName);
                                locatedMesh.material.color.set(anObject[category].color);
                            }
                        }
                    }
                }
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

    }
}




