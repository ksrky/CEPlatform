import { Pos } from '../position'

export interface Controller {
    /**
     * Controls the steering angle and the acceleration of the vehicle
     * @param waypoints Waypoints transformed so that the vehicle is oriented in the positive X-axis at the origin
     * @param velocity Velocity of the vehicle
     * @param wheeBase Wheel base of the vehicle
     * @return dictionary that contains the steering angle and the acceleration
     */
    getControl(
        waypoints: Pos[],
        velocity: number,
        wheelBase: number
    ): { steer: number; acc: number }
}

/**
 * Pure pursuit algorithm.
 * @param Kdd Product of Kdd and vehicle velocity is look ahead distance
 * @param minLA Minimum look ahead distance
 * @param maxLA Maximum look ahead distance
 */
export class PurePursuit implements Controller {
    private _Kdd: number
    private _minLA: number
    private _maxLA: number

    constructor(Kdd = 0.5, minLA = 3, maxLA = 10) {
        this._Kdd = Kdd
        this._minLA = minLA
        this._maxLA = maxLA
    }

    private calcIntersection(
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

    private getTargetPoint(look_ahead: number, waypoints: Pos[]): Pos {
        let intersections: Pos[] = []
        for (let i = 0; i < waypoints.length - 1; i++) {
            const wp1 = waypoints[i]
            const wp2 = waypoints[i + 1]
            intersections = intersections.concat(this.calcIntersection(look_ahead, wp1, wp2))
        }
        const filtered = intersections.filter((wp) => wp.x > 0)
        if (filtered.length > 0) return filtered[0]
        else throw new Error('No intersections')
    }

    public getControl(
        waypoints: Pos[],
        velocity: number,
        wheelBase: number
    ): { steer: number; acc: number } {
        const lookAhead: number = this._Kdd * velocity //Math.max(this._minLA, Math.min(this._maxLA, this._Kdd * velocity))

        const trackPoint: Pos = this.getTargetPoint(lookAhead, waypoints)
        const alpha: number = Math.atan2(trackPoint.y, trackPoint.x)
        const steer: number = Math.atan((2 * wheelBase * Math.sin(alpha)) / lookAhead)
        return { steer, acc: 0 }
    }
}
