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

  public inRange(number: number) {
    return number >= this.start && number <= this.end
  }

  public intersects(range: Range) {
    return this.inRange(range.start) || this.inRange(range.end) || range.inRange(this.start) || this.inRange(this.end)
  }

  public union(range: Range) {
    if (!this.intersects(range)) return null
    return new Range(Math.min(this.start, range.start), Math.max(this.end, range.end))
  }
}
