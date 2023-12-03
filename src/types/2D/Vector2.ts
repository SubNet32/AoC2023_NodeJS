import { Point2D } from './types2D'

export default class Vector2 implements Point2D {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public static FromPoint = (point: Point2D) => new Vector2(point.x, point.y)
  public static Left = (amount?: number) => new Vector2(-(amount ?? 1), 0)
  public static Right = (amount?: number) => new Vector2(amount ?? 1, 0)
  public static Up = (amount?: number) => new Vector2(0, amount ?? 1)
  public static Down = (amount?: number) => new Vector2(0, -(amount ?? 1))

  public add(vector: Point2D) {
    this.x += vector.x
    this.y += vector.y
    return this
  }

  public static Add(vectorA: Point2D, vectorB: Point2D) {
    return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y)
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

  public toString() {
    return `(${this.x};${this.y})`
  }
}
