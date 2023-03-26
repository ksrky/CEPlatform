import * as BABYLON from '@babylonjs/core'

export class Track {
    public scene: BABYLON.Scene

    public points : BABYLON.Vector3[]

    constructor(scene: BABYLON.Scene, n_points : number) {
        this.scene = scene

        this._generatePath(n_points)
        this._makeTrack()
        console.log(this.points)
    }

    private _generatePath(n: number) : void {
        const r = 50
        this.points = []
        for (let i = 0; i < n + 1; i++) {
            this.points.push(
                new BABYLON.Vector3((r + (r / 5) * Math.sin((8 * i * Math.PI) / n)) *
                        Math.cos((2 * i * Math.PI) / n),
                0,
                (r + (r / 10) * Math.sin((6 * i * Math.PI) / n)) *
                        Math.sin((2 * i * Math.PI) / n)))       
        }
        console.log(this.points[0])
        // console.log(this.points)
    }

    private _makeTrack() : void {
        const track = BABYLON.MeshBuilder.CreateLines(
            'track',
            { points: this.points },
            this.scene
        )
        track.color = new BABYLON.Color3(0, 0, 0)

        const r = 50
        /* const ground = */BABYLON.MeshBuilder.CreateGround(
            'ground',
            { width: 3 * r, height: 3 * r },
            this.scene
        )
    }

    public getStartPose() : number {
        const path3d = new BABYLON.Path3D(this.points)
        const {x, z} = path3d.getTangentAt(0)
        return Math.atan2(z, x)
    }
}
