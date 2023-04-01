import { Axis, Color3, Color4, Space, Vector3, Vector4 } from '@babylonjs/core/Maths/math'
import { Scene } from '@babylonjs/core/scene'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { InstancedMesh } from '@babylonjs/core/Meshes/instancedMesh'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import wheel_image from './assets/wheel.png'

export class Vehicle {
    /**
     * Vehicle model */
    private _scene: Scene

    public body: Mesh
    public wheelFI: Mesh
    public wheelFO: InstancedMesh
    public wheelRI: InstancedMesh
    public wheelRO: InstancedMesh

    public velocity: number
    public wheel_base: number

    constructor(scene: Scene, velocity = 10, wheel_base = 2) {
        this._scene = scene
        this.velocity = velocity
        this.wheel_base = wheel_base
        this._makeBody()
        this._attachWheels()
    }

    private _makeBody(): void {
        const bodyMaterial = new StandardMaterial('body_mat', this._scene)
        bodyMaterial.diffuseColor = new Color3(1.0, 0.25, 0.25)
        bodyMaterial.backFaceCulling = false

        const side = [
            new Vector3(4, 2, -2),
            new Vector3(-4, 2, -2),
            new Vector3(-5, -2, -2),
            new Vector3(7, -2, -2),
        ]

        side.push(side[0]) //close trapezium

        const extrudePath = [new Vector3(0, 0, 0), new Vector3(0, 0, 4)]

        this.body = MeshBuilder.ExtrudeShape(
            'body',
            { shape: side, path: extrudePath, cap: Mesh.CAP_ALL },
            this._scene
        )
        this.body.material = bodyMaterial
    }

    private _attachWheels(): void {
        const wheelMaterial = new StandardMaterial('wheel_mat', this._scene)
        const wheelTexture = new Texture(
            wheel_image /*'http://i.imgur.com/ZUWbT6L.png'*/,
            this._scene
        )
        wheelMaterial.diffuseTexture = wheelTexture

        //Set color for wheel tread as black
        const faceColors: Color4[] = []
        faceColors[1] = new Color4(0, 0, 0)

        //set texture for flat face of wheel
        const faceUV: Vector4[] = []
        faceUV[0] = new Vector4(0, 0, 1, 1)
        faceUV[2] = new Vector4(0, 0, 1, 1)

        // attaching wheels
        this.wheelFI = MeshBuilder.CreateCylinder(
            'wheelFI',
            {
                diameter: 3,
                height: 1,
                tessellation: 24,
                faceColors: faceColors,
                faceUV: faceUV,
            },
            this._scene
        )
        this.wheelFI.material = wheelMaterial
        this.wheelFI.rotate(Axis.X, Math.PI / 2, Space.WORLD)
        this.wheelFI.parent = this.body
        this.wheelFI.position = new Vector3(4.5, -2, -2.8)

        this.wheelFO = this.wheelFI.createInstance('FO')
        this.wheelFO.parent = this.body
        this.wheelFO.position = new Vector3(4.5, -2, 2.8)

        this.wheelRI = this.wheelFI.createInstance('RI')
        this.wheelRI.parent = this.body
        this.wheelRI.position = new Vector3(-2.5, -2, -2.8)

        this.wheelRO = this.wheelFI.createInstance('RO')
        this.wheelRO.parent = this.body
        this.wheelRO.position = new Vector3(-2.5, -2, 2.8)
    }

    public update(acc: number, delta: number, dt: number) {
        this.body.position.x += this.velocity * Math.cos(this.body.rotation.y) * dt
        this.body.position.z += this.velocity * Math.sin(-this.body.rotation.y) * dt
        this.body.rotation.y += ((this.velocity * Math.tan(delta)) / this.wheel_base) * dt
        this.velocity += acc * dt
    }

    public rotateWheels(theta: number): void {
        const heading = new Vector3(Math.cos(-theta), 0, Math.sin(-theta))
        const normal = Vector3.Cross(heading, Axis.Y)
        this.wheelFI.rotate(normal, -Math.PI / 64, Space.WORLD)
        this.wheelFO.rotate(normal, -Math.PI / 64, Space.WORLD)
        this.wheelRI.rotate(normal, -Math.PI / 64, Space.WORLD)
        this.wheelRO.rotate(normal, -Math.PI / 64, Space.WORLD)
    }
}
