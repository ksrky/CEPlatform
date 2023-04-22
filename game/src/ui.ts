import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'
import { Button } from '@babylonjs/gui/2D/controls/button'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { Rectangle } from '@babylonjs/gui/2D/controls/rectangle'
import { StackPanel } from '@babylonjs/gui/2D/controls/stackPanel'
import { Image } from '@babylonjs/gui/2D/controls/image'

export class HUD {
    //Pause toggle
    public gamePaused: boolean

    //UI Elements
    public pauseBtn: Button
    private _mainUI: AdvancedDynamicTexture
    private _pauseMenu: Rectangle

    constructor() {
        const mainUI = AdvancedDynamicTexture.CreateFullscreenUI('UI')
        this._mainUI = mainUI
        this._mainUI.idealHeight = 720

        const pauseBtn = Button.CreateImageOnlyButton('pauseBtn', './images/pauseBtn.svg')
        pauseBtn.width = '50px'
        pauseBtn.height = '50px'
        pauseBtn.thickness = 0
        pauseBtn.verticalAlignment = 0
        pauseBtn.horizontalAlignment = 1
        mainUI.addControl(pauseBtn)
        pauseBtn.zIndex = 10
        this.pauseBtn = pauseBtn
        //when the button is down, make pause menu visable and add control to it
        pauseBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = true
            mainUI.addControl(this._pauseMenu)
            this.pauseBtn.isHitTestVisible = false

            this.gamePaused = true
        })

        this._createPauseMenu()
    }

    private _createPauseMenu(): void {
        this.gamePaused = false

        const pauseMenu = new Rectangle()
        pauseMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
        pauseMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        pauseMenu.height = 0.8
        pauseMenu.width = 0.5
        pauseMenu.thickness = 0
        pauseMenu.isVisible = false

        //background image
        const image = new Image('pause', 'images/pause.png')
        pauseMenu.addControl(image)

        //stack panel for the buttons
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
        resumeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        stackPanel.addControl(resumeBtn)

        this._pauseMenu = pauseMenu

        resumeBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = false
            this.pauseBtn.isHitTestVisible = true

            this.gamePaused = false
        })
    }
}
