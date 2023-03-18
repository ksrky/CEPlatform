import { Vehicle } from './vehicle'

export class Track {
    public n_points = 200
    public waypoints : {x:number, y:number}[]
    
    constructor() {
        this._generatePath()
    }

    private _generatePath() {
        const n = this.n_points
        const r = 50
        for (let i = 0; i < n + 1; i++) {
            this.waypoints.push(
                {x:(r + (r / 5) * Math.sin((8 * i * Math.PI) / n)) *
                        Math.cos((2 * i * Math.PI) / n),
                y:(r + (r / 10) * Math.sin((6 * i * Math.PI) / n)) *
                        Math.sin((2 * i * Math.PI) / n)})
            
        }
    }

    public getStartPose() {
        const {x, y} = this.waypoints[0] 
        const theta = Math.atan2(this.waypoints[1].y-y, this.waypoints[1].x-x)
        return [x, y, theta]
    }

    public getVehiclePath(vehicle : Vehicle) {
        const waypoints = this.waypoints.map(wp => {
            const x = wp.x - vehicle.location.x
            const y = wp.y - vehicle.location.y
            const [c, s] = [Math.cos(vehicle.heading), Math.sin(vehicle.heading)]
            return {x: x*c + y*s, y: -x*s + y*c}
        })
        return waypoints
    }
}