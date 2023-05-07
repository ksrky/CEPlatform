// Core imports
import { Scene } from '@babylonjs/core/scene'
import { Engine } from '@babylonjs/core/Engines/engine'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Color4, Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import '@babylonjs/core/Loading/loadingScreen'

// GUI imports
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'

// Debug imports
// import '@babylonjs/core/Debug/debugLayer'
// import '@babylonjs/inspector'

// Local imports
import { Simulation } from './simulation'
import { GameUI } from './ui'
import { Config } from './config'

enum State {
    START = 0,
    GAME = 1,
}

class App {
    private _canvas: HTMLCanvasElement
    private _engine: Engine
    private _scene: Scene

    private _config: Config

    private _gameUI: GameUI

    private _state = 0
    private _gamescene: Scene

    private _simulation: Simulation

    constructor() {
        // create the canvas html element and attach it to the webpage
        this._canvas = this._createCanvas()

        // initialize babylon scene and engine
        this._engine = new Engine(this._canvas, true)
        this._scene = new Scene(this._engine)

        this._config = new Config()

        // hide/show the Inspector
        /*window.addEventListener('keydown', (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'I') {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide()
                } else {
                    this._scene.debugLayer.show()
                }
            }
        })*/

        // run the main render loop
        this._main()
    }

    private _createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas')
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.id = 'gameCanvas'
        document.getElementById('main').appendChild(canvas)

        return canvas
    }

    private async _main(): Promise<void> {
        await this._gotoStart()

        this._engine.runRenderLoop(() => {
            switch (this._state) {
                case State.START:
                    this._scene.render()
                    break
                case State.GAME:
                    this._scene.render()
                    break
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
        const playMenu = AdvancedDynamicTexture.CreateFullscreenUI('PlayMenu')
        await playMenu.parseFromSnippetAsync('294QF7#1')
        playMenu.idealHeight = 720 // fit our fullscreen ui to this height

        const playBtn = playMenu.getControlByName('playBtn')

        // this handles interactions with the start button attached to the scene
        playBtn.onPointerDownObservable.add(() => {
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

        await this._setUpGame()
    }

    private async _setUpGame() {
        const scene = new Scene(this._engine)
        this._gamescene = scene

        new HemisphericLight('light1', new Vector3(1, 0.5, 0), scene)

        this._simulation = new Simulation(scene, this._config)
        await this._simulation.init()

        this._gameUI = new GameUI(this._config)

        window.addEventListener('keydown', (ev) => {
            if (ev.key === ' ') {
                this._simulation.stop = !this._simulation.stop
            }
        })
    }

    private async _goToGame() {
        //--SETUP SCENE--
        this._scene.detachControl()
        const scene = this._gamescene

        this._simulation.registerAnimation()

        //--WHEN SCENE FINISHED LOADING--
        // get rid of start scene, switch to gamescene and change states
        this._scene.dispose()
        this._scene = scene
        this._state = State.GAME
        // the game is ready, attach control back
        this._scene.attachControl()
    }
}
new App()
