import * as BABYLON from '@babylonjs/core'

export class Vehicle {
    /**
     * Vehicle model */
    public scene: BABYLON.Scene

    public carBody: BABYLON.Mesh
    public wheelFI: BABYLON.Mesh
    public wheelFO: BABYLON.InstancedMesh
    public wheelRI: BABYLON.InstancedMesh
    public wheelRO: BABYLON.InstancedMesh

    constructor(scene: BABYLON.Scene) {
        this.scene = scene
        this._makeCarBody()
        this._attachWheels()
    }

    private _makeCarBody(): void {
        const bodyMaterial = new BABYLON.StandardMaterial('body_mat', this.scene)
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

        this.carBody = BABYLON.MeshBuilder.ExtrudeShape(
            'body',
            { shape: side, path: extrudePath, cap: BABYLON.Mesh.CAP_ALL },
            this.scene
        )
        this.carBody.material = bodyMaterial
    }

    private _attachWheels(): void {
        const wheelMaterial = new BABYLON.StandardMaterial('wheel_mat', this.scene)
        const wheelTexture = new BABYLON.Texture(
            'http://i.imgur.com/ZUWbT6L.png',
            this.scene
        )
        wheelMaterial.diffuseTexture = wheelTexture

        //Set color for wheel tread as black
        const faceColors: BABYLON.Color4[] = []
        faceColors[1] = new BABYLON.Color4(0, 0, 0)

        //set texture for flat face of wheel
        const faceUV: BABYLON.Vector4[] = []
        faceUV[0] = new BABYLON.Vector4(0, 0, 1, 1)
        faceUV[2] = new BABYLON.Vector4(0, 0, 1, 1)

        const wheel = BABYLON.MeshBuilder.CreateCylinder(
            'wheel',
            {
                diameter: 3,
                height: 1,
                tessellation: 24,
                faceColors: faceColors,
                faceUV: faceUV,
            },
            this.scene
        )
        wheel.material = wheelMaterial

        //rotate wheel so tread in xz plane
        wheel.rotation.x = Math.PI / 2

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
            this.scene
        )
        this.wheelFI.material = wheelMaterial

        this.wheelFI.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD)
        this.wheelFI.parent = this.carBody

        this.wheelFO = this.wheelFI.createInstance('FO')
        this.wheelFO.parent = this.carBody
        this.wheelFO.position = new BABYLON.Vector3(-4.5, -2, 2.8)

        this.wheelRI = this.wheelFI.createInstance('RI')
        this.wheelRI.parent = this.carBody
        this.wheelRI.position = new BABYLON.Vector3(2.5, -2, -2.8)

        this.wheelRO = this.wheelFI.createInstance('RO')
        this.wheelRO.parent = this.carBody
        this.wheelRO.position = new BABYLON.Vector3(2.5, -2, 2.8)

        this.wheelFI.position = new BABYLON.Vector3(-4.5, -2, -2.8)
    }

    private _rotateWheels(): void {
        this.scene.registerAfterRender(function () {
            this.wheelFI.rotate(BABYLON.Axis.Z, Math.PI / 64, BABYLON.Space.WORLD)
            this.wheelFO.rotate(BABYLON.Axis.Z, Math.PI / 64, BABYLON.Space.WORLD)
            this.wheelRI.rotate(BABYLON.Axis.Z, Math.PI / 64, BABYLON.Space.WORLD)
            this.wheelRO.rotate(BABYLON.Axis.Z, Math.PI / 64, BABYLON.Space.WORLD)
        })
    }
}
