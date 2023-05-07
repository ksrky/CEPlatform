import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'

import { Vehicle } from './view/vehicle'
import { Track } from './view/track'
import { Path } from './control/path'
import { Control } from './control'
import { Pos } from './position'
import { Config } from './config'

export class Simulation {
    private _scene: Scene

    public time: number
    private static readonly SIMULATION_DELTA_TIME = 0.05
    public stop: boolean
    private _numLoop: number

    public vehicle: Vehicle
    private _track: Track
    private _nPoints: number
    private _dt: number
    public static readonly INITIAL_VEHICLE_POSITION: Vector3 = new Vector3(50, 0, 0)
    public static readonly INITIAL_VEHICLE_TILT: Vector3 = new Vector3(0, Math.PI / 2, 0)

    private _path: Path
    private _control: Control

    private _config: Config

    constructor(scene: Scene, config: Config) {
        this._scene = scene
        this._nPoints = 200
        this._dt = Simulation.SIMULATION_DELTA_TIME * 1
        this.time = 0
        this.stop = true
        this._numLoop = 0

        this._config = config
    }

    public async init(): Promise<void> {
        this._track = new Track(this._scene, this._nPoints, Simulation.INITIAL_VEHICLE_POSITION)

        this.vehicle = new Vehicle(this._scene, this._config)
        this.vehicle.root.position = Simulation.INITIAL_VEHICLE_POSITION
        this.vehicle.root.rotation.y = this._track.getStartPose()

        this._control = new Control(this._config)
    }

    public async reinit(): Promise<void> {
        this.vehicle
    }

    private _feedback(): void {
        const points: Pos[] = this._track.points.map(Pos.Vector3toPos)
        this._control.vehicle.pos = Pos.Vector3toPos(this.vehicle.root.position)
        this._control.vehicle.velocity = this.vehicle.velocity
        // Rotation around the Y-axis of the left-hand coordinate system is counterclockwise
        this._control.vehicle.heading = -this.vehicle.root.rotation.y
        this._path = new Path(points).getVehiclePath(this._control.vehicle)
    }

    public registerAnimation(): void {
        this._scene.registerAfterRender(() => {
            if (!this.stop) {
                this._feedback()
                const [delta, acc] = this._control.calculate(this._path)
                this.vehicle.rotateWheels(this.vehicle.root.rotation.y)
                // Rotation around the Y-axis of the left-hand coordinate system is counterclockwise
                this.vehicle.update(acc, -delta, this._dt)

                this.time += Simulation.SIMULATION_DELTA_TIME
            }
            this.vehicle.updateCamera()
        })
    }
}
