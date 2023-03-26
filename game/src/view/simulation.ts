import * as BABYLON from '@babylonjs/core'

import { Vehicle } from './vehicle'
import { Track } from './track'
import { Path } from '../models/path'
import { Control } from '../models/control'
import { Pos, vector3toPos } from '../models/position'

export class Simulation {
    public scene : BABYLON.Scene
    public vehicle : Vehicle
    public track : Track
    public n_points : number
    public dt : number
 
    private _path : Path
    private _control : Control
    

    constructor(scene: BABYLON.Scene) {
        this.n_points = 200
        this.scene = scene
        this.vehicle = new Vehicle(this.scene, 12)
        this.track = new Track(this.scene, this.n_points)
        this.dt = 0.05

        this._control = new Control(this.dt)

        this.vehicle.body.position = this.track.points[0]
        this.vehicle.body.position.y = 4
        this.vehicle.body.rotation.y = this.track.getStartPose()
        // console.log(this.vehicle.body.position)
        // console.log(this.vehicle.body.rotation.y)
        // console.log(this.track.points)
        this._registerAnimation()
    }

    private _perception() {
        const points : Pos[] = this.track.points.map(vector3toPos)
        this._control.vehicle.pos = vector3toPos(this.vehicle.body.position)
        this._control.vehicle.velocity = this.vehicle.velocity
        // Rotation around the Y-axis of the left-hand coordinate system is counterclockwise
        this._control.vehicle.heading = -this.vehicle.body.rotation.y
        this._path = new Path(points).getVehiclePath(this._control.vehicle)
    }

    private _registerAnimation() : void {
        this.scene.registerAfterRender(() => {
            this._perception()
            if(this._path.waypoints.length < 10) return
            const [delta, acc] = this._control.calculate(this._path)
            // console.log(delta, acc)
            // Rotation around the Y-axis of the left-hand coordinate system is counterclockwise
            this.vehicle.update(acc, -delta, this.dt)
            // console.log(this.vehicle.body.rotation.y)
            // console.log(this.vehicle.body.position.x, this.vehicle.body.position.z)
            this.vehicle.rotateWheels(this.vehicle.body.rotation.y)
        })
    }
}