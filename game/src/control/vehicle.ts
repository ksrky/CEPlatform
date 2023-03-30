import {Pos} from '../position'

export class Vehicle {
    public pos: Pos
    public heading: number
    public velocity: number
    public wheel_base: number
    public mass: number

    constructor(x = 0, y = 0, v = 0) {
        this.pos = new Pos(x, y)
        this.heading = 0
        this.velocity = v
        this.wheel_base = 2
        this.mass = 100
    }

    private getHeading(theta): number {
        return Math.atan2(Math.sin(theta), Math.cos(theta))
    }

    public set(x: number, y: number, v: number) {
        this.pos.x = x
        this.pos.y = y
        this.velocity = v
    }

    public update(acc: number, delta: number, dt: number) {
        this.pos.x += this.velocity * Math.cos(this.heading) * dt
        this.pos.y += this.velocity * Math.sin(this.heading) * dt
        const ang_vel = (this.velocity * Math.tan(delta)) / this.wheel_base
        this.heading = this.getHeading(this.heading + ang_vel * dt)
        this.velocity += acc * dt
    }
}
