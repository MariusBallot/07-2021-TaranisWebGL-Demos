import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/RAF'
import config from '../utils/config'
import MyGUI from '../utils/MyGUI'

import PaternFloor from "./PaternFloor"
import SinglePillardFloor from "./SinglePillardFloor"
import CamParallax from "./CamParallax"


class MainThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls
    }

    init(container) {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        container.appendChild(this.renderer.domElement)

        this.scene = new THREE.Scene()

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 50, 0)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = false
        this.controls.maxDistance = 1500
        this.controls.minDistance = 0

        CamParallax.init(this.camera)
        CamParallax.active = true


        MyGUI.hide()
        if (config.myGui)
            MyGUI.show()

        const ambLight = new THREE.AmbientLight(0xFFFFFF, .3)
        const pointLight = new THREE.PointLight({
            intensity: 1
        })
        pointLight.position.set(0, 5, 0)
        this.scene.add(ambLight, pointLight)



        // PaternFloor.init(this.scene)
        SinglePillardFloor.init(this.scene, this.camera)
        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        SinglePillardFloor.update()
        CamParallax.update()
        this.renderer.render(this.scene, this.camera);
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new MainThreeScene()
export default _instance