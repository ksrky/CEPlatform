import { algorithmChoices } from './control'

export type Config = {
    track_id: string
    algorithm: {
        id: string
        params: { [key: string]: number }
    }
    control_dt: number
    vehicle: {
        mass: number
        initial_speed: number
        minimum_speed: number
        maximum_speed: number
        left_steering_angle_range: number
        right_steering_angle_range: number
        wheel_base: number
    }
}

export const defaultConfig: Config = {
    track_id: 'normal',
    algorithm: {
        id: algorithmChoices[0].id,
        params: Object.fromEntries(
            algorithmChoices[0].params.map((obj) => [obj.id, obj.param.value])
        ),
    },
    control_dt: 0.05,
    vehicle: {
        mass: 100,
        initial_speed: 0,
        minimum_speed: 0.1,
        maximum_speed: 20,
        left_steering_angle_range: 30,
        right_steering_angle_range: 30,
        wheel_base: 2,
    },
}
