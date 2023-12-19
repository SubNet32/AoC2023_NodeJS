export interface IRange {
  start: number
  end: number
}

export class Range implements IRange {
  public start: number = 0
  public end: number = 0

  constructor(start: number, end: number) {
    this.start = start
    this.end = end
    if (end < start) throw new Error(`Invalid Range. '${start}' - '${end}'`)
  }

  public static FromRange(range: IRange) {
    return new Range(range.start, range.end)
  }

  public static FromNumbers(start: number, end: number) {
    if (end < start) return null
    return new Range(start, end)
  }

  public inRange(number: number) {
    return number >= this.start && number <= this.end
  }

  public intersects(range: Range) {
    return this.inRange(range.start) || this.inRange(range.end) || range.inRange(this.start) || range.inRange(this.end)
  }

  public intersection(range: Range) {
    if (!this.intersects(range)) return null
    return new Range(Math.max(this.start, range.start), Math.min(this.end, range.end))
  }

  public offset(offset: number) {
    this.start += offset
    this.end += offset
    return this
  }

  public cut(range: Range) {
    if (!this.intersects(range)) return [Range.FromRange(this)]
    const result: Range[] = []
    if (this.start < range.start) {
      result.push(new Range(this.start, range.start - 1))
    }
    if (this.end > range.end) {
      result.push(new Range(range.end + 1, this.end))
    }
    return result
  }

  public size() {
    return this.end - this.start + 1
  }

  public toString() {
    return `${this.start} - ${this.end}`
  }
}
