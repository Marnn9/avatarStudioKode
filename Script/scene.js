"use strict";
import * as THREE from '../three.js-master/src/Three.js';

let scene, camera, renderer;

const aspectRatio = (window.innerWidth / window.innerHeight);
console.log(aspectRatio);

export function TinitialiseScene(anAvatar) {
    scene = new THREE.Scene();

    /* const gridHelper = new THREE.GridHelper(10, 10); // Size of the grid, divisions
    gridHelper.position.set(0, -2.5, 0); // Position the grid appropriately
    scene.add(gridHelper);  */

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



    const geometry = new THREE.BoxGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.set(0, 0, 0);


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);


    function render() {
        requestAnimationFrame(render);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        anAvatar

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




