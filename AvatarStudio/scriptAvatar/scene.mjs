'use strict';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TCharacter } from "./characterClass.mjs";

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
export const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 100);


function degreesToRadians(degrees) {
    const mathToMultiply = Math.PI / 180;
    const radians = degrees * mathToMultiply;
    return radians;
}

export function TinitialiseScene(cvsId) {

    let renderer;
    const scene = new THREE.Scene();

    const initialCvsId = 'sceneCanvas'

    //---------------gradient Background & color -----------------------
    const white = 0xffffff;
    scene.background = new THREE.Color(white);

    //----------------scene objects----------------------
    camera.position.z = 5;
    //-----------------lights------------------

    addLights();

    //--------------- renderer --------------------------
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.id = initialCvsId;
    renderer.domElement.setAttribute('alt', initialCvsId);
    document.body.appendChild(renderer.domElement);
    setConstantAspectRatio();

    // ------------------ move character -------------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minAzimuthAngle = degreesToRadians(-45) // 45 degrees left
    controls.maxAzimuthAngle = degreesToRadians(45) // 45 degrees right
    controls.minPolarAngle = degreesToRadians(90);//no upwards/downwards
    controls.maxPolarAngle = degreesToRadians(90);

    //-----------------character-------------------------
    character.rotateY(degreesToRadians(-90));
    scene.add(character);

    //----------------localStorage--------------------------------------

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

    function addLights() {
        const directionalLight = new THREE.DirectionalLight(white, 1);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true; // Enable shadow casting
        scene.add(directionalLight);

        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
    }

    render();

}