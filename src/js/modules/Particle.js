import * as THREE from 'three'

import random from 'canvas-sketch-util/random'

export default class Particle {
  constructor() {
    // init particles
    this.#initParticles()
  }

  #initParticles() {
    const randomShape = random.range(0, 1)
    const size = random.range(0.8, 1.2)

    if (randomShape < 0.25) {
      this.geometry = new THREE.BoxGeometry(size, size, size)
    } else if (randomShape < 0.5) {
      this.geometry = new THREE.CylinderGeometry(0, size, size * 2, 4, 1)
    } else if (randomShape < 0.75) {
      this.geometry = new THREE.TetrahedronGeometry(size, 2)
    } else {
      this.geometry = new THREE.BoxGeometry(size / 6, 2)
    }
  }
}
