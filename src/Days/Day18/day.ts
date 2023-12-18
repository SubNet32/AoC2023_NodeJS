import chalk from 'chalk'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'

const Direction: Record<string, Vector2> = {
  R: Vector2.Right,
  '0': Vector2.Right,
  L: Vector2.Left,
  '2': Vector2.Left,
  U: Vector2.Down,
  '1': Vector2.Down,
  D: Vector2.Up,
  '3': Vector2.Up,
}

export default function Day(): DayResult {
  const map = new FieldMap<string>()
  const fillMap = new FieldMap<string>()

  function init(input: string[]) {
    const pos = new Vector2(0, 0)
    let first = true

    input.forEach((line) => {
      const [dirAsString, count, color] = line.replace(/[()]/g, '').split(' ')
      const direction = Direction[dirAsString]

      if (first) {
        map.addItem(pos, color)
        first = false
      }

      for (let c = 0; c < Number(count); c++) {
        pos.add(direction)
        map.addItem(pos, color)
      }
    })
    map.calcBounds(true)
  }

  function initPart2(input: string[]) {
    const pos = new Vector2(0, 0)
    const points: Vector2[] = [Vector2.FromPoint(pos)]
    let len = 0

    input.forEach((line) => {
      const [_d, _c, color] = line.replace(/[()]/g, '').split(' ')
      const subS = color.substring(1, color.length - 1)
      const count = Number(Number.parseInt(subS, 16))
      const direction = Direction[color.at(-1) ?? '']
      pos.add(Vector2.multiply(Vector2.FromPoint(direction), count))
      points.push(Vector2.FromPoint(pos))
      len += count
    })
    return { points, len }
  }

  function printField() {
    const printWindow = [-100, 200]
    map.printField((v, pos) => {
      if (pos.x < printWindow[0] || pos.x > printWindow[1]) return ''
      if (fillMap.hasItem(pos)) return '0'
      if (v) return chalk.hex(v)('#')
      return '.'
    })
  }

  function floodMap() {
    const bounds = map.calcBounds()
    for (let y = bounds.start.y - 1; y <= bounds.end.y + 1; y++) {
      let inLoop = false
      for (let x = bounds.start.x - 1; x <= bounds.end.x + 1; x++) {
        if (inLoop && !map.hasItem({ x, y })) fillMap.addItem({ x, y }, '0')

        if (map.hasItem({ x, y })) {
          const startPos = new Vector2(x, y)
          let endPos: Vector2 | null = null
          do {
            if (!map.hasItem({ x: x + 1, y })) {
              endPos = new Vector2(x, y)
            } else {
              x++
            }
          } while (!endPos && x <= bounds.end.x + 1)
          if (!endPos) continue
          if (
            (map.hasItem(Vector2.Add(startPos, Vector2.Up)) || map.hasItem(Vector2.Add(endPos, Vector2.Up))) &&
            (map.hasItem(Vector2.Add(startPos, Vector2.Down)) || map.hasItem(Vector2.Add(endPos, Vector2.Down)))
          ) {
            inLoop = !inLoop
          }
        }
      }
    }
  }

  async function solve1(input: string[]) {
    init(input)
    floodMap()
    printField()
    return map.getAllItems().length + fillMap.getAllItems().length
  }

  // https://www.omnicalculator.com/math/irregular-polygon-area
  function shoelaceFormula(points: Vector2[]) {
    let result = 0
    for (let i = 0; i < points.length - 1; i++) {
      result += points[i].x * points[i + 1].y - points[i].y * points[i + 1].x
    }
    result += points[points.length - 1].x * points[0].y - points[points.length - 1].y * points[0].x
    return Math.abs(result) / 2
  }

  async function solve2(input: string[]) {
    const { points, len } = initPart2(input)
    // https://en.wikipedia.org/wiki/Pick%27s_theorem
    // since our points are in the center of a 1x1 square we actually miss every corner by 0.5 in every direction. To account for that we add 4 * 0.5 to the result
    return shoelaceFormula(points) + len / 2 - 1 + 2
  }

  return { solve1, solve2 }
}
