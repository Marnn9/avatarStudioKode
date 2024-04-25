'use strict';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TCharacter } from "./characterClass.mjs";
import { toneMapping } from 'three/examples/jsm/nodes/Nodes.js';

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
export const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 100);


export function TinitialiseScene() {

    let renderer;
    const scene = new THREE.Scene();
    //---------------gradient Background & color -----------------------

    const white = 0xffffff;
    scene.background = new THREE.Color(white);

    //----------------scene objects----------------------
    camera.position.z = 5;
    //-----------------lights------------------
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = 'sceneCanvas';
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
    controls.minAzimuthAngle = degreesToRadians(-45) // 45 degrees left
    controls.maxAzimuthAngle = degreesToRadians(45) // 45 degrees right
    controls.minPolarAngle = degreesToRadians(90);//no upwards/downwards
    controls.maxPolarAngle = degreesToRadians(90);
    //-----------------character-------------------------
    character.rotateY(degreesToRadians(-90));
    scene.add(character);
    //----------------localStorage--------------------------------------


    //-------------functions-------------------------------

    this.saveImg = function(cvsId) {
        const canvas = document.getElementById(cvsId);
    
        if (!canvas) {
            console.error(`Canvas with ID ${cvsId} not found.`);
            return;
        }
        const imgRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        imgRenderer.shadowMap.enabled = true;
        imgRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
        const width = canvas.width;
        const height = canvas.height;
        imgRenderer.setSize(width, height);
        imgRenderer.setViewport(0, 0, width, height);
        
        const tempCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        tempCamera.position.z = 5;
        tempCamera.position.y = -0.5;
        imgRenderer.render(scene, tempCamera);

        const imageDataUrl = canvas.toDataURL('image/png'); //add this to the server 
        const downloadLink = document.createElement('a');
        downloadLink.href = imageDataUrl;
        downloadLink.download = 'rendered_image.png';
        downloadLink.click();
    };
    
    this.render = function () {
        requestAnimationFrame(this.render.bind(this));
        controls.update();
        renderer.render(scene, camera);
    };

    function setConstantAspectRatio() {
        const canvasWidth = scenePositions.cvsWidth;
        const canvasHeight = scenePositions.cvsHeight;

        renderer.setSize(canvasWidth, canvasHeight);
        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();
    }

    //this.render();

}