export let configChanged: boolean = false

export type Config = {
    track_id: string
    algorithm: {
        id: string
        params: unknown
    }
    control_dt: number
    vehicle: {
        mass: number
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
        id: 'pure_pursuit',
        params: {
            Kdd: 0.8,
            minLA: 3,
            maxLA: 10,
        },
    },
    control_dt: 0.05,
    vehicle: {
        mass: 100,
        minimum_speed: 6,
        maximum_speed: 12,
        left_steering_angle_range: -30,
        right_steering_angle_range: 30,
        wheel_base: 2.5,
    },
}
