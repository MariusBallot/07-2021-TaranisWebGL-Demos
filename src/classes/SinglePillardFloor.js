import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

class SinglePillardFloor {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader()
    this.floorGroup = new THREE.Group()

    this.apothem = 0.866
    this.params = {
      inst: {
        x: 31,
        z: 21
      },
      animSpeed: 1,
      animFrequency: 1
    }

  }

  init(scene) {
    this.scene = scene
    this.pillardSource
    this.modelLoader.load('/assets/webGL/hexPillard.glb', (glb) => {
      glb.scene.traverse(child => {
        if (child instanceof THREE.Group && child.name == "pillard") {
          this.pillardSource = child
        }
        if (child instanceof THREE.Mesh && child.material.name == "matTop") {
          child.material = new THREE.MeshLambertMaterial({
            color: 0x151515
          })
          // child.material = new THREE.MeshLambertMaterial({
          //   wireframe: true
          // })
        }
        if (child instanceof THREE.Mesh && child.material.name == "matSide") {
          child.material = new THREE.MeshBasicMaterial({
            color: 0x00a1c4
          })
        }
      })
      this.generateFloor()
    })
  }

  generateFloor() {
    console.log(this.pillardSource)
    for (let x = 0; x < this.params.inst.x; x++) {
      for (let z = 0; z < this.params.inst.z; z++) {
        const c = this.pillardSource.clone()
        let xpos = (x - (this.params.inst.x / 2)) * this.apothem * 2 + this.apothem
        if (z % 2 == 1) {
          xpos += this.apothem
        }
        const zpos = (z - this.params.inst.z / 2) * 1.5 + 1
        c.position.set(xpos, 0, zpos)
        this.floorGroup.add(c)
      }
    }
    this.scene.add(this.floorGroup)

  }

  update() {
    let i = 0;
    while (i < this.floorGroup.children.length) {
      const cPos = new THREE.Vector3()
      this.floorGroup.children[i].getWorldPosition(cPos)
      const d = cPos.distanceTo(this.scene.position)
      this.floorGroup.children[i].scale.y = Math.sin(Date.now() * 0.002
        * this.params.animSpeed - d * .2 * this.params.animFrequency) * 2 + 2.5
      this.floorGroup.children[i].scale.y *= .7
      i++
    }
  }

  bind() {
    this.generateFloor = this.generateFloor.bind(this)
  }
}

const _instance = new SinglePillardFloor()
export default _instance