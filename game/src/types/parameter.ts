/**
 * Parameter
 */
export class Parameter {
    public value: number
    private _minValue: number
    private _maxValue: number

    /**
     * Parameter
     * @param value
     * @param minValue
     * @param maxValue
     */
    constructor(minValue: number, maxValue: number, value: number) {
        this._minValue = minValue
        this._maxValue = maxValue
        this.setValue(value)
    }

    public setValue(value: number): void {
        this.value = Math.max(this._minValue, Math.min(this._maxValue, value))
    }

    public setMinValue(): void {
        this.value = this._minValue
    }

    public setMaxValue(): void {
        this.value = this._maxValue
    }
}
