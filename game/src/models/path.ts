import { Vehicle } from './vehicle'
import { Pos } from './position'

export class Path {
    public waypoints : Pos[] // sorted in the direction of travel
    
    constructor(waypoints : Pos[]) {
        this.waypoints = waypoints
    }

    public getStartPose() : [Pos, number] {
        const wp = this.waypoints[0]
        const {x, y} = this.waypoints[1].centering(wp)
        const theta = Math.atan2(x, y)
        return [wp, theta]
    }

    public getVehiclePath(vehicle : Vehicle) : Path {
        // console.log(this.waypoints)
        let waypoints : Pos[] = this.waypoints.map(wp => wp.centering(vehicle.pos))
        // console.log(waypoints)
        waypoints = waypoints.map(wp => wp.rotate(-vehicle.heading))
        // console.log(waypoints.slice(0, 5))
        const idx = waypoints.findIndex(wp => wp.x > -5)
        waypoints = waypoints.slice(idx)
        if (waypoints) {
            return new Path(waypoints)
        } else {
            throw new Error('Vehicle is too far from path')
        }
    }
}