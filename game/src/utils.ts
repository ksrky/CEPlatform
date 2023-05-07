/**
 * Limit the value in the given range.
 * @param value The value to limit
 * @param minVal Minimum value of the range.
 * @param maxVal Maximum value of the range
 * @returns `minVal` if `value` < `minVal` and `maxVal` if `value` > `maxVal`. Otherwise, `value`.
 */
export function limit(value: number, minVal: number, maxVal: number): number {
    return Math.max(minVal, Math.min(maxVal, value))
}
