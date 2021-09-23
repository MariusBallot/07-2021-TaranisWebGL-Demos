class MouseController {
  constructor() {
    this.bind()
    this.mouseSpeed = 0
    this.mousePos = {
      x: 0,
      y: 0
    }
    this.lastPos = {
      x: 0,
      y: 0
    }
  }

  onMove(e) {
    this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1

    this.mouseSpeed = Math.sqrt(Math.pow(e.clientX - this.lastPos.x, 2) + Math.pow(e.clientY - this.lastPos.y, 2))

    this.lastPos = {
      x: e.clientX,
      y: e.clientY
    }

    let thread
    clearTimeout(thread);
    thread = setTimeout(() => {
      this.mouseSpeed = 0
    }, 1000 / 60)
  }

  start() {
    document.addEventListener('mousemove', this.onMove)
  }

  stop() {
    document.removeEventListener('mousemove', this.onMove)

  }

  bind() {
    this.onMove = this.onMove.bind(this)
  }
}

const _instance = new MouseController()
export default _instance