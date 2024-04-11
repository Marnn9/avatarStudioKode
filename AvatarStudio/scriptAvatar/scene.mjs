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
    cvsWidth: window.innerWidth,
    cvsHeight: window.innerHeight,
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
    
    //---------------gradient Background & color -----------------------

    let hexValue = "ffffff";
    const colorOfCube = "#" + hexValue;
    const white = 0xffffff;
    scene.background = new THREE.Color(white);

    //----------------scene objects----------------------

    camera = new THREE.PerspectiveCamera(80, 1, 0.1, 100);
    camera.position.z = 5;
    //camera.position.y = -2

    /*  const planeGeometry = new THREE.PlaneGeometry(20, 20); // Adjust the size as needed
     const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
     const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
     const planeFloor = new THREE.Mesh(planeGeometry, planeMaterial);
     planeFloor.rotateX(degreesToRadians(90));
     planeFloor.position.y = -5;
     planeMesh.receiveShadow = true;
     planeMesh.position.z = -8;
     scene.add(planeMesh, planeFloor); */
    //-----------------lights------------------

    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    //scene.add(ambientLight);


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = "sceneCanvas";
    renderer.domElement.setAttribute('alt', 'sceneCanvas');
    document.body.appendChild(renderer.domElement);
    setConstantAspectRatio();

    const directionalLight = new THREE.DirectionalLight(white, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true; // Enable shadow casting
    scene.add(directionalLight);

    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 1024; // Shadow map width
    directionalLight.shadow.mapSize.height = 1024; // Shadow map height
    directionalLight.shadow.camera.near = 0.5; // Near plane of the shadow camera
    directionalLight.shadow.camera.far = 50; // Far plane of the shadow camera

    var controls = new OrbitControls(camera, renderer.domElement);

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

    function setConstantAspectRatio() {
        const canvasWidth = scenePositions.cvsWidth;
        const canvasHeight = scenePositions.cvsHeight;

        renderer.setSize(canvasWidth, canvasHeight);
        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();
    }

    render();

}
