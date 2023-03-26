import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'
import '@babylonjs/loaders/glTF'
import * as BABYLON from '@babylonjs/core'

import { Simulation }  from './view/simulation'

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        const canvas = document.createElement('canvas')
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.id = 'gameCanvas'
        document.body.appendChild(canvas)

        // initialize babylon scene and engine
        const engine = new BABYLON.Engine(canvas, true)
        const scene = new BABYLON.Scene(engine)

        const camera = new BABYLON.ArcRotateCamera('camera1',  0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene)
        camera.setPosition(new BABYLON.Vector3(-12, 25, -84))
        camera.attachControl(canvas, true)

        new BABYLON.AxesViewer(scene, 30) //tmp

        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 0.5, 0), scene)

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