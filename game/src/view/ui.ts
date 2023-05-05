// import { Scene } from '@babylonjs/core/scene'

import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'
import { Button } from '@babylonjs/gui/2D/controls/button'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { Rectangle } from '@babylonjs/gui/2D/controls/rectangle'
import { StackPanel } from '@babylonjs/gui/2D/controls/stackPanel'
import { Image } from '@babylonjs/gui/2D/controls/image'
// import '@babylonjs/gui'

export class HUD {
    //Pause toggle
    public gamePaused: boolean

    //UI Elements
    public pauseBtn: Control // Button
    private _mainUI: AdvancedDynamicTexture
    private _pauseMenu: Control // Rectangle

    constructor() {
        /*const mainUI = AdvancedDynamicTexture.CreateFullscreenUI('UI')
        mainUI.parseFromSnippetAsync('T7EKW8#5')
        this._mainUI = mainUI
        this._mainUI.idealHeight = 720

        const pauseBtn = this._mainUI.getControlByName('PauseBtn')
        console.log(pauseBtn)*/
        /*const pauseBtn = Button.CreateImageOnlyButton('pauseBtn', './images/pauseBtn.svg')
        pauseBtn.width = '50px'
        pauseBtn.height = '50px'
        pauseBtn.thickness = 0
        pauseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        pauseBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
        mainUI.addControl(pauseBtn)
        pauseBtn.zIndex = 10*/
        /*this.pauseBtn = pauseBtn
        //when the button is down, make pause menu visable and add control to it
        pauseBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = true
            mainUI.addControl(this._pauseMenu)
            this.pauseBtn.isHitTestVisible = false

            this.gamePaused = true
        })*/

        this._createMainUI()
        // this._createPauseMenu()
    }

    private async _createMainUI(): Promise<void> {
        const mainUI = AdvancedDynamicTexture.CreateFullscreenUI('UI')
        await mainUI.parseFromSnippetAsync('T7EKW8#8')
        this._mainUI = mainUI
        this._mainUI.idealHeight = 720

        this.gamePaused = false
        const pauseMenu = this._mainUI.getControlByName('PauseMenu')
        pauseMenu.isVisible = false
        this._pauseMenu = pauseMenu

        const pauseBtn = this._mainUI.getControlByName('PauseBtn')
        console.log(pauseBtn)
        /*const pauseBtn = Button.CreateImageOnlyButton('pauseBtn', './images/pauseBtn.svg')
        pauseBtn.width = '50px'
        pauseBtn.height = '50px'
        pauseBtn.thickness = 0
        pauseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        pauseBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
        mainUI.addControl(pauseBtn)
        pauseBtn.zIndex = 10*/
        this.pauseBtn = pauseBtn
        //when the button is down, make pause menu visable and add control to it
        pauseBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = true
            mainUI.addControl(this._pauseMenu)
            this.pauseBtn.isHitTestVisible = false

            this.gamePaused = true
        })

        const resumeBtn = this._mainUI.getControlByName('ResumeBtn')

        resumeBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = false
            this.pauseBtn.isHitTestVisible = true

            this.gamePaused = false
        })
    }

    private _createEditWindow(): void {}

    private _createPauseMenu(): void {
        /*const pauseMenu = new Rectangle()
        pauseMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
        pauseMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        pauseMenu.height = 0.8
        pauseMenu.width = 0.5
        pauseMenu.thickness = 0
        pauseMenu.isVisible = false

        // background image
        const image = new Image('pause', 'images/pause.png')
        pauseMenu.addControl(image)

        // stack panel for the buttons
        const stackPanel = new StackPanel()
        stackPanel.width = 0.83
        pauseMenu.addControl(stackPanel)

        const resumeBtn = Button.CreateSimpleButton('resume', 'RESUME')
        resumeBtn.width = 0.18
        resumeBtn.height = '44px'
        resumeBtn.color = 'white'
        resumeBtn.fontFamily = 'Viga'
        resumeBtn.paddingBottom = '14px'
        resumeBtn.cornerRadius = 14
        resumeBtn.fontSize = '12px'
        resumeBtn.textBlock.resizeToFit = true
        resumeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        resumeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        stackPanel.addControl(resumeBtn)*/
    }

    /*public async createSample(): Promise<void> {
        let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('advancedGUI', true)
        await advancedTexture.parseFromURLAsync(
            'https://doc.babylonjs.com/examples/ColorPickerGui.json'
        )
    }*/
}
