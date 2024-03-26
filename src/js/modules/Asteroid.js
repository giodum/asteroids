import * as THREE from 'three'

import random from 'canvas-sketch-util/random'

export default class Asteroid {
  constructor(parameters, radius = 20, color = 'orange') {
    // init asteroid
    this.#initAsteroid(radius, color)

    // init particles
    this.#initParticles()
  }

  #initAsteroid(radius, color) {
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
      color: color,
      flatShading: true,
      shininess: 0,
      specular: 0x000000,
    })

    // create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  #initParticles() {
    this.ring = new THREE.Mesh()
    this.nParticles = 0
  }

  #updateParticlesCount() {
    // add particles
    if (this.nParticles < parameters.nParticles) {
      const p = new Particle()
    }
  }
}
