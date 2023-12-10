import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'
import { Point2D } from '../../types/2D/types2D'

type SupportedType = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S'
const typeDirections: [string, Vector2[]][] = [
  ['|', [Vector2.Up, Vector2.Down]],
  ['-', [Vector2.Left, Vector2.Right]],
  ['L', [Vector2.Down, Vector2.Right]],
  ['J', [Vector2.Down, Vector2.Left]],
  ['7', [Vector2.Up, Vector2.Left]],
  ['F', [Vector2.Up, Vector2.Right]],
  ['.', []],
  ['S', [Vector2.Up, Vector2.Down, Vector2.Left, Vector2.Right]],
]

export class Pipe {
  public type: SupportedType
  public isStart: boolean = false
  public position: Vector2
  public prev: Pipe | null = null
  public next: Pipe | null = null

  constructor(prev: Pipe | null, position: Vector2, map: FieldMap<string>) {
    this.type = this.getTypeFromPosition(position, map)
    if (this.type === 'S') this.isStart = true
    this.position = Vector2.FromPoint(position)
    this.prev = prev
    // console.log('New pipe segment', this.position, this.type)
  }

  public getTypeFromPosition(position: Vector2, map: FieldMap<string>) {
    return map.getItem(position) as SupportedType
  }

  public getDirectionFromType(type: SupportedType) {
    return typeDirections.find((t) => t[0] === type)?.[1] ?? []
  }

  public getNext() {
    if (!this.next) throw new Error('No Next')
    return this.next
  }

  private getPossiblePositionsFromPoint(position: Vector2, map: FieldMap<string>) {
    const type = this.getTypeFromPosition(position, map)
    const directions = this.getDirectionFromType(type)
    return directions.map((dir) => Vector2.FromPoint(position).add(dir))
  }

  private getPossibleNextPositions(position: Vector2, map: FieldMap<string>) {
    const possibleNextPositions = this.getPossiblePositionsFromPoint(position, map).filter((q) => !this.prev || !this.prev.position.equals(q))
    if (this.getTypeFromPosition(position, map) !== 'S') return possibleNextPositions

    return possibleNextPositions.filter((pos) => this.getPossiblePositionsFromPoint(pos, map).find((q) => q.equals(position)))
  }

  public getStartPipeFromThis(): Pipe {
    let item: Pipe = this
    while (!item.isStart) {
      if (!item.prev) throw new Error('No prev')
      item = item.prev
    }
    return item
  }

  public findNext(map: FieldMap<string>, inverse?: boolean) {
    if (this.next) return this.next
    const nextPositions = this.getPossibleNextPositions(this.position, map)

    if (nextPositions.length > 1 && this.type !== 'S') {
      throw new Error('Too many next positions found. This is not supposed to happen inside a loop')
    }
    const nextPosition = inverse ? nextPositions.pop() : nextPositions.shift()
    if (!nextPosition) {
      throw new Error('No next position found. This should not happen inside a loop')
    }

    if (this.getTypeFromPosition(nextPosition, map) === 'S') {
      console.log('End of loop found')
      this.next = this.getStartPipeFromThis()
      this.next.prev = this
      return this.next
    }
    this.next = new Pipe(this, nextPosition, map)
    return this.next
  }

  public getLoop(loop?: Pipe[]): Pipe[] {
    loop ??= []
    loop.push(this)
    if (this.isStart && loop.length > 1) return loop
    if (!this.next) throw new Error('No next element. This should not happen inside a loop')
    return this.next?.getLoop(loop)
  }

  public findPipeWithPosition(position: Point2D): Pipe {
    if (this.position.equals(position)) return this
    return this.getNext().findPipeWithPosition(position)
  }

  public getDiffVectorToNext() {
    return Vector2.Sub(this.getNext().position, this.position)
  }

  public transformTracer(tracer: Vector2) {
    const next = this.getNext()

    let newTracer = Vector2.FromPoint(tracer)

    if (next.type === '-') {
      newTracer.x = 0
    } else if (next.type === '|') {
      newTracer.y = 0
    } else if (['F', '7', 'J', 'L'].includes(next.type)) {
      const diffToNext = this.getDiffVectorToNext()
      const diffToSecondNext = this.getNext().getDiffVectorToNext()
      const isRightCorner =
        (diffToNext.x > 0 && diffToSecondNext.y > 0) || (diffToNext.x < 0 && diffToSecondNext.y < 0) || (diffToNext.y > 0 && diffToSecondNext.x < 0) || (diffToNext.y < 0 && diffToSecondNext.x > 0)

      newTracer = isRightCorner ? newTracer.rotate(Math.PI / 2, true) : newTracer.rotate(-Math.PI / 2, true)
    }
    // console.log('NewPos', tracer.toString(), ' -> ', newTracer.toString())
    return newTracer
  }
}
