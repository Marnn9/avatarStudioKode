'use strict';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TCharacter } from "./characterClass.mjs";
import { TCharacterOptions } from "./characterOptions.js";

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
    camera.position.z = 4;
    //camera.position.y = -2

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
        hairMaterial = new THREE.MeshBasicMaterial({ color: `#${localHairColor}` });
        avatarFeatures.hairColor = localHairColor;
    } else {
        hairMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    }
    if (localEyeColor !== null) {
        eyeMaterial = new THREE.MeshBasicMaterial({ color: `#${localEyeColor}` });
        avatarFeatures.eyeColor = localEyeColor;
    } else {
        eyeMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    }
    if (localSkinColor !== null) {
        skinMaterial = new THREE.MeshBasicMaterial({ color: `#${localSkinColor}` });
        avatarFeatures.skinColor = localSkinColor;
    } else {
        skinMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    } if (localTopColor !== null) {
        topMaterial = new THREE.MeshBasicMaterial({ color: `#${localTopColor}` });
        avatarFeatures.skinColor = localSkinColor;
    } else {
        topMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    } if (localBottomColor !== null) {
        bottomMaterial = new THREE.MeshBasicMaterial({ color: `#${localTopColor}` });
        avatarFeatures.skinColor = localSkinColor;
    } else {
        bottomMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    }


    //-------------functions-------------------------------

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
