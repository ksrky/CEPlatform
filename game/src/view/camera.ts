import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Scene } from '@babylonjs/core/scene'

export class DriverCamera {
    private _camRoot: TransformNode
    private _yTilt: TransformNode
    public camera: FreeCamera

    constructor(scene: Scene, init_pos: Vector3, init_tilt: Vector3) {
        this._camRoot = new TransformNode('root')
        this._camRoot.position = new Vector3(0, 0, 0)
        this._camRoot.rotation = new Vector3(0, Math.PI / 2, 0)

        let yTilt = new TransformNode('ytilt')
        yTilt.rotation = init_tilt
        this._yTilt = yTilt
        yTilt.parent = this._camRoot

        const camera = new FreeCamera('driver-camera', new Vector3(0, 0, -30), scene)
        camera.lockedTarget = this._camRoot.position
        camera.fov = 0.47350045992678597
        camera.parent = yTilt

        scene.activeCamera = camera
        this.camera = camera
    }

    private _updateCamera(mesh: Mesh): void {
        let centerVehicle = mesh.position.y + 2
        this._camRoot.position = Vector3.Lerp(
            this._camRoot.position,
            new Vector3(mesh.position.x, centerVehicle, mesh.position.z),
            0.4
        )
        this._yTilt.rotation = mesh.rotation
    }

    public activateDriverCamera(scene: Scene, mesh: Mesh): FreeCamera {
        scene.registerBeforeRender(() => {
            this._updateCamera(mesh)
        })
        return this.camera
    }
}
