import { Pos } from '../position'

export interface Controller {
    get_control(
        waypoints: Pos[],
        velocity: number,
        wheel_base: number
    ): { steer: number; acc: number }
    /**
     * Controls steering angle and acceleration of the vehicle
     * @param waypoints Waypoints transformed so that the vehicle is oriented in the positive X-axis at the origin
     * @param velocity Velocity of the vehicle
     * @param wheel_base Wheel base of the vehicle
     * @return dictionary that contains steering angle (steer) and acceleration(acc)
     */
}

export class PurePursuit implements Controller {
    /**
     * Pure pursuit algorithm.
     * @param Kdd Product of Kdd and vehicle velocity is look ahead distance
     */
    public Kdd: number

    constructor(Kdd = 0.5) {
        this.Kdd = Kdd
    }

    private calc_intersection(
        radius: number,
        pt1: Pos,
        pt2: Pos,
        full_line = false,
        tangent_tol = 1e-9
    ): Pos[] {
        const { x: dx, y: dy } = pt2.centering(pt1)
        const dr = (dx ** 2 + dy ** 2) ** 0.5
        const D = pt1.x * pt2.y - pt2.x * pt1.y
        const discriminant = radius ** 2 * dr ** 2 - D ** 2

        if (discriminant < 0) {
            return []
        } else {
            let intersections: Pos[] = [1, -1].map(
                (i) =>
                    new Pos(
                        (D * dy + i * (dy < 0 ? -1 : 1) * dx * discriminant ** 0.5) / dr ** 2,
                        (-D * dx + i * Math.abs(dy) * discriminant ** 0.5) / dr ** 2
                    )
            )
            if (!full_line) {
                intersections = intersections.filter(({ x, y }) => {
                    const t = Math.abs(dx) > Math.abs(dy) ? (x - pt1.x) / dx : (y - pt1.y) / dy
                    return 0 <= t && t <= 1
                })
            }
            if (intersections.length == 2 && Math.abs(discriminant) <= tangent_tol) {
                return [intersections[0]]
            } else {
                return intersections
            }
        }
    }

    private get_target_point(look_ahead: number, waypoints: Pos[]): Pos {
        let intersections: Pos[] = []
        for (let i = 0; i < waypoints.length - 1; i++) {
            const wp1 = waypoints[i]
            const wp2 = waypoints[i + 1]
            intersections = intersections.concat(this.calc_intersection(look_ahead, wp1, wp2))
        }
        const filtered = intersections.filter((wp) => wp.x > 0)
        if (filtered.length > 0) return filtered[0]
        else throw new Error('No intersections')
    }

    public get_control(
        waypoints: Pos[],
        velocity: number,
        wheel_base: number
    ): { steer: number; acc: number } {
        const look_ahead: number = this.Kdd * velocity

        const track_point: Pos = this.get_target_point(look_ahead, waypoints)
        const alpha: number = Math.atan2(track_point.y, track_point.x)
        const steer: number = Math.atan((2 * wheel_base * Math.sin(alpha)) / look_ahead)
        return { steer, acc: 0 }
    }
}
