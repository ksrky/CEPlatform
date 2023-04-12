import { Pos } from '../position'

export type State = { waypoints: Pos[]; velocity: number }
export type ControlInput = { steer: number; acc: number }
