export class Vehicle {
    public location : {x: number, y: number}
    public heading : number
    public velocity : number
    public wheel_base : number
    public mass : number

    constructor(x = 0, y = 0, v = 0) {
        this.location = {x, y}
        this.heading = 0
        this.velocity = v
        this.wheel_base = 2
        this.mass = 100
    }

    private getHeading(theta){
        return Math.atan2(Math.sin(theta), Math.cos(theta))
    }

    public update(acc, delta, dt){
        this.location.x += this.velocity * Math.cos(this.heading) * dt
        this.location.y += this.velocity * Math.sin(this.heading) * dt
        const ang_vel = this.velocity * Math.tan(delta) / this.wheel_base
        this.heading = this.getHeading(this.heading + ang_vel * dt)
        const acc_eff = acc - this.velocity**2 * 0.001
        this.velocity += acc_eff * dt
    }
}