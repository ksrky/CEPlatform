import { Path } from './path'
import { Vehicle } from './vehicle'
import { Pos } from './position'

export class Control {
    public vehicle : Vehicle 
    private _dt : number

    private _trajectory : Pos[]
    private _velocities : number[]

    constructor(dt : number) {
        this.vehicle = new Vehicle() 
        this._dt = dt
    }

    public calculate(path : Path) {
        const controller = new PurePursuit()
        const delta = controller.get_control(path.waypoints, this.vehicle.velocity, this.vehicle.wheel_base)
        const acc = 0
        this.vehicle.update(acc, delta, this._dt)
        this._trajectory.push(this.vehicle.pos)
        this._velocities.push(this.vehicle.velocity)
    }
}

class PurePursuit {
    public Kdd : number 

    constructor(Kdd=0.1) {
        this.Kdd = Kdd
    }

    private calc_intersection(center: Pos, radius: number, pt1: Pos, pt2: Pos) : Pos[] {
        pt1 = pt1.centering(center)
        pt2 = pt2.centering(center)
        const dr = pt2.centering(pt1).norm()
        const D = pt1.x * pt2.y - pt2.x * pt1.y
        const discriminant = radius**2 * dr**2 + D**2
        
        if (discriminant < 0) {
            return []
        } else {
            return []
        }
    }

    private get_target_point(look_ahead, waypoints) : Pos {
        const intersections : Pos[] = []
        for(let i=0; i<waypoints.length()-1; i++) {
            const wp1 = waypoints[i]
            const wp2 = waypoints[i+1]
            intersections.concat(this.calc_intersection(new Pos(0, 0), look_ahead, wp1, wp2))
        } 
        const filtered = intersections.filter(wp => wp.x > 0)
        if(filtered) return filtered[0]
        else return null
    }

    public get_control(waypoints: Pos[], velocity: number, wheel_base: number) : number {
        const look_ahead : number = this.Kdd * velocity

        const track_point : Pos = this.get_target_point(look_ahead, waypoints)
        const alpha : number = Math.atan2(track_point.y, track_point.x)
        const steer : number = Math.atan(2*wheel_base*Math.sin(alpha) / look_ahead)
        return steer
    }
}