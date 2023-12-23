import Vector3 from './Vector3'
import { Point3D } from './types3D'

export interface ICube {
  start: Point3D
  end: Point3D
}

export class Cube implements ICube {
  public start: Vector3
  public end: Vector3

  constructor(start: Point3D, end: Point3D) {
    this.start = Vector3.Min(start, end)
    this.end = Vector3.Max(start, end)
  }

  public static FromCube(cube: ICube) {
    return new Cube(Vector3.FromPoint(cube.start), Vector3.FromPoint(cube.end))
  }

  public containsPoint(point: Point3D) {
    return !!point && point.x >= this.start.x && point.y >= this.start.y && point.x <= this.end.x && point.y <= this.end.y
  }

  public grow(amount: number = 1) {
    this.start.add({ x: -amount, y: -amount, z: -amount })
    this.end.add({ x: amount, y: amount, z: amount })
    return this
  }

  public getAllContainedPoints() {
    const points: Point3D[] = []
    for (let x = this.start.x; x <= this.end.x; x++) {
      for (let y = this.start.y; y <= this.end.y; y++) {
        for (let z = this.start.z; z <= this.end.z; z++) {
          points.push({ x, y, z })
        }
      }
    }
    return points
  }

  public move(by: Point3D) {
    this.start.add(by)
    this.end.add(by)
    return this
  }

  public intersects(rect: ICube) {
    const noIntersection = this.start.x > rect.end.x || this.end.x < rect.start.x || this.start.y > rect.end.y || this.end.y < rect.start.y || this.start.z > rect.end.z || this.end.z < rect.start.z
    return !noIntersection
  }

  public toString() {
    return `${this.start.toString()} ~ ${this.end.toString()}`
  }
}
