import { Pos } from '../position'

/**
 * Abstract vehicle model
 * @param x default is 0.
 * @param y default is 0.
 * @param v velocity. default is 0.
 */
export class Vehicle {
    public pos: Pos
    public heading: number
    public velocity: number
    public wheelBase: number
    public mass: number

    constructor(config: { wheel_base: number; mass: number }) {
        this.pos = new Pos(0, 0)
        this.heading = 0
        this.velocity = 0
        this.wheelBase = config.wheel_base
        this.mass = config.mass
    }
}
