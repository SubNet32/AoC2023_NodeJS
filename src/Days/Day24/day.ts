import { DayResult } from '../../types'
import { Rectangle } from '../../types/2D/Rectangle'
import Vector3 from '../../types/3D/Vector3'

type HailStone = {
  position: Vector3
  velocity: Vector3
}

export default function Day(): DayResult {
  function init(input: string[], part: 1 | 2 = 1) {
    return input.map<HailStone>((line) => {
      const [pos, vel] = line.replace(/\s/g, '').split('@')
      const position = Vector3.FromString(pos, ',')
      const velocity = Vector3.FromString(vel, ',')
      if (part === 1) {
        position.z = 0
        velocity.z = 0
      }
      return {
        position,
        velocity,
      }
    })
  }

  function convertToLine(HailStone: HailStone) {
    const pos1 = HailStone.position
    const pos2 = Vector3.Add(HailStone.position, HailStone.velocity)
    const A = pos2.y - pos1.y
    const B = pos1.x - pos2.x
    const C = A * pos1.x + B * pos1.y
    return { A, B, C }
  }

  // https://www.topcoder.com/thrive/articles/Geometry%20Concepts%20part%202:%20%20Line%20Intersection%20and%20its%20Applications
  function getIntersection(h1: HailStone, h2: HailStone) {
    const l1 = convertToLine(h1)
    const l2 = convertToLine(h2)
    const det = l1.A * l2.B - l2.A * l1.B
    //lines are parallel
    if (det === 0) return null
    const x = (l2.B * l1.C - l1.B * l2.C) / det
    const y = (l1.A * l2.C - l2.A * l1.C) / det

    const intersection = new Vector3(x, y, 0)

    // check if intersection happened in the past
    if (!Vector3.Sub(intersection, h1.position).normalize().equals(Vector3.FromPoint(h1.velocity).normalize())) return null
    if (!Vector3.Sub(intersection, h2.position).normalize().equals(Vector3.FromPoint(h2.velocity).normalize())) return null

    return intersection
  }

  async function solve1(input: string[]) {
    const hailStones = init(input)
    let counter = 0
    const boundaries = input.length > 20 ? new Rectangle({ x: 200000000000000, y: 200000000000000 }, { x: 400000000000000, y: 400000000000000 }) : new Rectangle({ x: 7, y: 7 }, { x: 27, y: 27 })
    for (let a = 0; a < hailStones.length - 1; a++) {
      for (let b = a + 1; b < hailStones.length; b++) {
        const intersection = getIntersection(hailStones[a], hailStones[b])
        if (intersection && boundaries.containsPoint(intersection)) {
          counter++
        }
      }
    }
    return counter
  }

  async function solve2(input: string[]) {
    const hailStones = init(input, 2)

    return ''
  }

  return { solve1, solve2 }
}
