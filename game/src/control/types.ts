import { Pos } from '../position'

/**
 * State vector
 */
export type State = { waypoints: Pos[]; velocity: number }

/**
 * Control input vector
 */
export type ControlInput = { steer: number; acc: number }
