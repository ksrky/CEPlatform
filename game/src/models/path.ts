import { Vehicle } from './vehicle'
import { Pos } from './position'

export class Path {
    public waypoints : Pos[] // sorted in the direction of travel
    
    constructor(waypoints) {
        this.waypoints = waypoints
    }

    public getStartPose() : [Pos, number] {
        const wp = this.waypoints[0]
        const {x, y} = this.waypoints[1].centering(wp)
        const theta = Math.atan2(x, y)
        return [wp, theta]
    }

    public getVehiclePath(vehicle : Vehicle) : Pos[] {
        let waypoints : Pos[] = this.waypoints.map(wp => wp.centering(vehicle.pos).rotate(vehicle.heading))
        const idx = waypoints.findIndex(wp => wp.x > -5)
        waypoints = waypoints.slice(idx)
        if (waypoints) {
            return waypoints
        } else {
            throw new Error('Vehicle is too far from path')
        }
    }
}