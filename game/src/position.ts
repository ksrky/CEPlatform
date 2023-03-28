import * as BABYLON from '@babylonjs/core'

export class Pos {
    public x : number
    public y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public norm() : number {
        return Math.sqrt(this.x * this.x + this.y + this.y)
    }

    public centering(offset : Pos) : Pos {
        /**
         * substract offset from its position
         * @param offset
         * @return position
         */
        return new Pos(this.x-offset.x, this.y-offset.y)
    }

    public rotate(theta: number) : Pos {
        const [c, s] = [Math.cos(theta), Math.sin(theta)]
        return new Pos(this.x*c - this.y*s, this.x*s + this.y*c)
    }

    public toVector3() : BABYLON.Vector3 {
        return new BABYLON.Vector3(this.x, 0, this.y)
    }
}

export function vector3toPos(v : BABYLON.Vector3){
    return new Pos(v.x, v.z)
}