import {GUI} from 'dat.gui'

import random from 'canvas-sketch-util/random'

import palettes from 'nice-color-palettes'

// singleton pattern
export default class Parameters {
  // static #colors = [0x8fc999, 0x5fc4d0, 0xee5624, 0xfaff70]
  static #colors = random.shuffle(random.pick(palettes))

  static #params = {
    minRadius: 30,
    maxRadius: 50,
    minSpeed: 0.01,
    maxSpeed: 0.02,
    nParticles: 200,
    minSize: 0.3,
    maxSize: 1.7,
    coreRotation: 0.005,
  }

  constructor() {}

  static getInstance() {
    // if never initialized
    // initialize a new instance
    if (!Parameters.instance) {
      Parameters.instance = new Parameters()
    }

    // return the instance
    return Parameters.instance
  }

  // public getter for params
  get params() {
    return Parameters.#params
  }

  // public getter for colors
  get colors() {
    return Parameters.#colors
  }

  popColor() {
    return Parameters.#colors.pop()
  }

  // setter object for callback functions
  setObject(object) {
    this.object = object
  }

  // initialize GUI
  // to be run after setting object
  initGui() {
    if (!this.object) {
      throw new Error('Object for callbacks has not been passed')
    }

    // init new dat.GUI
    this.gui = new GUI()

    // set GUI width
    this.gui.width = 350
    this.gui.closed = true

    // add parameters to guid
    this.gui
      .add(Parameters.#params, 'minRadius')
      .min(20)
      .max(60)
      .step(1)
      .name('Ring inner radius')
      .onChange(() => {
        this.object.updateParticlesDefinition()
      })

    this.gui
      .add(Parameters.#params, 'maxRadius')
      .min(40)
      .max(100)
      .step(1)
      .name('Ring outer radius')
      .onChange(() => {
        this.object.updateParticlesDefinition()
      })

    this.gui
      .add(Parameters.#params, 'nParticles')
      .min(50)
      .max(800)
      .step(1)
      .name('N. of Particles')
      .onChange(() => {
        this.object.updateParticlesCount()
      })

    this.gui
      .add(Parameters.#params, 'minSpeed')
      .min(0.005)
      .max(0.05)
      .step(0.001)
      .name('Rotation min speed')
      .onChange(() => {
        this.object.updateParticlesDefinition()
      })

    this.gui
      .add(Parameters.#params, 'maxSpeed')
      .min(0.005)
      .max(0.05)
      .step(0.001)
      .name('Rotation max speed')
      .onChange(() => {
        this.object.updateParticlesDefinition()
      })

    this.gui
      .add(Parameters.#params, 'minSize')
      .min(0.1)
      .max(5)
      .step(0.1)
      .name('Particles min size')
      .onChange(() => {
        this.object.updateParticlesDefinition()
      })

    this.gui
      .add(Parameters.#params, 'maxSize')
      .min(0.1)
      .max(5)
      .step(0.1)
      .name('Particles max size')
      .onChange(() => {
        this.object.updateParticlesDefinition()
      })

    this.gui
      .add(Parameters.#params, 'coreRotation')
      .min(-0.05)
      .max(0.05)
      .step(0.001)
      .name('Core rotation speed')
  }
}
