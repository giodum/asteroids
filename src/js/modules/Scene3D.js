import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import gsap from 'gsap'

import math from 'canvas-sketch-util/math'
import random from 'canvas-sketch-util/random'

import Asteroid from './Asteroid'
import Parameters from './Parameters'

const DEV_HELPERS = false
const DEV_WIREFRAMES = false

export default class Scene3D {
  // unique instance
  static item = null

  // screen variable
  #mouse = new THREE.Vector2(0, 0)
  #window = {
    aspectRatio: window.innerWidth / window.innerHeight,
    height: window.innerHeight,
    width: window.innerWidth,
  }

  constructor() {
    // check previous existance of the instance
    if (Scene3D.item) {
      throw new Error('Scene3D has already been initialized')
    }

    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init renderer and scene
    this.#initRendererAndScene()

    // init basic helpers
    this.#initBasicHelpers()

    // init camera
    this.#initCamera()

    // init orbit control
    this.#initOrbitControl()

    // init lights
    this.#initLights()

    // init asteroid
    this.asteroid = new Asteroid()
    this.asteroid.asteroidObject.rotation.z = Math.PI / 10
    this.scene.add(this.asteroid.asteroidObject)

    // add event listeners
    this.eventListeners()

    // animation loop
    this.animate()
  }

  #initRendererAndScene() {
    // init renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: document.querySelector('canvas'),
    })
    this.renderer.setSize(this.#window.width, this.#window.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.shadowMap = true

    // init scene
    this.scene = new THREE.Scene()
  }

  #initBasicHelpers() {
    if (DEV_HELPERS) {
      // axes helper
      const axesHelper = new THREE.AxesHelper(300)
      axesHelper.setColors()
      this.scene.add(axesHelper)

      // grid helper
      let gridHelper = new THREE.GridHelper(30, 30)
      this.scene.add(gridHelper)
    }
  }

  #initCamera() {
    // init camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.#window.aspectRatio,
      0.1,
      2000
    )
    this.camera.position.set(0, 40, 90)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))

    if (DEV_HELPERS) {
      const cameraHelper = new THREE.CameraHelper(this.camera)
      this.scene.add(cameraHelper)
    }
  }

  #initOrbitControl() {
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbit.update()
  }

  #initLights() {
    // ambient light
    this.ambientLight = new THREE.AmbientLight(0x663344, 2)
    this.scene.add(this.ambientLight)

    // directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    this.directionalLight.position.set(200, 100, 200)
    this.directionalLight.shadow.camera.left = -400
    this.directionalLight.shadow.camera.right = 400
    this.directionalLight.shadow.camera.top = 400
    this.directionalLight.shadow.camera.bottom = -400
    this.directionalLight.shadow.camera.near = 1
    this.directionalLight.shadow.camera.far = 1000
    this.directionalLight.shadow.camera.width = 2048
    this.directionalLight.shadow.camera.height = 2048
    this.scene.add(this.directionalLight)

    if (DEV_HELPERS) {
      const directionalLightHelper = new THREE.DirectionalLightHelper(
        this.directionalLight,
        10
      )
      this.scene.add(this.directionalLight)
    }
  }

  eventListeners() {
    // mouse mouve and mobile touch move
    window.addEventListener('mousemove', this.mouseMove.bind(this))
    window.addEventListener('touchmove', this.mouseMove.bind(this))

    // resize
    window.addEventListener('resize', this.resize.bind(this))
  }

  animate(time) {
    requestAnimationFrame((time) => this.animate(time))

    // update asteroid
    this.asteroid.update()

    // clear buffer and render the scene
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }

  mouseMove(event) {
    // interpolate mouse movement to make it smootjìh
    gsap.to(this.#mouse, {
      duration: 1,
      x:
        event.clientX ||
        event.pageX ||
        (event.touches ? event.touches[0].pageX : 0),
      y:
        event.clientY ||
        event.pageY ||
        (event.touches ? event.touches[0].pageY : 0),
      ease: 'power2.out',
    })
  }

  resize() {
    // update window info
    this.#window.aspectRatio = window.devicePixelRatio
    this.#window.height = window.height
    this.#window.width = window.width

    // update renderer
    this.renderer.setSize(this.#window.width, this.#window.height)
    this.camera.aspect = this.#window.aspectRatio
    this.camera.updateProjectionMatrix()
  }

  static init() {
    if (!Scene3D.item) {
      Scene3D.item = new Scene3D()
    }
  }
}
