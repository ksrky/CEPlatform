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
    public wheel_base: number
    public mass: number

    constructor(x = 0, y = 0, v = 0) {
        this.pos = new Pos(x, y)
        this.heading = 0
        this.velocity = v
        this.wheel_base = 2
        this.mass = 100
    }
}
