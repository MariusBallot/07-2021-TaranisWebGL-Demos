import MouseController from "./MouseController"

class CamParallax {
  constructor() {
    this.bind()
    this.active = true
    this.params = {
      intensity: 2,
      ease: 0.08,

    }
  }

  init(camera) {
    this.camera = camera
    this.initZ = this.camera.position.z
  }

  update() {
    if (!this.active)
      return

    this.camera.position.x += (MouseController.mousePos.x * this.params.intensity - this.camera.position.x) * this.params.ease
    this.camera.position.z += (MouseController.mousePos.y * this.params.intensity - this.camera.position.z) * this.params.ease
    // this.camera.position.z += (this.initZ - this.camera.position.z) * this.params.ease
    // this.camera.lookAt(0, 0, 0);
  }

  bind() {
  }
}

const _instance = new CamParallax()
export default _instance
