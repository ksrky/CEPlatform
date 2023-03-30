import { PurePursuit } from './control/models'
import { Path } from './control/path'
import { Vehicle } from './control/vehicle'
import { Pos } from './position'

export class Control {
    public vehicle: Vehicle
    private _dt: number

    private _trajectory: Pos[]
    private _velocities: number[]

    constructor(dt: number) {
        this.vehicle = new Vehicle()
        this._dt = dt

        this._trajectory = []
        this._velocities = []
    }

    public calculate(path: Path) {
        const controller = new PurePursuit()
        const { steer, acc } = controller.get_control(
            path.waypoints,
            this.vehicle.velocity,
            this.vehicle.wheel_base
        )
        this.vehicle.update(acc, steer, this._dt)
        this._trajectory.push(this.vehicle.pos)
        this._velocities.push(this.vehicle.velocity)
        return [steer, acc]
    }
}
