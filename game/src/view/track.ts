import { Color3, Path3D, Vector3 } from '@babylonjs/core/Maths/math'
import { Scene } from '@babylonjs/core/scene'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'

export class Track {
    public scene: Scene

    public points: Vector3[]

    constructor(scene: Scene, nPoints: number, startPos: Vector3) {
        this.scene = scene

        this._generatePath(nPoints, startPos)
        this._makeTrack()
    }

    private _generatePath(n: number, offset: Vector3): void {
        const r = 50
        this.points = []
        for (let i = 0; i < n + 1; i++) {
            this.points.push(
                new Vector3(
                    (r + (r / 5) * Math.sin((8 * i * Math.PI) / n)) *
                        Math.cos((2 * i * Math.PI) / n),
                    0,
                    (r + (r / 10) * Math.sin((6 * i * Math.PI) / n)) *
                        Math.sin((2 * i * Math.PI) / n)
                )
            )
        }

        this.points.map((v) => v.subtract(offset))
    }

    private _makeTrack(): void {
        const track = MeshBuilder.CreateLines('track', { points: this.points }, this.scene)
        track.color = new Color3(0, 0, 0)

        const r = 50
        /* const ground = */ MeshBuilder.CreateGround(
            'ground',
            { width: 3 * r, height: 3 * r },
            this.scene
        )
    }

    public getStartPose(): number {
        const path3d = new Path3D(this.points)
        const { x, z } = path3d.getTangentAt(0)
        return -Math.atan2(z, x)
    }
}
