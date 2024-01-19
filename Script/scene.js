"use strict";
import * as THREE from '../three.js-master/src/Three.js';
import * as dat from "../three.js-master/build/dat.gui.module.js";
import { GLTFLoader } from "../three.js-master/build/GLTFLoader.js";


export function TinitialiseScene() {
    let scene, camera, renderer, cubeMaterial, cube, model, modelMaterial;

    scene = new THREE.Scene();
    const hexValue = "ffffff";
    const colorOfCube = "#" + hexValue;

    const topColor = new THREE.Color(0xA8D1DF);
    const bottomColor = new THREE.Color(0x294A5E);
    const gradientTexture = new THREE.CanvasTexture(createGradientTexture(topColor, bottomColor));
    scene.background = gradientTexture;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', windowResized);

    cubeMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1), cubeMaterial);
    scene.add(cube);
    cube.position.set(0, 0, 0);

    addControls();

    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    function addControls() {
        const gui = new dat.GUI();
        const colorChanger = { color: cubeMaterial.color.getHex() };
    
        gui.addColor(colorChanger, 'color').onChange(function (color) {
            cubeMaterial.color.set(color);
            // Set the color of the loaded model's material to the same color
            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });
    }

    //for the test eye : ../media/eye_test.gltf
    function load3Dmodel() {
        const loader = new GLTFLoader();
        loader.load("../media/blueEyes.gltf", function (gltfModel) {
            // Remove the default cube from the scene
            scene.remove(cube);

            // Access the material of a specific part of the model 
            modelMaterial = gltfModel.scene.children[0].material;

            // Position and add the loaded model to the scene
            gltfModel.scene.position.set(0, 0, 0);
            gltfModel.scene.rotation.y = - Math.PI / 2;
            scene.add(gltfModel.scene);

            // Render the scene after loading the model
            render();
        });
    }
    load3Dmodel();

    function render() {
        requestAnimationFrame(render);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    function windowResized() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function createGradientTexture(topColor, bottomColor) {
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
