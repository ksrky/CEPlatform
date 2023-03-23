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
        this.vehicle = new Vehicle(this.scene)
        this.track = new Track(this.scene, this.n_points)
        this.dt = 0.01

        this._control = new Control(this.dt, 2.5)

        this.vehicle.body.position.y = 4
        this.vehicle.body.position.z = 50 // r
        
        this._registerAnimation()
    }

    private _perception() {
        const points : Pos[] = this.track.points.map(vector3toPos) 
        this._path = new Path(points).getVehiclePath(this._control.vehicle)
    }

    private _decision() {
        this._control.calculate(this._path)
    }

    private _registerAnimation() : void {
        this.scene.registerAfterRender(() => {
            this._perception()
            if(this._path.waypoints.length < 10) return
            this._decision()
            this.vehicle.body.position.x += this._control.vehicle.pos.x
            this.vehicle.body.position.z += this._control.vehicle.pos.y
            this.vehicle.body.rotation.y = this._control.vehicle.heading
            this.vehicle.rotateWheels(this._control.vehicle.heading)
        })
    }
}