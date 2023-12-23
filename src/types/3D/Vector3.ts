import { Rectangle } from '../2D/Rectangle'
import { Point3D } from './types3D'

const pointAsStringSeparator = '|'

export default class Vector3 implements Point3D {
  public x: number
  public y: number
  public z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  public static FromPoint = (point: Point3D) => new Vector3(point.x, point.y, point.z)
  public static FromString = (point: string, separator?: string) => {
    const [x, y, z] = point.split(separator ?? pointAsStringSeparator).map(Number)
    return new Vector3(x, y, z)
  }
  public static LeftX = new Vector3(-1, 0, 0)
  public static RightX = new Vector3(1, 0, 0)
  public static LeftY = new Vector3(0, -1, 0)
  public static RightY = new Vector3(0, 1, 0)
  public static Up = new Vector3(0, 0, 1)
  public static Down = new Vector3(0, 0, -1)
  public static Zero = new Vector3(0, 0, 0)

  public add(vector: Point3D) {
    this.x += vector.x
    this.y += vector.y
    this.z += vector.z
    return this
  }

  public static Add(vectorA: Point3D, vectorB: Point3D) {
    return new Vector3(vectorA.x + vectorB.x, vectorA.y + vectorB.y, vectorA.z + vectorB.z)
  }

  public sub(vector: Point3D) {
    this.x -= vector.x
    this.y -= vector.y
    this.z -= vector.z
    return this
  }

  public static Sub(vectorA: Point3D, vectorB: Point3D) {
    return new Vector3(vectorA.x - vectorB.x, vectorA.y - vectorB.y, vectorA.z - vectorB.z)
  }

  public normalize() {
    Vector3.Normalize(this)
    return this
  }

  public static Normalize(vector: Vector3) {
    vector.x = Math.sign(vector.x)
    vector.y = Math.sign(vector.y)
    vector.z = Math.sign(vector.z)
    return vector
  }

  public length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
  }

  public lineDistanceTo(vector: Point3D) {
    return Math.abs(this.x - vector.x) + Math.abs(this.y - vector.y) + Math.abs(this.z - vector.z)
  }

  public equals(point: Point3D) {
    return this.x === point.x && this.y === point.y && this.z === point.z
  }

  public static equals(a: Point3D, b: Point3D) {
    return a.x === b.x && a.y === b.y && a.z === b.z
  }

  public toString() {
    return Vector3.ToString(this)
  }

  public static ToString(point: Point3D) {
    return `${point.x}${pointAsStringSeparator}${point.y}${pointAsStringSeparator}${point.z}`
  }

  public inverse() {
    this.x *= -1
    this.y *= -1
    this.z *= -1
    return this
  }

  public static multiply(vector: Point3D, factor: number) {
    vector.x *= factor
    vector.y *= factor
    vector.z *= factor
    return vector
  }

  public static Min(...vector: Point3D[]) {
    let minX: number | null = null
    let minY: number | null = null
    let minZ: number | null = null

    vector.forEach((v) => {
      if (minX === null || v.x < minX) minX = v.x
      if (minY === null || v.y < minY) minY = v.y
      if (minZ === null || v.z < minZ) minZ = v.z
    })

    return new Vector3(minX ?? 0, minY ?? 0, minZ ?? 0)
  }

  public static Max(...vector: Point3D[]) {
    let maxX: number | null = null
    let maxY: number | null = null
    let maxZ: number | null = null

    vector.forEach((v) => {
      if (maxX === null || v.x > maxX) maxX = v.x
      if (maxY === null || v.y > maxY) maxY = v.y
      if (maxZ === null || v.z > maxZ) maxZ = v.z
    })

    return new Vector3(maxX ?? 0, maxY ?? 0, maxZ ?? 0)
  }
}
