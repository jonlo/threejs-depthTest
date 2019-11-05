import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {BlendPass} from './BlendPass.js';

var container,
    camera,
    scene,
    renderer,
    selectedCube,
    controls,
    composer;

'use strict';

main();

function main() {
    initScene();
}

function initScene() {

    // dom
    container = document.createElement('div');
    document.body.appendChild(container);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10, 10, 15);
    //controls
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();
    const light = new THREE.DirectionalLight(0xffffff, 1, 100);
    scene.add(light);

    var cubes = [];
    const levels = 3;
    for (let indexX = 0; indexX < levels; indexX++) {
        for (let indexY = 0; indexY < levels; indexY++) {
            for (let indexZ = 0; indexZ < levels; indexZ++) {
                var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                var material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00
                });
                var cube = new THREE.Mesh(geometry, material);
                cube.position.set(indexX + 3, indexY + 3, indexZ + 3);
                cubes.push(cube);
                scene.add(cube);
            }
        }
    }

    selectedCube = cubes[10];
    selectedCube.material.color.set(0xff0000);
    window.addEventListener('resize', onWindowResize, false);
    composer = new EffectComposer(renderer);

    var effect = new BlendPass(scene,camera);
    effect.selectedElem = selectedCube;
    composer.addPass(effect);
    composer.setSize(window.innerWidth, window.innerHeight);

};

function render() {
    composer.render();
}
// animate            
(function animate() {
    requestAnimationFrame(animate);
    controls.update()
    render();

}());

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}