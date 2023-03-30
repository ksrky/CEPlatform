import { Scene } from '@babylonjs/core/scene'
import { Engine } from '@babylonjs/core/Engines/engine'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import '@babylonjs/core/Debug/debugLayer'

import { Simulation }  from './simulation'

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        const canvas = document.createElement('canvas')
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.id = 'gameCanvas'
        document.body.appendChild(canvas)

        // initialize babylon scene and engine
        const engine = new  Engine(canvas, true)
        const scene = new  Scene(engine)

        const camera = new ArcRotateCamera('camera1',  0, 0, 0, new Vector3(0, 0, 0), scene)
        camera.setPosition(new Vector3(-12, 25, -84))
        camera.attachControl(canvas, true)

        // 3D Axis for debugging
        // new AxesViewer(scene, 30)

        new HemisphericLight('light1', new Vector3(1, 0.5, 0), scene)

        // simulation
        new Simulation(scene)

        // hide/show the Inspector
        window.addEventListener('keydown', (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide()
                } else {
                    scene.debugLayer.show()
                }
            }
        })


        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render()
        })
    }
}
new App()