import { Color3, Path3D, Vector3 } from '@babylonjs/core/Maths/math'
import { Scene } from '@babylonjs/core/scene'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { GrassProceduralTexture } from '@babylonjs/procedural-textures/grass/index'

export class Track {
    private _scene: Scene

    public points: Vector3[]
    private static readonly GROUND_SIZE = 500
    public length: number

    private _path3d: Path3D
    // private _colisionMesh: Mesh

    constructor(scene: Scene, nPoints: number, startPos: Vector3) {
        this._scene = scene

        this._generatePath(nPoints, startPos)
        this._makeGround()
        this._makeTrack()

        this._path3d = new Path3D(this.points)
        this.length = this._path3d.length()
    }

    private _generatePath(n: number, offset: Vector3): void {
        this.points = []
        const r = 50
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

    private _makeGround(): void {
        const grassMaterial = new StandardMaterial('grassMat', this._scene)
        const grassTexture = new GrassProceduralTexture('grassTex', 256, this._scene)
        grassMaterial.ambientTexture = grassTexture

        const ground = MeshBuilder.CreateGround(
            'ground',
            { width: Track.GROUND_SIZE, height: Track.GROUND_SIZE },
            this._scene
        )
        // ground.material = grassMaterial
    }

    private _makeTrack(): void {
        const line = MeshBuilder.CreateLines('track', { points: this.points }, this._scene)
        line.color = new Color3(0, 0, 0)
    }

    public getStartPose(): number {
        const { x, z } = this._path3d.getTangentAt(0)
        return -Math.atan2(z, x)
    }
}
