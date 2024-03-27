/**! Code inspired by Yakudoo - https://yakudoo.com/ - https://codepen.io/Yakudoo/ */

import '/src/scss/main.scss'

import Scene3D from './modules/Scene3D'
import Info from './modules/Info'

export default class Main {
  constructor() {
    this.init()
  }

  init() {
    Info.init()
    Scene3D.init()
  }
}

const main = new Main()
