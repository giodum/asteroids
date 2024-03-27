import * as THREE from 'three'

import random from 'canvas-sketch-util/random'

import Parameters from './Parameters'

export default class Particle {
  // materials and geometries are created once
  // and shared for all instances of the class
  static geometries = []
  static materials = []

  constructor(colors) {
    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init geometries and materials
    this.#initGeometriesAndMaterials()

    // init particles
    this.#initParticles()
  }

  #initGeometriesAndMaterials() {
    // initialize geometries
    if (Particle.geometries.length == 0) {
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
      Particle.geometries.push(cubeGeometry)

      const pyramidGeometry = new THREE.CylinderGeometry(0, 1, 2, 4, 1)
      Particle.geometries.push(pyramidGeometry)

      const tethraedronGeometry = new THREE.TetrahedronGeometry(1, 2)
      Particle.geometries.push(tethraedronGeometry)

      const plateGeometry = new THREE.BoxGeometry(1 / 6, 2)
      Particle.geometries.push(plateGeometry)
    }

    // initialize materials
    if (Particle.materials.length == 0) {
      this.parameters.colors.forEach((color) => {
        const material = new THREE.MeshPhongMaterial({
          color: color,
          flatShading: true,
          shininess: 0,
          specular: 0x000000,
        })
        Particle.materials.push(material)
      })
    }
  }

  #initParticles() {
    // pick random shape and material
    this.geometry = random.pick(Particle.geometries)
    this.material = random.pick(Particle.materials)

    // random scaling factor
    const sizeScaling = random.range(0.8, 1.2)

    // scale geometry
    this.geometry.scale.x *= sizeScaling
    this.geometry.scale.y *= sizeScaling
    this.geometry.scale.z *= sizeScaling

    // create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.receiveShadow = true
    this.mesh.castShadow = true
    this.mesh.userData.po = this

    // random rotation (0 - 180deg)
    this.mesh.rotation.x = random.range(0, 1) * Math.PI
    this.mesh.rotation.y = random.range(0, 1) * Math.PI

    // random position
    this.mesh.position.y = random.range(-2, 2)
  }
}
