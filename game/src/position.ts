import { Vector3 } from '@babylonjs/core/Maths/math'

/**
 * Abstract position model.
 * mapping from real world (left-handed 3D coordinate) to control space (right-handed 2D coordinate)
 * @param x
 * @param y
 */
export class Pos {
    public x: number
    public y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    /**
     * normalize vector
     */
    public norm(): number {
        return Math.sqrt(this.x * this.x + this.y + this.y)
    }

    /**
     * substract offset from its position
     * @param offset
     * @return position
     */
    public centering(offset: Pos): Pos {
        return new Pos(this.x - offset.x, this.y - offset.y)
    }

    /**
     * rotate vector
     * @param theta rotation angle (radian)
     */
    public rotate(theta: number): Pos {
        const [c, s] = [Math.cos(theta), Math.sin(theta)]
        return new Pos(this.x * c - this.y * s, this.x * s + this.y * c)
    }

    /**
     * transpose Pos to BABYLON.Vector3
     */
    public toVector3(): Vector3 {
        return new Vector3(this.x, 0, this.y)
    }
}

/**
 * transpose BABYLON.Vector3 to Pos
 * @param vec Babylon.js representation of vector
 */
export function vector3toPos(vec: Vector3) {
    return new Pos(vec.x, vec.z)
}
