import { Vehicle } from './vehicle'
import { Pos } from '../position'

/**
 * Abstract path model
 * @param waypoints Array of positions for a vehicle to follow
 */
export class Path {
    /**
     * Array of positions that sorted in the direction of travel.
     */
    public waypoints: Pos[]
    private static readonly VEHICLE_DIST_THRESH: number = -5

    constructor(waypoints: Pos[]) {
        this.waypoints = waypoints
    }

    /**
     * Get initial position and direction of the path
     * @returns The position (x, y) and the direction (radian)
     */
    public getStartPose(): [Pos, number] {
        const wp = this.waypoints[0]
        const { x, y } = this.waypoints[1].centering(wp)
        const theta = Math.atan2(x, y)
        return [wp, theta]
    }

    /**
     * Transpose waypoints so that the vehicle is centered.
     * If the vehicle is too far from the closest waypoints, it throws an exception.
     * @param vehicle Vehicle model
     * @returns Path model or exception
     */
    public getVehiclePath(vehicle: Vehicle): Path {
        let waypoints: Pos[] = this.waypoints.map((wp) => wp.centering(vehicle.pos))
        waypoints = waypoints.map((wp) => wp.rotate(-vehicle.heading))
        const idx = waypoints.findIndex((wp) => wp.x > Path.VEHICLE_DIST_THRESH)
        waypoints = waypoints.slice(idx)
        if (waypoints) {
            return new Path(waypoints)
        } else {
            throw new Error('Vehicle is too far from path')
        }
    }
}
