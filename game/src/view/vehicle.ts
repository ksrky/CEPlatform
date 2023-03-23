import * as BABYLON from '@babylonjs/core'

export class Vehicle {
    /**
     * Vehicle model */
    private _scene: BABYLON.Scene

    public body: BABYLON.Mesh
    public wheelFI: BABYLON.Mesh
    public wheelFO: BABYLON.InstancedMesh
    public wheelRI: BABYLON.InstancedMesh
    public wheelRO: BABYLON.InstancedMesh

    constructor(scene: BABYLON.Scene) {
        this._scene = scene
        this._makeBody()
        this._attachWheels()
    }

    private _makeBody(): void {
        const bodyMaterial = new BABYLON.StandardMaterial('body_mat', this._scene)
        bodyMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.25, 0.25)
        bodyMaterial.backFaceCulling = false

        const side = [
            new BABYLON.Vector3(-4, 2, -2),
            new BABYLON.Vector3(4, 2, -2),
            new BABYLON.Vector3(5, -2, -2),
            new BABYLON.Vector3(-7, -2, -2),
        ]

        side.push(side[0]) //close trapezium

        const extrudePath = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 4),
        ]

        this.body = BABYLON.MeshBuilder.ExtrudeShape(
            'body',
            { shape: side, path: extrudePath, cap: BABYLON.Mesh.CAP_ALL },
            this._scene
        )
        this.body.material = bodyMaterial
    }

    private _attachWheels(): void {
        const wheelMaterial = new BABYLON.StandardMaterial('wheel_mat', this._scene)
        const wheelTexture = new BABYLON.Texture(
            'http://i.imgur.com/ZUWbT6L.png',
            this._scene
        )
        wheelMaterial.diffuseTexture = wheelTexture

        //Set color for wheel tread as black
        const faceColors: BABYLON.Color4[] = []
        faceColors[1] = new BABYLON.Color4(0, 0, 0)

        //set texture for flat face of wheel
        const faceUV: BABYLON.Vector4[] = []
        faceUV[0] = new BABYLON.Vector4(0, 0, 1, 1)
        faceUV[2] = new BABYLON.Vector4(0, 0, 1, 1)

        // attaching wheels
        this.wheelFI = BABYLON.MeshBuilder.CreateCylinder(
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

        this.wheelFI.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD)
        this.wheelFI.parent = this.body

        this.wheelFO = this.wheelFI.createInstance('FO')
        this.wheelFO.parent = this.body
        this.wheelFO.position = new BABYLON.Vector3(-4.5, -2, 2.8)

        this.wheelRI = this.wheelFI.createInstance('RI')
        this.wheelRI.parent = this.body
        this.wheelRI.position = new BABYLON.Vector3(2.5, -2, -2.8)

        this.wheelRO = this.wheelFI.createInstance('RO')
        this.wheelRO.parent = this.body
        this.wheelRO.position = new BABYLON.Vector3(2.5, -2, 2.8)

        this.wheelFI.position = new BABYLON.Vector3(-4.5, -2, -2.8)
    }

    public rotateWheels(theta : number): void {
        const heading = new BABYLON.Vector3(Math.cos(theta), 0, Math.sin(theta))
        const normal = BABYLON.Vector3.Cross(heading, BABYLON.Axis.Z)
        this.wheelFI.rotate(normal, Math.PI / 64, BABYLON.Space.WORLD)
        this.wheelFO.rotate(normal, Math.PI / 64, BABYLON.Space.WORLD)
        this.wheelRI.rotate(normal, Math.PI / 64, BABYLON.Space.WORLD)
        this.wheelRO.rotate(normal, Math.PI / 64, BABYLON.Space.WORLD)
    }
}
