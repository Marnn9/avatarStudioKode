"use strict"
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const bodyParts = {
    iris: {name: 'eye_left', child: 2},
    hair: {name :'hair_joined'},
    ears: {name: 'EARS', },
    head: {name: 'BSurfaceMesh002'},
    lowerBody: null,
    leg: null,
}

export class TCharacter extends THREE.Object3D {
    
    constructor() {
        super(); //class constructor

        const degrees = 0;
        const rotation = degrees * (Math.PI/180);
        const loader = new GLTFLoader();

        loader.load("../media/Boy-smaller-file.gltf", (gltfModel) => {

            gltfModel.scene.position.set(0, 0, 0); //sets the model in the center of the scene
            this.add(gltfModel.scene); //places the model in the scene

            //-----------------------------------------------------------------------------------------------------------

            function locateMesh (aBodyPart){
                const material = gltfModel.scene.children.find(child => child.name === aBodyPart)
                return material;
            }

            //const eyeMaterial = locateMesh(bodyParts.iris.name).material;


            const eyeMaterial = gltfModel.scene.children.find(child => child.name === bodyParts.iris.name);
            const hairMaterial = gltfModel.scene.children.find(child => child.name === bodyParts.hair.name);
            const earMaterial =gltfModel.scene.children.find(child => child.name === bodyParts.ears.name);
            const skinMaterial =gltfModel.scene.children.find(child => child.name === bodyParts.head.name);

            gltfModel.scene.rotation.y = rotation;
            console.log(gltfModel.scene);

            this.setIrisColor = function (aColor) {
                eyeMaterial.children[bodyParts.iris.child].material.color.set(aColor); 
            };

            this.setHairColor = function (aColor) {
                hairMaterial.material.color.set(aColor); 
            };

            this.setSkinColor = function (aColor){
                skinMaterial.material.color.set(aColor);
                earMaterial.material.color.set(aColor);
            }

            //-----------------------------------------------------------------------------------------------------------

            const lights = gltfModel.scene.children.filter(child => child.isLight);
            // Set the intensity of each light
            lights.forEach(light => {
               
                light.intensity = 1;
            });
        });
    }
}