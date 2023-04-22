// Core imports
import { Scene } from '@babylonjs/core/scene'
import { Engine } from '@babylonjs/core/Engines/engine'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Color4, Vector3 } from '@babylonjs/core/Maths/math'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import '@babylonjs/core/Loading/loadingScreen'

// GUI imports
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'
import { Button } from '@babylonjs/gui/2D/controls/button'
import { Control } from '@babylonjs/gui/2D/controls/control'

// Debug imports
import '@babylonjs/core/Debug/debugLayer'

// Local imports
import { Simulation } from './simulation'
import { HUD } from './ui'

enum State {
    START = 0,
    GAME = 1,
}

class App {
    private _canvas: HTMLCanvasElement
    private _engine: Engine
    private _scene: Scene

    private _ui: HUD

    private _state: number = 0
    private _gamescene: Scene

    private _simulation: Simulation

    constructor() {
        // create the canvas html element and attach it to the webpage
        this._canvas = this._createCanvas()

        // initialize babylon scene and engine
        this._engine = new Engine(this._canvas, true)
        this._scene = new Scene(this._engine)

        // hide/show the Inspector
        window.addEventListener('keydown', (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide()
                } else {
                    this._scene.debugLayer.show()
                }
            }
        })

        // run the main render loop
        this._main()
    }

    private _createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas')
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.id = 'gameCanvas'
        document.body.appendChild(canvas)

        return canvas
    }

    private async _main(): Promise<void> {
        await this._gotoStart()

        this._engine.runRenderLoop(() => {
            switch (this._state) {
                case State.START:
                    this._scene.render()
                case State.GAME:
                    this._scene.render()
                default:
                    break
            }
        })

        window.addEventListener('resize', () => {
            this._engine.resize()
        })
    }

    private async _gotoStart() {
        this._engine.displayLoadingUI()

        this._scene.detachControl()
        const scene = new Scene(this._engine)
        scene.clearColor = new Color4(0, 0, 0, 1)
        const camera = new FreeCamera('camera1', new Vector3(0, 0, 0), scene)
        camera.setTarget(Vector3.Zero())

        // create a fullscreen ui for all of our GUI elements
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('UI')
        guiMenu.idealHeight = 720 // fit our fullscreen ui to this height

        // create a simple button
        const startBtn = Button.CreateSimpleButton('start', 'PLAY')
        startBtn.width = 0.2
        startBtn.height = '40px'
        startBtn.color = 'white'
        startBtn.top = '-14px'
        startBtn.thickness = 0
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
        guiMenu.addControl(startBtn)

        // this handles interactions with the start button attached to the scene
        startBtn.onPointerDownObservable.add(() => {
            this._goToGame()
            scene.detachControl() // observables disabled
        })

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync()
        this._engine.hideLoadingUI()
        // lastly set the current state to the start state and set the scene to the start scene
        this._scene.dispose()
        this._scene = scene
        this._state = State.START

        let finishedLoading = false
        await this._setUpGame().then((res) => {
            finishedLoading = true
        })
    }

    private async _setUpGame() {
        const scene = new Scene(this._engine)
        this._gamescene = scene

        const camera = new ArcRotateCamera('camera1', 0, 0, 0, new Vector3(0, 0, 0), scene)
        camera.setPosition(new Vector3(-12, 25, -84))
        camera.attachControl(this._canvas, true)

        // 3D Axis for debugging
        // new AxesViewer(scene, 30)

        new HemisphericLight('light1', new Vector3(1, 0.5, 0), scene)

        this._simulation = new Simulation(scene)
        await this._simulation.init()
    }

    private async _goToGame() {
        //--SETUP SCENE--
        this._scene.detachControl()
        const scene = this._gamescene

        this._ui = new HUD()
        // await this._ui.createSample()

        this._simulation.registerAnimation()

        //--WHEN SCENE FINISHED LOADING--
        //get rid of start scene, switch to gamescene and change states
        this._scene.dispose()
        this._scene = scene
        this._state = State.GAME
        //the game is ready, attach control back
        this._scene.attachControl()
    }
}
new App()
