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
    glasses: { name: 'null' },
    earring: { name: 'null', color: "#FFE7C0" },
    necklace: { name: 'null', color: "#FFE7C0" },
    misc: { name: 'null', color: "#FFE7C0" },
    cap: { name: 'null', color: "#FFE7C0" },

}

const allMoves = [];
let currentIndex = -1; //starts at this so it matches the index in the array

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
        const categoryNames = ['shirt', 'hair', 'eyebrow', 'pants', 'cap', 'necklace', 'accessories', 'earring', 'shoes', 'glasses', 'skirt', 'dress', 'halo', 'body', 'gloves', 'BezierCircle', 'Sphere', 'Plane', 'beard', 'backdrop'];

        loader.load("./AvatarStudio/mediaAvatar/character/avatar.gltf", (gltfModel) => {
            gltfModel.scene.position.set(scenePositions.x, scenePositions.y, scenePositions.z);
            this.add(gltfModel.scene);

            function locateMeshToPhong(aBodyPart) {
                let mesh = gltfModel.scene.children.find(child => child.name === aBodyPart);
                const childMesh = mesh.children[0];

                if (childMesh) {
                    mesh = childMesh
                }

                const phongMaterial = new THREE.MeshPhongMaterial();
                phongMaterial.color.copy(mesh.material.color);
                phongMaterial.map = mesh.material.map;
                phongMaterial.normalMap = mesh.material.normalMap;
                phongMaterial.normalScale.copy(mesh.material.normalScale);
                phongMaterial.receiveShadow = true;
                mesh.material = phongMaterial;
                return mesh;
            }

            console.log(gltfModel.scene);
            console.log(gltfModel.scene.parent.children);

            const lights = gltfModel.scene.children.filter(child => child.isLight);

            lights.forEach(light => {
                light.intensity = 40;
            });

            this.setColor = function (aMeshCategory, aColor) {
                const locatedMesh = locateMeshToPhong(bodyParts[aMeshCategory].name);
                bodyParts[aMeshCategory].color = aColor;
                locatedMesh.material.color.set(aColor);
                saveSteps();
            }

            this.undo = function () {
                if (currentIndex > 0) {
                    currentIndex--;
            
                    const stepToShow = allMoves[currentIndex];
                    const stepToDelete = allMoves[currentIndex + 1]; // Corrected the index for stepToDelete
                
                    setMesh(gltfModel.scene, stepToDelete, false);
                    setMesh(gltfModel.scene, stepToShow);

                } else {
                    console.log('Already at the beginning. Cannot undo any further.');
                }
            };

            this.redo = function () {
                if (currentIndex != allMoves.length - 1 && currentIndex != allMoves.length) {
                    currentIndex++
                    if (currentIndex <= 11) {
                        const stepToShow = allMoves[currentIndex];
                        setMesh(gltfModel.scene, stepToShow - 1, false);
                        setMesh(gltfModel.scene, stepToShow);
                    }
                }
            }

            this.changeMesh = function (category, name) {
                const childWithName = gltfModel.scene.children.find(child => child.name === bodyParts[category].name);
                if (childWithName) {
                    childWithName.visible = false;
                }
                delete bodyParts[category].name;
                bodyParts[category].name = name;
                setMesh(gltfModel.scene, bodyParts);
                this.setColor(category, bodyParts[category].color);
            };

            function locateAllMeshes(scene) {
                const meshCategories = {};

                categoryNames.forEach(categoryName => {
                    const processedMeshes = new Set();

                    scene.children.forEach(child => {
                        if (child.name.startsWith(categoryName) && !processedMeshes.has(child)) {
                            const options = {};
                            let optionCounter = 1;
                            let currentChild = child;
                            do {
                                options[`option${optionCounter++}`] = currentChild.name;
                                processedMeshes.add(currentChild); 
                                currentChild.visible = false;
                                currentChild = scene.children.find(nextChild => nextChild !== currentChild && nextChild.name.startsWith(categoryName) && !processedMeshes.has(nextChild));
                            } while (currentChild);
                            meshCategories[categoryName] = options;
                        }
                    });

                });
                //saveMeshCategoriesToFile(meshCategories, 'meshes');

                setMesh(scene, bodyParts);
            }

            function setMesh(scene, anObject, bool = true) {
                for (const category in anObject) {
                    if (anObject.hasOwnProperty(category)) {
                        const childName = anObject[category].name;

                        const child = scene.children.find(child => child.name === childName);

                        //console.log(child);

                        if (child) {
                                child.visible = bool; console.log(bool);
                                const locatedMesh = locateMeshToPhong(childName);
                                locatedMesh.material.color.set(anObject[category].color);
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




