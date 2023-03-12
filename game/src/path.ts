import * as BABYLON from '@babylonjs/core'

export class Path {
    public scene: BABYLON.Scene
    public points: BABYLON.Vector3[]
    private _n = 50 // number of points - more points the slower the car
    private _r = 50 //radius

    constructor(scene: BABYLON.Scene, n_steps : number) {
        this.scene = scene
        this._n = n_steps
    }

    private _generatePath(): void {
        for (let i = 0; i < this._n + 1; i++) {
            this.points.push(
                new BABYLON.Vector3(
                    (this._r + (this._r / 5) * Math.sin((8 * i * Math.PI) / this._n)) *
                        Math.cos((2 * i * Math.PI) / this._n),
                    0,
                    (this._r + (this._r / 10) * Math.sin((6 * i * Math.PI) / this._n)) *
                        Math.sin((2 * i * Math.PI) / this._n)
                )
            )
        }

        const track = BABYLON.MeshBuilder.CreateLines(
            'track',
            { points: this.points },
            this.scene
        )
        track.color = new BABYLON.Color3(0, 0, 0)

        const ground = BABYLON.MeshBuilder.CreateGround(
            'ground',
            { width: 3 * this._r, height: 3 * this._r },
            this.scene
        )
    }
}
