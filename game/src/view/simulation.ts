import * as BABYLON from '@babylonjs/core'

import { Vehicle } from './vehicle'
import { Track } from './track'
import { Path } from '../models/path'
import { Control } from '../models/control'

export class Simulation {
    public scene : BABYLON.Scene
    public vehicle : Vehicle
    public track : Track
    public n_steps : number
 
    private _path : Path
    private _control : Control

    private _path3d : BABYLON.Path3D
    private _normals : BABYLON.Vector3[]
    private _theta : number
    private _startRotation : BABYLON.Quaternion

    constructor(scene: BABYLON.Scene) {
        this.n_steps = 200
        this.scene = scene
        this.vehicle = new Vehicle(this.scene)
        this.track = new Track(this.scene, this.n_steps)

        this.vehicle.body.position.y = 4
        this.vehicle.body.position.z = 50 // r
        
        this._path3d = new BABYLON.Path3D(this.track.points)
        this._normals = this._path3d.getNormals()

        this._theta = Math.acos(BABYLON.Vector3.Dot(BABYLON.Axis.Z, this._normals[0]))
        this.vehicle.body.rotate(BABYLON.Axis.Y, this._theta, BABYLON.Space.WORLD)
        this._startRotation = this.vehicle.body.rotationQuaternion
        this._registerAnimation()
    }

    private perception() {
        this._path = new Path(this.track.points)
    }

    private decision() {
        this._control.calculate(this._path)
    }

    private _registerAnimation() : void {
        let i = 0
        this.scene.registerAfterRender(() => {
            this.vehicle.body.position.x = this.track.points[i].x
            this.vehicle.body.position.z = this.track.points[i].z
            this.vehicle.rotateWheels()
        
            this._theta = Math.acos(BABYLON.Vector3.Dot(this._normals[i],this._normals[i+1]))
            let dir = BABYLON.Vector3.Cross(this._normals[i],this._normals[i+1]).y
            dir = dir/Math.abs(dir)
            this.vehicle.body.rotate(BABYLON.Axis.Y, dir * this._theta, BABYLON.Space.WORLD)
                
            i = (i + 1) % (this.n_steps-1)	// continuous looping
            
            if(i == 0) {
                this.vehicle.body.rotationQuaternion = this._startRotation
            }
        })
    }
}