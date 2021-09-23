import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import MouseController from "./MouseController"

class SinglePillardFloor {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader()
    this.texLoader = new THREE.TextureLoader()
    this.floorGroup = new THREE.Group()
    this.raycaster = new THREE.Raycaster()
    this.mouseVec = new THREE.Vector2()
    this.rayCastPoint = new THREE.Vector3()
    this.easedMouseSpeed = 0

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

  init(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.pillardSource
    const hexTex = this.texLoader.load('/assets/webGL/textures/hexPat.png')
    this.hexTopMat = new THREE.MeshBasicMaterial({
      map: hexTex,
      transparent: true
    })
    this.modelLoader.load('/assets/webGL/hexPillard2.glb', (glb) => {
      glb.scene.traverse(child => {
        if (child instanceof THREE.Group && child.name == "pillard") {
          this.pillardSource = child
        }
        if (child instanceof THREE.Mesh && child.name == "topHex") {
          this.pillardSource.add(child)
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
        c.children[2].material = this.hexTopMat.clone()

        c.rotateY(((Math.PI * 2) / 6) * Math.round(Math.random() * 6))
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
    console.log(this.floorGroup)

  }

  update() {

    this.easedMouseSpeed += (MouseController.mouseSpeed - this.easedMouseSpeed) * 0.1
    console.log(this.easedMouseSpeed)


    this.mouseVec.set(MouseController.mousePos.x, MouseController.mousePos.y)
    this.raycaster.setFromCamera(this.mouseVec, this.camera)

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    let j = 0
    while (j < intersects.length) {
      if (intersects[j].object.name == "topHex") {
        this.rayCastPoint.copy(intersects[j].point)
      }
      j++
    }


    let i = 0;
    while (i < this.floorGroup.children.length) {
      const cPos = new THREE.Vector3()
      this.floorGroup.children[i].getWorldPosition(cPos)
      const d = cPos.distanceTo(this.scene.position)
      this.floorGroup.children[i].scale.y = Math.sin(Date.now() * 0.002
        * this.params.animSpeed - d * .2 * this.params.animFrequency) * 2 + 2.5
      this.floorGroup.children[i].scale.y *= .7

      const mD = cPos.distanceTo(this.rayCastPoint)
      this.floorGroup.children[i].children[2].material.opacity = Math.sin(Date.now() * 0.001 - mD * .2) / 2 + 0.5
      this.floorGroup.children[i].children[2].material.opacity *= this.easedMouseSpeed * 0.1

      i++
    }
  }

  bind() {
    this.generateFloor = this.generateFloor.bind(this)
  }
}

const _instance = new SinglePillardFloor()
export default _instance