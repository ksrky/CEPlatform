// import { Scene } from '@babylonjs/core/scene'

import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'
import { RadioButton } from '@babylonjs/gui/2D/controls/radioButton'
import { Button } from '@babylonjs/gui/2D/controls/button'
import { Slider } from '@babylonjs/gui/2D/controls/sliders/slider'
import { InputText } from '@babylonjs/gui/2D/controls/inputText'

import { algorithmChoices } from './control'
import { limit } from './utils'
import { Config } from './config'

export class GameUI {
    //Pause toggle
    public gamePaused: boolean

    //UI Elements
    private _pauseBtn: Control // Button
    private _mainUI: AdvancedDynamicTexture
    private _pauseMenu: Control // Rectangle

    private _selectAlgWindow: Control
    private _setParamsWindow: Control
    private _nextBtn: Button
    private _prevBtn: Button
    private _applyBtn: Button

    private _selectedAlg: number
    private _changedParams: { [key: string]: number }
    private _config: Config

    private static readonly MAX_ALGORITHM_CHOICES = 4
    private static readonly MAX_PARAMETER_CHOICES = 5

    constructor(config: Config) {
        this._createMainUI()

        this._selectedAlg = algorithmChoices.findIndex((val) => val.id == config.algorithm.id)
        this._changedParams = config.algorithm.params
        this._config = config
    }

    private async _createMainUI(): Promise<void> {
        const mainUI = AdvancedDynamicTexture.CreateFullscreenUI('UI')
        await mainUI.parseFromSnippetAsync('T7EKW8#17')
        this._mainUI = mainUI
        this._mainUI.idealHeight = 720

        this.gamePaused = false
        const pauseMenu = this._mainUI.getControlByName('PauseMenu')
        pauseMenu.isVisible = false
        this._pauseMenu = pauseMenu

        const pauseBtn = this._mainUI.getControlByName('PauseBtn')
        this._pauseBtn = pauseBtn
        pauseBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = true
            mainUI.addControl(this._pauseMenu)
            this._pauseBtn.isHitTestVisible = false

            this.gamePaused = true
        })

        const resumeBtn = this._mainUI.getControlByName('ResumeBtn')
        resumeBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = false
            this._pauseBtn.isHitTestVisible = true

            this.gamePaused = false
        })

        const exitBtn = this._mainUI.getControlByName('ExitBtn')
        exitBtn.onPointerDownObservable.add(() => {
            this._pauseMenu.isVisible = false
            this._pauseBtn.isHitTestVisible = true

            this.gamePaused = false
        })

        this._createEditWindow()
    }

    private _createEditWindow(): void {
        this._selectAlgWindow = this._mainUI.getControlByName('SelectAlg')
        this._setParamsWindow = this._mainUI.getControlByName('SetParams')
        this._nextBtn = this._mainUI.getControlByName('NextBtn') as Button
        this._prevBtn = this._mainUI.getControlByName('PrevBtn') as Button
        this._applyBtn = this._mainUI.getControlByName('ApplyBtn') as Button

        this._nextBtn.onPointerDownObservable.add(() => {
            this._setParams()
        })
        this._prevBtn.onPointerClickObservable.add(() => {
            this._selectAlgorithm()
        })
        this._applyBtn.onPointerClickObservable.add(() => {
            this._config.changed = true
            this._config.algorithm.id = algorithmChoices[this._selectedAlg].id
            this._config.algorithm.params = this._changedParams
            this._selectAlgorithm()
        })

        this._selectAlgorithm()
    }

    private _selectAlgorithm() {
        this._selectAlgWindow.isVisible = true
        this._setParamsWindow.isVisible = false

        this._nextBtn.isVisible = true
        this._nextBtn.isHitTestVisible = true
        this._prevBtn.isVisible = false
        this._prevBtn.isHitTestVisible = false
        this._applyBtn.isVisible = false
        this._applyBtn.isHitTestVisible = false

        for (let i = 0; i < GameUI.MAX_ALGORITHM_CHOICES; i++) {
            const grid: Control = this._mainUI.getControlByName('Algorithm' + (i + 1))
            if (algorithmChoices.length > i) {
                const { id, discription } = algorithmChoices[i]
                const nameText = grid.getDescendants(
                    true,
                    (ctr) => ctr.name == 'Name'
                )[0] as TextBlock
                nameText.text = id
                const discText = grid.getDescendants(
                    true,
                    (ctr) => ctr.name == 'Discription'
                )[0] as TextBlock
                discText.text = discription
                grid.isVisible = true

                const radioBtn = grid.getDescendants(
                    true,
                    (ctr) => ctr.name == 'RadioBtn'
                )[0] as RadioButton
                radioBtn.onIsCheckedChangedObservable.add(function (state) {
                    if (state) this._selectedAlg = i
                })
            } else {
                grid.isVisible = false
            }
        }
    }

    private _setParams() {
        this._selectAlgWindow.isVisible = false
        this._setParamsWindow.isVisible = true

        this._nextBtn.isVisible = false
        this._nextBtn.isHitTestVisible = false
        this._prevBtn.isVisible = true
        this._prevBtn.isHitTestVisible = true
        this._applyBtn.isVisible = true
        this._applyBtn.isHitTestVisible = true

        this._changedParams = this._config.algorithm.params

        const params = algorithmChoices[this._selectedAlg].params
        for (let i = 0; i < GameUI.MAX_PARAMETER_CHOICES; i++) {
            const grid: Control = this._mainUI.getControlByName('Parameter' + (i + 1))
            if (params.length > i) {
                const currentVal = this._config.algorithm.params[params[i].id] // params[i].param.value

                const nameText = grid.getDescendants(
                    true,
                    (ctr) => ctr.name == 'Name'
                )[0] as TextBlock
                nameText.text = params[i].id
                const discText = grid.getDescendants(
                    true,
                    (ctr) => ctr.name == 'Discription'
                )[0] as TextBlock
                discText.text = params[i].discription
                grid.isVisible = true

                const slider = grid.getDescendants(true, (ctr) => ctr.name == 'Slider')[0] as Slider
                slider.minimum = params[i].param.min
                slider.maximum = params[i].param.max
                slider.value = currentVal
                slider.step = (params[i].param.max - params[i].param.min) / 100

                const inputBox = grid.getDescendants(
                    true,
                    (ctr) => ctr.name == 'InputText'
                )[0] as InputText
                inputBox.text = String(currentVal)

                slider.onValueChangedObservable.add((val: number) => {
                    this._changedParams[params[i].id] = val
                    inputBox.text = String(val)
                })
                inputBox.onBeforeKeyAddObservable.add((input: InputText) => {
                    const key = input.currentKey
                    if ((key < '0' || key > '9') && key != '.') {
                        input.addKey = false
                    }
                })
                inputBox.onBlurObservable.add((input: InputText) => {
                    if (input.text == '') input.text = String(currentVal)
                    const val = limit(Number(input.text), params[i].param.min, params[i].param.max)
                    input.text = String(val)
                    slider.value = val
                })
            } else {
                grid.isVisible = false
            }
        }
    }
}
