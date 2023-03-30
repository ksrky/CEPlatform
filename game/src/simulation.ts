import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'

import { Vehicle } from './vehicle'
import { Track } from './track'
import { Path } from './control/path'
import { Control } from './control'
import { Pos, vector3toPos } from './position'

export class Simulation {
    public scene: Scene
    public vehicle: Vehicle
    public track: Track
    public n_points: number
    public dt: number

    private _path: Path
    private _control: Control

    constructor(scene: Scene) {
        this.n_points = 200
        this.scene = scene
        this.track = new Track(this.scene, this.n_points)
        this.dt = 0.05

        this.vehicle = new Vehicle(this.scene, 12)
        this.vehicle.body.position = new Vector3(this.track.points[0].x, 4, this.track.points[0].z)
        this.vehicle.body.rotation.y = this.track.getStartPose()

        this._control = new Control(this.dt)

        this._registerAnimation()
    }

    private _perception() {
        const points: Pos[] = this.track.points.map(vector3toPos)
        this._control.vehicle.pos = vector3toPos(this.vehicle.body.position)
        this._control.vehicle.velocity = this.vehicle.velocity
        // Rotation around the Y-axis of the left-hand coordinate system is counterclockwise
        this._control.vehicle.heading = -this.vehicle.body.rotation.y
        this._path = new Path(points).getVehiclePath(this._control.vehicle)
    }

    private _registerAnimation(): void {
        this.scene.registerAfterRender(() => {
            this._perception()
            const [delta, acc] = this._control.calculate(this._path)
            // Rotation around the Y-axis of the left-hand coordinate system is counterclockwise
            this.vehicle.update(acc, -delta, this.dt)
            this.vehicle.rotateWheels(this.vehicle.body.rotation.y)
        })
    }
}
