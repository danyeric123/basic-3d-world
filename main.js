import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

import Player from './player.js';

class BasicWorldGame {

  constructor(){
    this._Initialize();
    this._gameStarted = false;
  }

  /* 
  General Notes:
  For every Three.js app you need a scene and camera

  */
  _Initialize(){

    //This sets up the WebGLRenderer, which displays everything we are doing
    // set antialias so that it doesnt look jagged
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

    /*This sets up the camera for you to be able to move around 3D world
      fov stands for Field of View
      Perspective Camera is a kind of Camera
    */
    const fov = 60,
          aspect = window.innerWidth / window.innerHeight,
          near = 1.0,
          far = 1000.0
    this._camera = new THREE.PerspectiveCamera(fov,aspect,near,far)
    // Setting the camera's position based on X, Y,Z
    this._camera.position.set(100,30,0)

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

    /* For every object you place you need to think of shape and material */

    let sphere = new THREE.SphereGeometry(10,100,100),
        box = new THREE.BoxGeometry(10,10,20),
        cone = new THREE.ConeGeometry( 10, 20, 100 ),
        coin = new THREE.CylinderGeometry( 10, 10, 1, 32 )
    let material = new THREE.MeshLambertMaterial({color: 0xF7F7F7}),
        loaderTexture = new THREE.TextureLoader()
    // loaderTexture.load('../Textures/smoke.png', (texture)=>{
    //   let planeGeometry = new THREE.PlaneBufferGeometry(100,100),      
    //     smokeMaterial = new THREE.MeshStandardMaterial({
    //         map:texture,
    //         transparent: true
    //       })
    //       for(let p=80;p>20;p--) {
    //         let particle = new THREE.Mesh(planeGeometry,smokeMaterial);
    //         particle.position.set(
    //           0.5 * p * Math.cos((4 * p * Math.PI) / 180),
    //           0.5 * p * Math.sin((4 * p * Math.PI) / 180),
    //           0.1 * p
    //       );
    //       particle.rotation.z = Math.random() *360;
    //         this._scene.add(particle);
    //       }
    //     })
        
    

    this.mesh = new THREE.Mesh(coin, material)
    this.mesh2 = new THREE.Mesh(coin, material)

    
    this.mesh.position.set(-100,30,0)
    this.mesh2.position.set(100,50,0)
    this.mesh.rotation.set(300,0,10)
    this.mesh2.rotation.set(300,0,10)
    
    
    this._scene.add(this.mesh)
    this._scene.add(this.mesh2)
    // this._scene.add(box)
    
    console.log(this.mesh.geometry)

    

    // this.player = new Player({scene: this.scene_, world: this.world_})

    // this.gameOver_ = false;
    // this.previousRAF_ = null;
    this._RAF()

  }

  _OnWindowResize(){
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()
    this._threejs.setSize(window.innerWidth,window.innerHeight)
  }

  _RAF(){
    requestAnimationFrame((t)=>{
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }
      
      this.mesh.rotation.z +=0.1
      this.mesh2.rotation.z +=0.1

      this._RAF()

      this._threejs.render(this._scene,this._camera)
      // this.Step_((t - this.previousRAF_) / 1000.0);
      this.previousRAF_ = t
    }) 
  }

  // Step_(timeElapsed) {
  //   if (this.gameOver_ || !this._gameStarted) {
  //     return;
  //   }

  //   this.player_.Update(timeElapsed);
  //   this.world_.Update(timeElapsed);
  //   this.background_.Update(timeElapsed);

  //   if (this.player_.gameOver && !this.gameOver_) {
  //     this.gameOver_ = true;
  //     document.getElementById('game-over').classList.toggle('active');
  //   }
  // }

}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BasicWorldGame();
});
