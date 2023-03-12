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
        this.n_steps = 50
        this.scene = scene
        this.vehicle = new Vehicle(this.scene)
        this.path = new Path(this.scene, this.n_steps)

        this.vehicle.carBody.position.y = 4
        this.vehicle.carBody.position.z = 50 // r
        
        this._path3d = new BABYLON.Path3D(this.path.points)
        this._normals = this._path3d.getNormals()

        this._theta = Math.acos(BABYLON.Vector3.Dot(BABYLON.Axis.Z, this._normals[0]))
        this.vehicle.carBody.rotate(BABYLON.Axis.Y, this._theta, BABYLON.Space.WORLD)
        this._startRotation = this.vehicle.carBody.rotationQuaternion
    }

    public animate() : void {
        let i = 0 
        this.scene.registerAfterRender(function() {
            this.vehicle.carBody.position.x = this.path.points[i].x
            this.vehicle.carBody.position.z = this.path.points[i].z
            this.wheelFI.rotate(this.normals[i], Math.PI/32, BABYLON.Space.WORLD) 
            this.wheelFO.rotate(this.normals[i], Math.PI/32, BABYLON.Space.WORLD)
            this.wheelRI.rotate(this.normals[i], Math.PI/32, BABYLON.Space.WORLD)
            this.wheelRO.rotate(this.normals[i], Math.PI/32, BABYLON.Space.WORLD)
        
            this._theta = Math.acos(BABYLON.Vector3.Dot(this._normals[i],this._normals[i+1]))
            let dir = BABYLON.Vector3.Cross(this._normals[i],this._normals[i+1]).y
            dir = dir/Math.abs(dir)
            this.vehicle.carBody.rotate(BABYLON.Axis.Y, dir * this._theta, BABYLON.Space.WORLD)
                
            i = (i + 1) % (this.n_steps-1)	//continuous looping  
        })
    }
}