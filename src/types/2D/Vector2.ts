import { Point2D } from './types2D'

const pointAsStringSeparator = '|'

export default class Vector2 implements Point2D {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public static FromPoint = (point: Point2D) => new Vector2(point.x, point.y)
  public static FromString = (point: string) => {
    const [x, y] = point.split(pointAsStringSeparator).map(Number)
    return new Vector2(x, y)
  }
  public static Left = new Vector2(-1, 0)
  public static Right = new Vector2(1, 0)
  public static Up = new Vector2(0, 1)
  public static Down = new Vector2(0, -1)

  public add(vector: Point2D) {
    this.x += vector.x
    this.y += vector.y
    return this
  }

  public static Add(vectorA: Point2D, vectorB: Point2D) {
    return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y)
  }

  public static Sub(vectorA: Point2D, vectorB: Point2D) {
    return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y)
  }

  public subtract(vector: Point2D) {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }

  public normalize() {
    this.x = Math.sign(this.x)
    this.y = Math.sign(this.y)
    return this
  }

  public length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  public lineDistanceTo(vector: Point2D) {
    return Math.abs(this.x - vector.x) + Math.abs(this.y - vector.y)
  }

  public equals(point: Point2D) {
    return this.x === point.x && this.y === point.y
  }

  public static equals(a: Point2D, b: Point2D) {
    return a.x === b.x && a.y === b.y
  }

  public toString() {
    return Vector2.toString(this)
  }

  public static toString(point: Point2D) {
    return `${point.x}${pointAsStringSeparator}${point.y}`
  }

  public rotate(radians: number, round?: boolean) {
    const x = this.x
    const y = this.y
    this.x = x * Math.cos(radians) - y * Math.sin(radians)
    this.y = x * Math.sin(radians) + y * Math.cos(radians)
    if (round) {
      this.x = Math.round(this.x)
      this.y = Math.round(this.y)
    }
    return this
  }

  public inverse() {
    this.x *= -1
    this.y *= -1
    return this
  }
}
