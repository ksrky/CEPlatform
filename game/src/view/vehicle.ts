import { Axis, Color3, Color4, Space, Vector3, Vector4 } from '@babylonjs/core/Maths/math'
import { Scene } from '@babylonjs/core/scene'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { InstancedMesh } from '@babylonjs/core/Meshes/instancedMesh'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { Config } from '../config'

/**
 * Vehicle model
 * @param scene
 * @param velocity
 * @param wheelBase */
export class Vehicle {
    private _scene: Scene

    // Physical objects
    public root: TransformNode
    private _body: Mesh
    private _wheelFI: Mesh
    private _wheelFO: InstancedMesh
    private _wheelRI: InstancedMesh
    private _wheelRO: InstancedMesh
    private static readonly BODY_HEIGHT: number = 4

    // Following camera
    public camera: UniversalCamera
    /** root camera parent that handles positioning of the camera to follow the vehicle */
    private _camRoot: TransformNode
    /** rotations along the z-axis (up/down tilting) */
    private _yTilt: TransformNode
    private static readonly CAMERA_ORIGINAL_TILT: Vector3 = new Vector3(0, 0, -0.4)

    // Properties
    public velocity: number
    public wheelBase: number

    constructor(scene: Scene, config: Config, pos: Vector3, rotY: number) {
        this._scene = scene
        this.velocity = config.vehicle.initial_speed
        this.wheelBase = config.vehicle.wheel_base

        this.root = new TransformNode('vehicle-root', scene)
        this.root.position = pos
        this.root.rotation.y = rotY

        this._makeBody()
        this._attachWheels()
        this._setupCamera()
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

        const mesh = MeshBuilder.ExtrudeShape(
            'body',
            { shape: side, path: extrudePath, cap: Mesh.CAP_ALL },
            this._scene
        )
        mesh.material = bodyMaterial
        mesh.position.y = Vehicle.BODY_HEIGHT
        this._body = mesh
        this._body.parent = this.root
    }

    private _attachWheels(): void {
        const wheelMaterial = new StandardMaterial('wheel_mat', this._scene)
        const wheelTexture = new Texture(
            'images/wheel.png' /*wheel_image 'http://i.imgur.com/ZUWbT6L.png'*/,
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
        this._wheelFI = MeshBuilder.CreateCylinder(
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
        this._wheelFI.material = wheelMaterial
        this._wheelFI.rotate(Axis.X, Math.PI / 2, Space.WORLD)
        this._wheelFI.parent = this._body
        this._wheelFI.position = new Vector3(4.5, -2, -2.8)

        this._wheelFO = this._wheelFI.createInstance('FO')
        this._wheelFO.parent = this._body
        this._wheelFO.position = new Vector3(4.5, -2, 2.8)

        this._wheelRI = this._wheelFI.createInstance('RI')
        this._wheelRI.parent = this._body
        this._wheelRI.position = new Vector3(-2.5, -2, -2.8)

        this._wheelRO = this._wheelFI.createInstance('RO')
        this._wheelRO.parent = this._body
        this._wheelRO.position = new Vector3(-2.5, -2, 2.8)
    }

    private _setupCamera(): void {
        this._camRoot = new TransformNode('root')
        this._camRoot.position = new Vector3(0, 0, 0)
        this._camRoot.rotation = new Vector3(0, Math.PI, 0)

        const yTilt = new TransformNode('ytilt')
        yTilt.rotation = Vehicle.CAMERA_ORIGINAL_TILT
        this._yTilt = yTilt
        yTilt.parent = this._camRoot

        this.camera = new UniversalCamera('camera', new Vector3(-50, 0, 0), this._scene)
        this.camera.lockedTarget = this._camRoot.position
        this.camera.fov = 0.47350045992678597
        this.camera.parent = yTilt

        this._scene.activeCamera = this.camera
    }

    public update(acc: number, delta: number, dt: number) {
        this.root.position.x += this.velocity * Math.cos(this.root.rotation.y) * dt
        this.root.position.z += this.velocity * Math.sin(-this.root.rotation.y) * dt
        this.root.rotation.y += ((this.velocity * Math.tan(delta)) / this.wheelBase) * dt
        this.velocity += acc * dt
    }

    public rotateWheels(theta: number): void {
        const heading = new Vector3(Math.cos(-theta), 0, Math.sin(-theta))
        const normal = Vector3.Cross(heading, Axis.Y)
        this._wheelFI.rotate(normal, -Math.PI / 64, Space.WORLD)
        this._wheelFO.rotate(normal, -Math.PI / 64, Space.WORLD)
        this._wheelRI.rotate(normal, -Math.PI / 64, Space.WORLD)
        this._wheelRO.rotate(normal, -Math.PI / 64, Space.WORLD)
    }

    public updateCamera(): void {
        const center = this.root.position.y + 2
        this._camRoot.position = Vector3.Lerp(
            this._camRoot.position,
            new Vector3(this.root.position.x, center, this.root.position.z),
            0.4
        )
        this._camRoot.rotation = this.root.rotation
    }
}
