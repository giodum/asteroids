import * as THREE from 'three'

import random from 'canvas-sketch-util/random'

import Parameters from './Parameters'
import Particle from './Particle'

export default class Asteroid {
  constructor(radius = 20) {
    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init asteroid
    this.#initAsteroid(radius)

    // init particles
    this.#initParticles()
  }

  #initAsteroid(radius) {
    // create geometry
    this.geometry = new THREE.TetrahedronGeometry(radius, 2)

    // randomize a little bit the geometry
    for (
      let i = 0;
      i < this.geometry.attributes.position.array.length;
      i += 3
    ) {
      // get initial (x, y, z) values
      const x = this.geometry.attributes.position.array[i]
      const y = this.geometry.attributes.position.array[i + 1]
      const z = this.geometry.attributes.position.array[i + 2]

      // get perlin noise value
      const perlin = random.noise3D(
        isFinite(x) ? x * 0.1 : 0,
        isFinite(y) ? y * 0.1 : 0,
        isFinite(z) ? z * 0.1 : 0
      )

      // update cohordinates
      this.geometry.attributes.position.array[i] += perlin * radius * 0.25
      this.geometry.attributes.position.array[i + 1] += perlin * radius * 0.25
      this.geometry.attributes.position.array[i + 2] += perlin * radius * 0.25
    }

    // create material
    this.material = new THREE.MeshPhongMaterial({
      color: random.pick(this.parameters.colors),
      flatShading: true,
      shininess: 0,
      specular: 0x000000,
    })

    // create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // create ring of particles
    this.#initParticles()
    this.#updateParticlesCount()
  }

  #initParticles() {
    this.ring = new THREE.Mesh()
    this.nParticles = 0
  }

  #updateParticlesCount() {
    // check the current number of particles
    // compared with the one defined by params
    if (this.nParticles < this.parameters.params.nParticles) {
      // add particles
      for (
        let i = this.nParticles;
        i < this.parameters.params.nParticles;
        i++
      ) {
        const p = new Particle()
        this.ring.add(p.mesh)
      }
    } else {
      // remove particles
      while (this.nParticles > this.parameters.params.nParticles) {
        const pMesh = this.ring.children[this.nParticles - 1]
        this.ring.remove(pMesh)
        pMesh.userData.po = null
        this.nParticles--
      }
    }

    // update particles count
    this.nParticles = this.parameters.params.particles

    // in order to distribute particles
    // we compute the angle step
    this.particlesAngleStep = (Math.PI * 2) / this.nParticles

    // update particles definition
    this.#updateParticlesDefinition()
  }

  #updateParticlesDefinition() {}
}
