import { Path } from './control/path'
import { Vehicle } from './control/vehicle'
import { Pos } from './position'

export class Control {
    public vehicle : Vehicle 
    private _dt : number

    private _trajectory : Pos[]
    private _velocities : number[]

    constructor(dt : number) {
        this.vehicle = new Vehicle() 
        this._dt = dt

        this._trajectory = []
        this._velocities = []
    }

    public calculate(path : Path) {
        const controller = new PurePursuit()
        const delta = controller.get_control(path.waypoints, this.vehicle.velocity, this.vehicle.wheel_base)
        const acc = 0
        // this.vehicle.update(acc, delta, this._dt)
        this._trajectory.push(this.vehicle.pos)
        this._velocities.push(this.vehicle.velocity)
        return [delta, acc]
    }
}

class PurePursuit {
    public Kdd : number 

    constructor(Kdd=0.5) {
        this.Kdd = Kdd
    }

    private calc_intersection(radius: number, pt1: Pos, pt2: Pos, full_line=false, tangent_tol=1e-9) : Pos[] {
        const {x:dx, y:dy} = pt2.centering(pt1)
        const dr = (dx**2 + dy**2)**.5
        const D = pt1.x * pt2.y - pt2.x * pt1.y
        const discriminant = radius**2 * dr**2 - D**2
        
        if (discriminant < 0) {
            return []
        } else {
            let intersections : Pos[] = [1, -1].map(i =>
                new Pos((D * dy + i * (dy<0 ? -1 : 1) * dx * discriminant**.5) / dr**2,
                    (-D * dx + i * Math.abs(dy) * discriminant**.5) / dr**2))
            if(!full_line) {
                intersections = intersections.filter(({x, y}) => {
                    let t : number
                    if (Math.abs(dx) > Math.abs(dy)) {
                        t = (x - pt1.x) / dx
                    } else {
                        t = (y - pt1.y) / dy
                    }
                    return 0 <= t && t <= 1
                })
            }
            if(intersections.length == 2 && Math.abs(discriminant) <= tangent_tol){
                return [intersections[0]]
            } else {
                return intersections
            }
        }
    }

    private get_target_point(look_ahead : number, waypoints : Pos[]) : Pos {
        let intersections : Pos[] = []
        for(let i=0; i<waypoints.length-1; i++) {
            const wp1 = waypoints[i]
            const wp2 = waypoints[i+1]
            intersections = intersections.concat(this.calc_intersection(look_ahead, wp1, wp2))
        }
        const filtered = intersections.filter(wp => wp.x > 0)
        if(filtered.length > 0) return filtered[0]
        else throw new Error('No intersections')
    }

    public get_control(waypoints: Pos[], velocity: number, wheel_base: number) : number {
        const look_ahead : number = this.Kdd * velocity

        const track_point : Pos = this.get_target_point(look_ahead, waypoints)
        const alpha : number = Math.atan2(track_point.y, track_point.x)
        const steer : number = Math.atan(2*wheel_base*Math.sin(alpha) / look_ahead)
        return steer
    }
}