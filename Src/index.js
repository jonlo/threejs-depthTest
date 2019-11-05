import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
    BlendShader
} from 'three/examples/jsm/shaders/BlendShader.js';

var container,
    camera,
    scene,
    renderer,
    selectedCube,
    controls,
    quad;

var composer;

var renderTarget,
    renderTarget2;
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

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var geometry2 = new THREE.BoxGeometry(1, 1, 1);
    var material2 = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube2 = new THREE.Mesh(geometry2, material2);
    cube2.position.set(0, 0, 2);
    scene.add(cube2);

    var geometry3 = new THREE.BoxGeometry(1, 1, 1);
    var material3 = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube3 = new THREE.Mesh(geometry3, material3);
    cube3.position.set(2, 0, 2);
    scene.add(cube3);

    var geometry4 = new THREE.BoxGeometry(1, 1, 1);
    var material4 = new THREE.MeshBasicMaterial({
        color: 0xf00600
    });
    selectedCube = new THREE.Mesh(geometry4, material4);
    selectedCube.position.set(2, 0, 0);
    scene.add(selectedCube);

    renderer.autoClear = false;

    window.addEventListener('resize', onWindowResize, false);

    composer = new EffectComposer(renderer);
    renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    });
    renderTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    });
    
    var effect = new ShaderPass(BlendShader);
    effect.uniforms['tDiffuse1'].value = renderTarget.texture;
    effect.uniforms['tDiffuse2'].value = renderTarget2.texture;

    composer.addPass(effect);
    composer.setSize(window.innerWidth, window.innerHeight);
   

};

function render() {
    selectedCube.renderOrder = 999;
    selectedCube.material.depthTest = false;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
 //   renderer.clear();
    selectedCube.renderOrder = 0;
    selectedCube.material.depthTest = true;
    renderer.setRenderTarget(renderTarget2);
    renderer.render(scene, camera);
    composer.render();
    renderer.clear();

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