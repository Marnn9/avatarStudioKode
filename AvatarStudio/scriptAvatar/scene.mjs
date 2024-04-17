'use strict';
import * as THREE from 'three';
import * as dat from "dat.gui";
import { TCharacter } from "./characterClass.mjs";
import { TCharacterOptions } from "./characterOptions.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const avatarFeatures = {
    skinColor: null,
    hairColor: null,
    eyeColor: null,
    browType: null,
    loggedInUser: null,
}

export const scenePositions = {
    x: 0,
    y: 0,
    z: 0,
    cvsWidth: 300,
    cvsHeight: 500,
}

export const character = new TCharacter();

function degreesToRadians(degrees) {
    const mathToMultiply = Math.PI / 180;
    const radians = degrees * mathToMultiply;
    return radians;
}

export function TinitialiseScene(anAvatar) {


    let scene, camera, renderer, modelMaterial, eyeMaterial, hairMaterial, skinMaterial, topMaterial, bottomMaterial;
    scene = new THREE.Scene();

    const guiWidth = 300;
    let centerX = window.innerWidth / 2 - (guiWidth / 2);

    const guiPosition = { x: centerX, y: 10 };
    //---------------gradient Background & color -----------------------

    let hexValue = "ffffff";
    const colorOfCube = "#" + hexValue;
    const white = 0xffffff;
    scene.background = new THREE.Color(white);

    //----------------scene objects----------------------

    camera = new THREE.PerspectiveCamera(80, 1, 0.1, 100);
    camera.position.z = 2;

    //-----------------lights------------------
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = "sceneCanvas";
    renderer.domElement.setAttribute('alt', 'sceneCanvas');
    document.body.appendChild(renderer.domElement);
    setConstantSize();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true; // Enable shadow casting
    scene.add(directionalLight);

    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 1024; // Shadow map width
    directionalLight.shadow.mapSize.height = 1024; // Shadow map height
    directionalLight.shadow.camera.near = 0.5; // Near plane of the shadow camera
    directionalLight.shadow.camera.far = 50; // Far plane of the shadow camera




    renderer = new THREE.WebGLRenderer();
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = "sceneCanvas";
    renderer.domElement.setAttribute('alt', 'sceneCanvas');
    document.body.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);

    setConstantSize();

   



    //-----------------character-------------------------
    character.rotateY(degreesToRadians(-90));
    const characterOptions = new TCharacterOptions()
    scene.add(character, characterOptions);
    //----------------localStorage--------------------------------------
    const localHairColor = localStorage.getItem("haircolor");
    const localEyeColor = localStorage.getItem("eyecolor");
    const localSkinColor = localStorage.getItem("skincolor");
    const localTopColor = null;
    const localBottomColor = null;


    if (localHairColor !== null) {
        hairMaterial = new THREE.MeshPhongMaterial({ color: `#${localHairColor}` });
        avatarFeatures.hairColor = localHairColor;
    } else {
        hairMaterial = new THREE.MeshPhongMaterial({ color: colorOfCube });
    }
    if (localEyeColor !== null) {
        eyeMaterial = new THREE.MeshPhongMaterial({ color: `#${localEyeColor}` });
        avatarFeatures.eyeColor = localEyeColor;
    } else {
        eyeMaterial = new THREE.MeshPhongMaterial({ color: colorOfCube });
    }
    if (localSkinColor !== null) {
        skinMaterial = new THREE.MeshPhongMaterial({ color: `#${localSkinColor}` });
        avatarFeatures.skinColor = localSkinColor;
    } else {
        skinMaterial = new THREE.MeshPhongMaterial({ color: colorOfCube });
    } if (localTopColor !== null) {
        topMaterial = new THREE.MeshPhongMaterial({ color: `#${localTopColor}` });
        avatarFeatures.skinColor = localSkinColor;
    } else {
        topMaterial = new THREE.MeshPhongMaterial({ color: colorOfCube });
    } if (localBottomColor !== null) {
        bottomMaterial = new THREE.MeshPhongMaterial({ color: `#${localTopColor}` });
        avatarFeatures.skinColor = localSkinColor;
    } else {
        bottomMaterial = new THREE.MeshPhongMaterial({ color: colorOfCube });
    }


    //-------------functions-------------------------------

    function guiControls() {
        const gui = new dat.GUI();

        gui.domElement.style.position = 'absolute';
        gui.domElement.style.left = guiPosition.x + 'px';
        gui.domElement.style.top = guiPosition.y + 'px';

        const eyeChanger = { color: eyeMaterial.color.getHex() };

        gui.addColor(eyeChanger, 'color').name('Eyecolor').onChange(function (color) {

            eyeMaterial.color.set(color);
            character.setIrisColor(color);

            avatarFeatures.eyeColor = eyeMaterial.color.getHex().toString(16);

            if (modelMaterial) {
                modelMaterial.color.set(color);
            }

        });

        const hairChanger = { color: hairMaterial.color.getHex() };

        gui.addColor(hairChanger, 'color').name('Haircolor').onChange(function (color) {
            hairMaterial.color.set(color);
            character.setHairColor(color);

            avatarFeatures.hairColor = hairMaterial.color.getHex().toString(16);

            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });

        const skinChanger = { color: skinMaterial.color.getHex() };

        gui.addColor(skinChanger, 'color').name('Skincolor').onChange(function (color) {
            skinMaterial.color.set(color);
            character.setSkinColor(color);

            avatarFeatures.skinColor = skinMaterial.color.getHex().toString(16);

            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });

        const topColorChanger = { color: topMaterial.color.getHex() };

        gui.addColor(topColorChanger, 'color').name('topColor').onChange(function (color) {
            topMaterial.color.set(color);
            character.setTopColor(color);

            avatarFeatures.skinColor = topMaterial.color.getHex().toString(16);

            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });


        const bottomColorChanger = { color: bottomMaterial.color.getHex() };

        gui.addColor(topColorChanger, 'color').name('bottomColor').onChange(function (color) {
            bottomMaterial.color.set(color);
            character.setBottomColor(color);

            avatarFeatures.skinColor = bottomMaterial.color.getHex().toString(16);

            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });

    }

    guiControls();

    function render() {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    }

    function windowResized() {
        const newAspectRatio = window.innerWidth / window.innerHeight;

        if (newAspectRatio >= 300 / 500) { // Landscape aspect ratio
            const newWidth = 500 * newAspectRatio;
            const newHeight = 500;
            renderer.setSize(newWidth, newHeight);
        } else { // Portrait aspect ratio
            const newWidth = 300;
            const newHeight = 300 / newAspectRatio;
            renderer.setSize(newWidth, newHeight);
        }

        centerX = window.innerWidth / 2 - (guiWidth / 2);
        camera.aspect = newAspectRatio;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera); // Render scene again with updated size
    }

    function setConstantSize() {
        const canvasWidth = scenePositions.cvsWidth;
        const canvasHeight = scenePositions.cvsHeight;

        renderer.setSize(canvasWidth, canvasHeight);
        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();

        document.body.appendChild(renderer.domElement);
        renderer.render(scene, camera);
    }



    render();

}
