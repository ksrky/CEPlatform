import { Controller, PurePursuit } from './control/models'
import { Path } from './control/path'
import { Vehicle } from './control/vehicle'
import { ControlInput } from './control/types'
import { Pos } from './position'

export class Control {
    public vehicle: Vehicle
    private _controller: Controller
    private _dt: number

    private _trajectory: Pos[]
    private _velocities: number[]

    constructor(dt: number) {
        this.vehicle = new Vehicle()
        this._controller = new PurePursuit()
        this._dt = dt

        this._trajectory = []
        this._velocities = []
    }

    private _update({ acc, steer }: ControlInput) {
        this.vehicle.pos.x += this.vehicle.velocity * Math.cos(this.vehicle.heading) * this._dt
        this.vehicle.pos.y += this.vehicle.velocity * Math.sin(this.vehicle.heading) * this._dt
        const ang_vel = (this.vehicle.velocity * Math.tan(steer)) / this.vehicle.wheel_base
        this.vehicle.heading = this.vehicle.heading + ang_vel * this._dt
        this.vehicle.velocity += acc * this._dt
    }

    public calculate(path: Path) {
        const inp: ControlInput = this._controller.getControl(
            path.waypoints,
            this.vehicle.velocity,
            this.vehicle.wheel_base
        )
        this._update(inp)
        this._trajectory.push(this.vehicle.pos)
        this._velocities.push(this.vehicle.velocity)
        return [inp.steer, inp.acc]
    }
}
