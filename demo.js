/*
  Copyright 2017 Google Inc. All Rights Reserved.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

'use strict';

class Demo {
  static get CAMERA_SETTINGS () {
    return {
      viewAngle: 45,
      near: 0.1,
      far: 10000
    };
  }

  constructor () {
    console.log('demo');
    this._width;
    this._height;
    this._renderer;
    this._camera;
    this._aspect;
    this._settings;
    this._box;
    this._container = document.querySelector('#container');
    this._rotation = Math.PI;
    this._translation = 0;
    this._currentHeadPosition = '';
    this._offsetX = 0;
    this._offsetY = 0;
    this._centerX = 0.5;
    this._centerY = 0.5;

    this.clearContainer();
    this.createRenderer();

    this._onResize = this._onResize.bind(this);
    this._update = this._update.bind(this);
    this._onResize();

    this.createCamera();
    this.createScene();
    this.createMeshes();

    this._addEventListeners();
    requestAnimationFrame(this._update);
  }

  _update () {
    // this._camera.rotation.x += 0.01;
    if (this._kaleidas) {
      this._kaleidas[0].material.map.offset.x += 0.001;//positive
      this._kaleidas[1].material.map.offset.x += 0.001;//negative
      this._kaleidas[2].material.map.offset.x += 0.001;//positive
      this._kaleidas[12].material.map.offset.x += 0.001;//negative
    }

    this._render();
  }

  _shouldUpdate(headPosition) {
    if (headPosition) {
      if(headPosition.toString() !== this._currentHeadPosition) {
        this._rotation = Math.random() * 2 * Math.PI;
        this._translation = Math.random() * 2;
        this.updateTextures();
      }
      this._currentHeadPosition = headPosition.toString();
    }
  }

  updateTextures() {
    this._kaleidas[0].material.map.rotation = this._rotation * 0.5;
    this._kaleidas[1].material.map.rotation = - this._rotation * 0.5;
    this._kaleidas[2].material.map.rotation = this._rotation * 0.5;
    this._kaleidas[12].material.map.rotation = - this._rotation * 0.5;

    this._kaleidas[0].material.map.offset.set(this._translation, this._translation);
    this._kaleidas[1].material.map.offset.set(this._translation, this._translation);
    this._kaleidas[2].material.map.offset.set(this._translation, this._translation);
    this._kaleidas[12].material.map.offset.set(this._translation, this._translation);
  }

  _render () {
    // this._camera.position.z = 5;
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this._update);
  } 

  _onResize () {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._aspect = this._width / this._height;

    this._renderer.setSize(this._width, this._height);

    if (!this._camera) {
      return;
    }
    this._camera.aspect = this._aspect;
    this._camera.updateProjectionMatrix();
  }

  _addEventListeners () {
    window.addEventListener('resize', this._onResize);
  }

  clearContainer () {
    this._container.innerHTML = '';
  }

  createRenderer () {
    this._renderer = new THREE.WebGLRenderer();
    this._container.appendChild(this._renderer.domElement);
  }

  createCamera () {
    this._settings = Demo.CAMERA_SETTINGS;
    this._camera = new THREE.PerspectiveCamera(
        this._settings.viewAngle,
        this._aspect,
        this._settings.near,
        this._settings.far
    );
  }

  createScene () {
    this._scene = new THREE.Scene();
  }

  createTexture() {
    var self = this;
      var texture = new THREE.TextureLoader().load('me.jpg');
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.center.set(0.5, 0.5);
      // texture.offset.set(1.5, 1.5);
      texture.repeat.set(0.25, -0.25);
      texture.rotation = - this._rotation;
      var flippedTexture = new THREE.TextureLoader().load('me.jpg');
      flippedTexture.wrapS = THREE.RepeatWrapping;
      flippedTexture.wrapT = THREE.RepeatWrapping;
      flippedTexture.center.set(0.5, 0.5);
      // flippedTexture.offset.set(1.5, 1.5);
      flippedTexture.repeat.set(-0.25, -0.25);
      flippedTexture.rotation =  this._rotation;
      var texture2 = new THREE.TextureLoader().load('me.jpg');
      texture2.wrapS = THREE.RepeatWrapping;
      texture2.wrapT = THREE.RepeatWrapping;
      texture2.center.set(0.5, 0.5);
      // texture2.offset.set(1.5, 1.5);
      texture2.repeat.set(0.25, 0.25);
      texture2.rotation =  this._rotation;
      var flippedTexture2 = new THREE.TextureLoader().load('me.jpg');
      flippedTexture2.wrapS = THREE.RepeatWrapping;
      flippedTexture2.wrapT = THREE.RepeatWrapping;
      flippedTexture2.center.set(0.5, 0.5);
      // flippedTexture2.offset.set(1.5, 1.5);
      flippedTexture2.repeat.set(-0.25, 0.25);
      flippedTexture2.rotation = - this._rotation;
      var materialFlipped = new THREE.MeshBasicMaterial({
        map: flippedTexture,
        side: THREE.DoubleSide
      });
      var material = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      var materialFlipped2 = new THREE.MeshBasicMaterial({
        map: flippedTexture2,
        side: THREE.DoubleSide
      });
      var material2 = new THREE.MeshLambertMaterial({
        map: texture2,
        side: THREE.DoubleSide
      });
      material.needsUpdate = true;
      materialFlipped.needsUpdate = true;
      material2.needsUpdate = true;
      materialFlipped2.needsUpdate = true;
      self._kaleidas = [];
      var slicedValue = 0;
      var slicedVertical = 0;

      for (var j = 0; j <= 7; j += 1) {      
        for (var i = 0; i <= 15; i += 1) {
          var geometry = new THREE.SphereGeometry(1, 50, 50, slicedValue * Math.PI, 0.125 * Math.PI, slicedVertical * Math.PI, 0.125 * Math.PI);
          var kaleida = new THREE.Mesh(geometry, 
            j % 2 === 0 
              ? i % 2 === 0 ? material : materialFlipped
              : i % 2 === 0 ? material2 : materialFlipped2
            );      
          self._kaleidas[i * j] = kaleida;
          self._scene.add(kaleida);
          slicedValue += 0.125;
        }
        slicedVertical += 0.125;
      }
  }

  createMeshes () {     
    var light = new THREE.AmbientLight(0xffffff, 0.5);
    this._scene.add(light);
    var light1 = new THREE.PointLight(0xffffff, 0.5);
    this._scene.add(light1);
    this.createTexture();
  }
}
