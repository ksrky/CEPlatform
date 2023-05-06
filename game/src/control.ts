import { Controller, PurePursuit } from './control/models'
import { Path } from './control/path'
import { Vehicle } from './control/vehicle'
import { ControlInput } from './control/types'
import { Pos } from './position'
import { Parameter } from './types/parameter'

export const algorithmChoices: {
    id: string
    discription: string
    params: { id: string; param: Parameter; discription: string }[]
}[] = [
    {
        id: 'Pure pursuit',
        discription: 'Only the steering angle is controlled and the velocity is constant.',
        params: [
            { id: 'Kdd', param: new Parameter(0, 1, 0.5), discription: '' },
            {
                id: 'minLA',
                param: new Parameter(1, 5, 3),
                discription: 'Minimum look ahead distance',
            },
            {
                id: 'maxLA',
                param: new Parameter(5, 20, 10),
                discription: 'Maximum look ahead distance',
            },
            {
                id: 'targetSpeed',
                param: new Parameter(0.1, 20, 12),
                discription: 'Target vehicle speed',
            },
        ],
    },
]

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

    private _update({ acc, steer }: ControlInput): void {
        this.vehicle.pos.x += this.vehicle.velocity * Math.cos(this.vehicle.heading) * this._dt
        this.vehicle.pos.y += this.vehicle.velocity * Math.sin(this.vehicle.heading) * this._dt
        const angVel = (this.vehicle.velocity * Math.tan(steer)) / this.vehicle.wheelBase
        this.vehicle.heading = this.vehicle.heading + angVel * this._dt
        this.vehicle.velocity += acc * this._dt
    }

    public calculate(path: Path): [number, number] {
        const inp: ControlInput = this._controller.getControl(
            path.waypoints,
            this.vehicle.velocity,
            this.vehicle.wheelBase,
            this._dt
        )
        this._update(inp)
        this._trajectory.push(this.vehicle.pos)
        this._velocities.push(this.vehicle.velocity)
        return [inp.steer, inp.acc]
    }
}
