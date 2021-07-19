import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import MyGui from '../utils/MyGUI'

class PaternFloor {
    constructor() {
        this.bind()
        this.loader = new GLTFLoader()
        this.apothem = 0.866
        this.params = {
            inst: {
                x: 31,
                z: 31
            },
            animSpeed: 1,
            animFrequency: 1
        }

        MyGui.add(this.params, 'animSpeed', 0.1, 5)
        MyGui.add(this.params, 'animFrequency', 0.1, 3)
    }

    init(scene) {
        this.scene = scene
        this.patern
        this.paternGroup = new THREE.Group()
        this.loader.load("assets/webGL/hexPatern3D.glb", (glb) => {
            glb.scene.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    this.patern = child
                    this.patern.material = new THREE.MeshNormalMaterial({ wireframe: false })
                }
            })
            this.onPaternLoaded()
            console.log(glb.scene)
        })
    }

    onPaternLoaded() {
        for (let i = 0; i < this.params.inst.x; i++) {
            for (let j = 0; j < this.params.inst.z; j++) {
                const c = this.patern.clone()
                const x = this.apothem * 3 * i
                let z = 1.5
                if ((i % 2) == 0)
                    z = 0

                z += j * 3
                c.position.set(x, 0, z);
                this.paternGroup.add(c)

            }
        }
        this.paternGroup.translateX(-this.params.inst.x * this.apothem * 1.5 + this.apothem)
        this.paternGroup.translateZ(-this.params.inst.z * 1.5 + 1)
        this.scene.add(this.paternGroup)
    }

    update() {
        let i = 0;
        while (i < this.paternGroup.children.length) {
            let cPos = new THREE.Vector3()
            this.paternGroup.children[i].getWorldPosition(cPos)
            const d = cPos.distanceTo(this.scene.position)
            this.paternGroup.children[i].scale.y = Math.sin(Date.now() * 0.002
                * this.params.animSpeed - d * .2 * this.params.animFrequency) + 1.5
            this.paternGroup.children[i].scale.y *= .7
            i++
        }

    }

    bind() {

    }
}

const _instance = new PaternFloor()
export default _instance