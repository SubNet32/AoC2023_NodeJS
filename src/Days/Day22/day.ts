import { DayResult } from '../../types'
import { Cube } from '../../types/3D/Cube'
import Vector3 from '../../types/3D/Vector3'
import { Brick } from './Brick'

type CubesOnZ = Record<number, Brick[]>

const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export default function Day(): DayResult {
  const restingBricks: CubesOnZ = {}
  function init(input: string[]) {
    const bricks: Brick[] = []

    input.forEach((line, index) => {
      const [start, end] = line.split('~')
      bricks.push(new Brick(Vector3.FromString(start, ','), Vector3.FromString(end, ','), index < names.length ? names[index] : index.toString()))
    })

    // sort by start z
    bricks.sort((a, b) => a.start.z - b.start.z)

    for (const brick of bricks) {
      //falling
      while (true) {
        if (brick.start.z === 1) {
          addToRestingBricks(brick)
          break
        }
        const nextPos = Cube.FromCube(brick).move(Vector3.Down)
        const intersections = restingBricks[nextPos.start.z]?.filter((c) => c.intersects(nextPos))
        if (intersections?.length) {
          brick.restsOnBricks = intersections
          intersections.forEach((b) => b.supportedBricks.push(brick))
          addToRestingBricks(brick)
          break
        }
        brick.move(Vector3.Down)
      }
    }
  }

  function addToRestingBricks(brick: Brick) {
    if (brick.end.z in restingBricks) restingBricks[brick.end.z].push(brick)
    else restingBricks[brick.end.z] = [brick]
  }

  async function solve1(input: string[]) {
    init(input)
    let safeToDisintegrate = 0

    Object.values(restingBricks).forEach((bricks) => {
      bricks.forEach((brick) => {
        if (!brick.supportedBricks.find((sb) => sb.restsOnBricks.length === 1)) {
          safeToDisintegrate++
        }
      })
    })

    return safeToDisintegrate
  }

  async function solve2(input: string[]) {
    init(input)
    return Object.values(restingBricks).reduce((sum, bricks) => {
      bricks.forEach((originBrick) => {
        const fallingBricks = new Set<string>()
        const bricksToCheck = [...originBrick.supportedBricks.filter((sb) => sb.restsOnBricks.length === 1)]
        while (bricksToCheck.length) {
          const brick = bricksToCheck.shift() as Brick
          fallingBricks.add(brick.id)
          const nextBricksToFall = brick.supportedBricks.filter((sb) => sb.restsOnBricks.filter((rb) => !fallingBricks.has(rb.id)).length < 1)
          bricksToCheck.push(...nextBricksToFall)
        }
        sum += fallingBricks.size
      })
      return sum
    }, 0)
  }

  return { solve1, solve2 }
}
