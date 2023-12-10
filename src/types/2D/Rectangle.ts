import Vector2 from './Vector2'
import { Point2D } from './types2D'

export interface IRectangle {
  start: Point2D
  end: Point2D
}

export class Rectangle implements IRectangle {
  public start: Vector2
  public end: Vector2

  constructor(start: Point2D, end: Point2D) {
    this.start = Vector2.FromPoint(start)
    this.end = Vector2.FromPoint(end)
  }

  public containsPoint(point: Point2D) {
    return !!point && point.x >= this.start.x && point.y >= this.start.y && point.x <= this.end.x && point.y <= this.end.y
  }

  public grow(amount: number = 1) {
    this.start.add({ x: -amount, y: -amount })
    this.end.add({ x: amount, y: amount })
    return this
  }

  public getAllContainedPoints() {
    const points: Point2D[] = []
    for (let x = this.start.x; x <= this.end.x; x++) {
      for (let y = this.start.y; y <= this.end.y; y++) {
        points.push({ x, y })
      }
    }
    return points
  }

  public intersects(rect: IRectangle) {
    const noIntersection = this.start.x > rect.end.x || this.end.x < rect.start.x || this.start.y > rect.end.y || this.end.y < rect.start.y
    return !noIntersection
  }

  public static getBoundariesFromPoints(points: Point2D[]) {
    const minX = Math.min(...points.map((p) => p.x))
    const minY = Math.min(...points.map((p) => p.y))
    const maxX = Math.max(...points.map((p) => p.x))
    const maxY = Math.max(...points.map((p) => p.y))
    return new Rectangle({ x: minX, y: minY }, { x: maxX, y: maxY })
  }
}
