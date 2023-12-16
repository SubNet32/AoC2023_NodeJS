import { IRectangle, Rectangle } from './Rectangle'
import Vector2 from './Vector2'
import { Point2D } from './types2D'

export class FieldMap<T> {
  public map: Map<string, T>
  public boundaries: Rectangle | undefined

  constructor(boundaries?: IRectangle, iterable?: Iterable<readonly [string, T]>) {
    if (boundaries) this.boundaries = new Rectangle(boundaries.start, boundaries.end)
    this.map = new Map<string, T>(iterable)
  }

  public addItem(point: Point2D, value: T) {
    this.map.set(Vector2.toString(point), value)
  }

  public addLine(startPoint: Point2D, endPoint: Point2D, value: T) {
    let current = new Vector2(startPoint.x, startPoint.y)
    this.addItem(current, value)
    let moveVector = current.subtract(endPoint).normalize()
    while (!current.equals(endPoint)) {
      current.add(moveVector)
      this.addItem(current, value)
    }
  }

  public getItem(point: Point2D): T | undefined {
    return this.map.get(Vector2.toString(point))
  }

  public getItems(points: Point2D[]): [Point2D, T | undefined][] {
    return points.map((point) => [point, this.map.get(Vector2.toString(point))])
  }

  public getAllItems(): [Point2D, T | undefined][] {
    return Array.from(this.map.entries()).map(([pos, value]) => [Vector2.FromString(pos), value])
  }

  public hasItem(point: Point2D) {
    return this.map.has(Vector2.toString(point))
  }

  public deleteItem(point: Point2D) {
    this.map.delete(Vector2.toString(point))
  }

  public static fromInput<TValue>(input: string[], valueProvider: (char: string, x: number, y: number) => TValue | undefined) {
    const inputMap = new FieldMap<TValue>({ start: { x: 0, y: 0 }, end: { x: input[0].length - 1, y: input.length - 1 } })
    input.forEach((line, y) => {
      Array.from(line).forEach((char, x) => {
        const value = valueProvider(char, x, y)
        if (value !== undefined) inputMap.addItem({ x, y }, value)
      })
    })
    return inputMap
  }

  public static fromVectorArray<T>(array: Vector2[], valueProvider: (element: Vector2, index: number) => T) {
    const map = new FieldMap<T>()
    array.forEach((vector, index) => map.addItem(vector, valueProvider(vector, index)))
    return map
  }

  public findFieldWithValue(value: T) {
    return Array.from(this.map.entries()).find(([_, fieldValue]) => fieldValue === value)
  }

  public findAllFieldsWithValue(value: T) {
    return Array.from(this.map.entries())
      .filter(([_, fieldValue]) => fieldValue === value)
      .map((q) => Vector2.FromString(q[0]))
  }

  public printField(valuePrinter?: (value: T | undefined | null, pos: Point2D) => string, inverseY?: boolean, window?: IRectangle) {
    let bounds = this.calcBounds()
    let printStrings: string[] = []
    let yBounds = { start: bounds.start.y, end: bounds.end.y }
    let xBounds = { start: bounds.start.x, end: bounds.end.x }
    if (window) {
      yBounds = { start: window.start.y, end: window.end.y }
      xBounds = { start: window.start.x, end: window.end.x }
    }
    for (let y = yBounds.start; y <= yBounds.end; y++) {
      let printsString = ''
      for (let x = xBounds.start; x <= xBounds.end; x++) {
        const item = this.getItem({ x, y })
        printsString += valuePrinter ? valuePrinter(item, { x, y }) : item?.toString()
      }
      printStrings.push(printsString)
    }
    if (inverseY) {
      printStrings.reverse()
    }
    printStrings.forEach((p) => console.log(p))
    console.log('')
  }

  public getMaximum() {
    let max: Point2D = { x: 0, y: 0 }
    Array.from(this.map.keys()).forEach((key) => {
      let point = Vector2.FromString(key)
      if (point.x > max.x) max.x = point.x
      if (point.y > max.y) max.y = point.y
    })
    return max
  }

  public calcBounds(overwriteBounds?: boolean): IRectangle {
    const bounds = Rectangle.getBoundariesFromPoints(Array.from(this.map.keys()).map((k) => Vector2.FromString(k)))
    if (overwriteBounds) {
      this.boundaries = bounds
      return this.boundaries
    }
    return bounds
  }

  public isInBounds(point: Point2D) {
    if (!this.boundaries) return false
    return !(point.x > this.boundaries.end.x || point.x < this.boundaries.start.x || point.y > this.boundaries.end.y || point.y < this.boundaries.start.y)
  }

  public toArray() {
    return Array.from(this.map.entries()).map(([pos, value]) => [Vector2.FromString(pos), value])
  }

  public removeItemsWithValue(value: T) {
    Array.from(this.map.entries()).forEach(([key, entryValue]) => {
      if (value === entryValue) this.map.delete(key)
    })
  }
}
