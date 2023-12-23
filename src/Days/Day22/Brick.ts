import { Cube } from '../../types/3D/Cube'
import Vector3 from '../../types/3D/Vector3'
import { Point3D } from '../../types/3D/types3D'

export class Brick extends Cube {
  public id: string
  public restsOnBricks: Brick[] = []
  public supportedBricks: Brick[] = []

  constructor(start: Point3D, end: Point3D, id: string) {
    super(Vector3.FromPoint(start), Vector3.FromPoint(end))
    this.id = id
  }
}
