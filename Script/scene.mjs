"use strict";
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TCharacter } from './Character.mjs';


export function TinitialiseScene(anAvatar) {

    let scene, camera, renderer, modelMaterial, eyeMaterial, hairMaterial, skinMaterial;

    scene = new THREE.Scene();


    //---------------gradient Background & color -----------------------

    const hexValue = "ffffff";
    const colorOfCube = "#" + hexValue;

    const topColor = new THREE.Color(0xA8D1DF);
    const bottomColor = new THREE.Color(0x294A5E);
    const gradientTexture = new THREE.CanvasTexture(createGradientBackground(topColor, bottomColor));
    scene.background = gradientTexture;

    //----------------scene objects----------------------


    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    eyeMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    hairMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    skinMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', windowResized);

    //-----------------character-------------------------
    const character = new TCharacter(scene);    
    scene.add(character);

    //-------------functions-------------------------------

    function guiControls() {
        const gui = new dat.GUI();
        const colorChanger = { color: eyeMaterial.color.getHex() };

        gui.addColor(colorChanger, 'color').name('Eyecolor').onChange(function (color) {
            eyeMaterial.color.set(color);
            character.setIrisColor(color);
            // Set the color of the loaded model's material to the same color
            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });

        const hairChanger = { color: hairMaterial.color.getHex() };

        gui.addColor(hairChanger, 'color').name('Haircolor').onChange(function (color) {
            hairMaterial.color.set(color);
            character.setHairColor(color);
            // Set the color of the loaded model's material to the same color
            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });

        const skinChanger = { color: skinMaterial.color.getHex() };

        gui.addColor(skinChanger, 'color').name('Skincolor').onChange(function (color) {
            skinMaterial.color.set(color);
            character.setSkinColor(color);
            // Set the color of the loaded model's material to the same color
            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });
    }

    guiControls();
    

    function render() {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    }

    function windowResized() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function createGradientBackground(topColor, bottomColor) {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, topColor.getStyle());
        gradient.addColorStop(1, bottomColor.getStyle());

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    }
    render();
}