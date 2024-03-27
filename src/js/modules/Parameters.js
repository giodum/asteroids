import {GUI} from 'dat.gui'

// singleton pattern
export default class Parameters {
  static #colors = [0x8fc999, 0x5fc4d0, 0xee5624, 0xfaff70]

  static #params = {
    minRadius: 30,
    maxRadius: 50,
    minSpeed: 0.015,
    maxSpeed: 0.025,
    nParticles: 300,
    minSize: 0.1,
    maxSize: 2,
  }

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
}
