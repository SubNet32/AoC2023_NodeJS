import { Rectangle } from './Rectangle'
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
  public static Zero = new Vector2(0, 0)

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
    Vector2.Normalize(this)
    return this
  }

  public static Normalize(vector: Vector2) {
    vector.x = Math.sign(vector.x)
    vector.y = Math.sign(vector.y)
    return vector
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

  public static SortByY(a: Point2D, b: Point2D) {
    return a.y - b.y
  }

  public static SortByX(a: Point2D, b: Point2D) {
    return a.x - b.x
  }

  public static Sort(a: Point2D, b: Point2D) {
    const r = a.x - b.x
    if (r) return r
    return a.y - b.y
  }

  public static GetBounds(vectors: Point2D[]) {
    let limits: (number | null)[] = [null, null, null, null]
    vectors.forEach((v) => {
      if (limits[0] === null || v.x < limits[0]) limits[0] = v.x
      if (limits[1] === null || v.y < limits[1]) limits[1] = v.y
      if (limits[2] === null || v.x > limits[2]) limits[2] = v.x
      if (limits[3] === null || v.y > limits[3]) limits[3] = v.y
    })
    const bounds = new Rectangle({ x: limits[0] ?? 0, y: limits[1] ?? 0 }, { x: limits[2] ?? 0, y: limits[3] ?? 0 })
  }
}
