/**
 * @author jon + ibon 
 */

import {
    LinearFilter,
            NearestFilter,
            RGBAFormat,
            ShaderMaterial,
            UniformsUtils,
            WebGLRenderTarget
            , Mesh
            } from "three";
    import { Pass } from "three/examples/jsm//postprocessing/Pass.js";
    import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js';
    
    var BlendPass = function (scene, camera) {
        Pass.call(this);
        this.scene = scene;
        this.camera = camera;
        this.selectedElem = null;
        this.topRenderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: LinearFilter,
            magFilter: NearestFilter,
            format: RGBAFormat
        });
        this.bottomRenderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: LinearFilter,
            magFilter: NearestFilter,
            format: RGBAFormat
        });
    
        //Blend material
        if (BlendShader === undefined)
            console.error("Blendpass relies on blendshader");
    
        var blendshader = BlendShader;
        this.uniforms = UniformsUtils.clone(blendshader.uniforms);
        this.uniforms['tDiffuse1'].value = this.topRenderTarget.texture;
        this.uniforms['tDiffuse2'].value = this.bottomRenderTarget.texture;
    
        this.materialBlend = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: blendshader.vertexShader,
            fragmentShader: blendshader.fragmentShader
        });
    
        this.fsQuad = new Pass.FullScreenQuad(this.material);
    
    };
    
    BlendPass.prototype = Object.assign(Object.create(Pass.prototype), {
    
        constructor: BlendPass,
    
        render: function (renderer, writeBuffer) {
            if (!this.selectedElem) {
                return;
            }
            this.fsQuad.material = this.materialBlend;
            this.selectedElem.traverse((child) => {
                if (child instanceof Mesh) {
                    child.renderOrder = 999;
                    child.material.depthTest = false;
                }
            });
    
            renderer.setRenderTarget(this.topRenderTarget);
            if (!renderer.autoClear) {
                renderer.clear();
            }
            renderer.render(this.scene, this.camera);
            renderer.setRenderTarget(null);
            this.selectedElem.traverse((child) => {
                if (child instanceof Mesh) {
                    child.renderOrder = 0;
                    child.material.depthTest = true;
                }
            });
            renderer.setRenderTarget(this.bottomRenderTarget);
            if (!renderer.autoClear) {
                renderer.clear();
            }
            renderer.render(this.scene, this.camera);
            renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
            this.fsQuad.render(renderer);
        }
    
    });
    
    
    export {
    BlendPass
            };