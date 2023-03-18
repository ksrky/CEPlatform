import * as BABYLON from '@babylonjs/core'

import { Vehicle } from './vehicle'
import { Path } from './path'

export class Simulation {
    public scene : BABYLON.Scene
    public vehicle : Vehicle
    public path : Path
    public n_steps : number

    private _path3d : BABYLON.Path3D
    private _normals : BABYLON.Vector3[]
    private _theta : number
    private _startRotation : BABYLON.Quaternion

    constructor(scene: BABYLON.Scene) {
        this.n_steps = 200
        this.scene = scene
        this.vehicle = new Vehicle(this.scene)
        this.path = new Path(this.scene, this.n_steps)

        this.vehicle.body.position.y = 4
        this.vehicle.body.position.z = 50 // r
        
        this._path3d = new BABYLON.Path3D(this.path.points)
        this._normals = this._path3d.getNormals()

        this._theta = Math.acos(BABYLON.Vector3.Dot(BABYLON.Axis.Z, this._normals[0]))
        this.vehicle.body.rotate(BABYLON.Axis.Y, this._theta, BABYLON.Space.WORLD)
        this._startRotation = this.vehicle.body.rotationQuaternion
        this._registerAnimation()
    }

    private _registerAnimation() : void {
        let i = 0
        this.scene.registerAfterRender(() => {
            this.vehicle.body.position.x = this.path.points[i].x
            this.vehicle.body.position.z = this.path.points[i].z
            this.vehicle.wheelFI.rotate(this._normals[i], Math.PI/32, BABYLON.Space.WORLD) 
            this.vehicle.wheelFO.rotate(this._normals[i], Math.PI/32, BABYLON.Space.WORLD)
            this.vehicle.wheelRI.rotate(this._normals[i], Math.PI/32, BABYLON.Space.WORLD)
            this.vehicle.wheelRO.rotate(this._normals[i], Math.PI/32, BABYLON.Space.WORLD)
        
            this._theta = Math.acos(BABYLON.Vector3.Dot(this._normals[i],this._normals[i+1]))
            let dir = BABYLON.Vector3.Cross(this._normals[i],this._normals[i+1]).y
            dir = dir/Math.abs(dir)
            this.vehicle.body.rotate(BABYLON.Axis.Y, dir * this._theta, BABYLON.Space.WORLD)
                
            i = (i + 1) % (this.n_steps-1)	//continuous looping
            
            if(i == 0) {
                this.vehicle.body.rotationQuaternion = this._startRotation
            }
        })
    }
}