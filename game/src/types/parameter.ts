import { limit } from '../utils'

/**
 * Parameter
 */
export class Parameter {
    private _value: number
    public min: number
    public max: number

    /**
     * Parameter
     * @param value
     * @param minVal
     * @param maxVal
     */
    constructor(minVal: number, maxVal: number, value: number) {
        this.min = minVal
        this.max = maxVal
        this.value = value
    }

    get value(): number {
        return this._value
    }

    set value(value: number) {
        this._value = limit(value, this.min, this.max)
    }

    public setMinValue(): void {
        this.value = this.min
    }

    public setMaxValue(): void {
        this.value = this.max
    }
}
