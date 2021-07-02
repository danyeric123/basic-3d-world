import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

class BasicWorldGame {

  constructor(){
    this._Initialize();
  }

  _Initialize(){

    //This sets up the WebGLRenderer, which displays everything we are doing
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    })

    // Shadows
    this._threejs.shadowMap.enabled = true
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap
    this._threejs.setPixelRatio(window.devicePixelRatio)
    this._threejs.setSize(window.innerWidth,window.innerHeight)

    document.body.appendChild(this._threejs.domElement)

    window.addEventListener('resize', ()=>{
      this._OnWindowResize()
    }, false)

    // This sets up the camera for you to be able to move around 3D world
    const fov = 60,
          aspect = 1920 / 1080,
          near = 1.0,
          far = 1000.0
    this._camera = new THREE.PerspectiveCamera(fov,aspect,near,far)
    this._camera.position.set(75,20,0)

    // Scenes create the container for all the objects in our 3D world
    this._scene = new THREE.Scene()

    // Add some lighting and adding it to the scence
    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
    light.position.set(20,100,10)
    light.target.position.set(0,0,0)
    light.castShadow = true
    light.shadow.bias = -0.001
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light)

    //Ambient Light added here to the scene
    light = new THREE.AmbientLight(0x101010)
    this._scene.add(light)

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement
    )
    controls.target.set(0,20,0)
    controls.update()

    // Load the Cube Map, which maps what will be in each direction
    const loader = new THREE.CubeTextureLoader(),
          texture = loader.load([
            '../cube-imgs/trance_px.jpg', // front
            '../cube-imgs/trance_nx.jpg', // back
            '../cube-imgs/trance_pz.jpg', // up
            '../cube-imgs/trance_nz.jpg',// down
            '../cube-imgs/trance_ny.jpg' , // left
            '../cube-imgs/trance_py.jpg' // right
          ])
    this._scene.background = texture

    this._RAF()

  }

  _OnWindowResize(){
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()
    this._threejs.setSize(window.innerWidth,window.innerHeight)
  }

  _RAF(){
    requestAnimationFrame(()=>{
      this._threejs.render(this._scene,this._camera)
      this._RAF()
    }) 
  }

}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BasicWorldGame();
});