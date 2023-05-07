import { algorithmChoices } from './control'

export class Config {
    public track_id: string
    public num_loop: number
    public algorithm: {
        id: string
        params: { [key: string]: number }
    }
    public control_dt: number
    public vehicle: {
        mass: number
        initial_speed: number
        minimum_speed: number
        maximum_speed: number
        left_steering_angle_range: number
        right_steering_angle_range: number
        wheel_base: number
    }

    private _changed: boolean

    constructor(algNum = 0) {
        this.track_id = 'normal'
        this.num_loop = 3
        this.algorithm = {
            id: algorithmChoices[algNum].id,
            params: Object.fromEntries(
                algorithmChoices[algNum].params.map((obj) => [obj.id, obj.param.value])
            ),
        }
        this.control_dt = 0.05
        this.vehicle = {
            mass: 100,
            initial_speed: 0,
            minimum_speed: 0.1,
            maximum_speed: 20,
            left_steering_angle_range: 30,
            right_steering_angle_range: 30,
            wheel_base: 2,
        }
        this._changed = false
    }

    get changed() {
        return this._changed
    }
    set changed(b: boolean) {
        this._changed = b
    }
}
