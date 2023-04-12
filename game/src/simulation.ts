import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'

import { Vehicle } from './vehicle'
import { Track } from './track'
import { Path } from './control/path'
import { Control } from './control'
import { Pos, vector3toPos } from './position'

export class Simulation {
    private _scene: Scene
    private _vehicle: Vehicle
    private _track: Track
    private _n_points: number
    private _dt: number

    private _path: Path
    private _control: Control

    constructor(scene: Scene) {
        this._n_points = 200
        this._scene = scene
        this._track = new Track(this._scene, this._n_points)
        this._dt = 0.05

        this._vehicle = new Vehicle(this._scene, 12)
        this._vehicle.body.position = new Vector3(
            this._track.points[0].x,
            4,
            this._track.points[0].z
        )
        this._vehicle.body.rotation.y = this._track.getStartPose()

        this._control = new Control(this._dt)

        this._registerAnimation()
    }

    private _feedback() {
        const points: Pos[] = this._track.points.map(vector3toPos)
        this._control.vehicle.pos = vector3toPos(this._vehicle.body.position)
        this._control.vehicle.velocity = this._vehicle.velocity
        // Rotation around the Y-axis of the left-hand coordinate system is counterclockwise
        this._control.vehicle.heading = -this._vehicle.body.rotation.y
        this._path = new Path(points).getVehiclePath(this._control.vehicle)
    }

    private _registerAnimation(): void {
        this._scene.registerAfterRender(() => {
            this._feedback()
            const [delta, acc] = this._control.calculate(this._path)
            // Rotation around the Y-axis of the left-hand coordinate system is counterclockwise
            this._vehicle.update(acc, -delta, this._dt)
            this._vehicle.rotateWheels(this._vehicle.body.rotation.y)
        })
    }
}
