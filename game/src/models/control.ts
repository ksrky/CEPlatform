import { Track } from './track'
import { Vehicle } from './vehicle'

export class Control {
    private _vehicle : Vehicle
    private _track : Track
    private _dt : number

    private _trajectory : {x: number, y: number}[]

    constructor() {
        this._vehicle = new Vehicle()
        this._track = new Track()
        this._dt = 0.01
    }

    public calculate() {
        const waypoints = this._track.getVehiclePath(this._vehicle)
        const delta = 0
        const acc = 0
        this._vehicle.update(acc, delta, this._dt)
        this._trajectory.push(this._vehicle.location)
    }
}