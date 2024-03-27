import * as THREE from 'three'

import random from 'canvas-sketch-util/random'

import Parameters from './Parameters'
import Particle from './Particle'
import math from 'canvas-sketch-util/math'

export default class Asteroid {
  constructor(radius = 20) {
    // get reference to parameters
    this.parameters = Parameters.getInstance()

    // init asteroid
    this.#initAsteroid(radius)
  }

  #initAsteroid(radius) {
    // create core geometry
    this.coreGeometry = new THREE.TetrahedronGeometry(radius, 2)

    // randomize a little bit the geometry
    for (
      let i = 0;
      i < this.coreGeometry.attributes.position.array.length;
      i += 3
    ) {
      // get initial (x, y, z) values
      const x = this.coreGeometry.attributes.position.array[i]
      const y = this.coreGeometry.attributes.position.array[i + 1]
      const z = this.coreGeometry.attributes.position.array[i + 2]

      // get perlin noise value
      const perlin = random.noise3D(
        isFinite(x) ? x * 0.1 : 0,
        isFinite(y) ? y * 0.1 : 0,
        isFinite(z) ? z * 0.1 : 0
      )

      // update cohordinates
      this.coreGeometry.attributes.position.array[i] += perlin * radius * 0.25
      this.coreGeometry.attributes.position.array[i + 1] +=
        perlin * radius * 0.25
      this.coreGeometry.attributes.position.array[i + 2] +=
        perlin * radius * 0.25
    }

    // create core material
    this.coreMaterial = new THREE.MeshPhongMaterial({
      color: random.pick(this.parameters.colors),
      flatShading: true,
      shininess: 0,
      specular: 0x000000,
    })

    // create core mesh
    this.core = new THREE.Mesh(this.coreGeometry, this.coreMaterial)
    this.core.castShadow = true
    this.core.receiveShadow = true

    // create ring of particles
    this.#initParticles()
    this.updateParticlesCount()

    // create unique mesh for planet and ring
    this.asteroidObject = new THREE.Group()
    this.asteroidObject.add(this.core)
    this.asteroidObject.add(this.ring)

    // update particles rotation
    this.#updateParticlesMovement()
  }

  #initParticles() {
    this.ring = new THREE.Mesh()
    this.nParticles = 0
  }

  #updateParticlesMovement() {
    for (let i = 0; i < this.nParticles; i++) {
      // console.log('updating')

      // get the current particle
      const particleMesh = this.ring.children[i]

      // increase rotation angle based on its angular speed
      particleMesh.userData.angle += particleMesh.userData.angularSpeed

      // compute the new position of the particle (revolution movement)
      // polar to cartesian coordinates
      const x =
        Math.cos(particleMesh.userData.angle) * particleMesh.userData.distance
      const z =
        Math.sin(particleMesh.userData.angle) * particleMesh.userData.distance
      particleMesh.position.x = x
      particleMesh.position.z = z

      // add rotation on proper axis
      particleMesh.rotation.x += random.range(0, 0.05)
      particleMesh.rotation.y += random.range(0, 0.05)
      particleMesh.rotation.z += random.range(0, 0.05)
    }
  }

  #updateCoreMovement() {
    // update rotation on proper axis
    this.core.rotation.y -= this.parameters.params.coreRotation
  }

  updateParticlesCount() {
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
    this.nParticles = this.parameters.params.nParticles

    // in order to distribute particles
    // we compute the angle step
    this.particlesAngleStep = (Math.PI * 2) / this.nParticles

    // update particles definition
    this.updateParticlesDefinition()
  }

  updateParticlesDefinition() {
    for (let i = 0; i < this.nParticles; i++) {
      const particleMesh = this.ring.children[i]

      // scaling meshes randomly in the params range
      const size =
        this.parameters.params.minSize +
        (this.parameters.params.maxSize - this.parameters.params.minSize) *
          random.range(0, 1)
      particleMesh.scale.set(size, size, size)

      // set a random distance inside the params range
      particleMesh.userData.distance =
        this.parameters.params.minRadius +
        (this.parameters.params.maxRadius - this.parameters.params.minRadius) *
          random.range(0, 1)

      // set angle
      particleMesh.userData.angle = this.particlesAngleStep * i

      // set speed proportional to distance
      particleMesh.userData.angularSpeed = math.mapRange(
        particleMesh.userData.distance,
        this.parameters.params.minRadius,
        this.parameters.params.maxRadius,
        this.parameters.params.minSpeed,
        this.parameters.params.maxSpeed
      )
    }
  }

  update() {
    this.#updateCoreMovement()
    this.#updateParticlesMovement()
  }
}
