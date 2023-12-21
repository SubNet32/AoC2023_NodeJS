import chalk from 'chalk'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'
import { Rectangle } from '../../types/2D/Rectangle'
import { NumberUtils } from '../../Utils/NumberUtils'

const directions = [Vector2.Up, Vector2.Down, Vector2.Left, Vector2.Right] as const
export default function Day(): DayResult {
  let map = new FieldMap<string>()

  function getAdjacentPositions(pos: string) {
    const adjPos: string[] = []
    for (const dir of directions) {
      const movePos = Vector2.Add(Vector2.FromString(pos), dir)
      if (map.isInBounds(movePos) && !map.hasItem(movePos)) adjPos.push(movePos.toString())
    }
    return adjPos
  }

  function printMapWithPositions(positions: Set<string>) {
    map.printField(
      (v, pos) => {
        if (positions.has(Vector2.FromPoint(pos).toString())) return chalk.yellow('0')
        return v ?? '.'
      },
      false,
      map.boundaries
    )
  }

  async function solve1(input: string[]) {
    map = FieldMap.fromInput(input, (c) => (['#', 'S'].includes(c) ? c : undefined))
    map.boundaries = new Rectangle({ x: 0, y: 0 }, { x: input[0].length - 1, y: input.length - 1 })
    const startField = map.findFieldWithValue('S')
    if (!startField) throw new Error('No Start found')
    map.deleteItem(Vector2.FromString(startField[0]))

    let positions = new Set<string>([startField[0]])
    for (let step = 0; step < 64; step++) {
      const newPos = new Set<string>()
      for (const pos of positions) {
        getAdjacentPositions(pos).forEach((p) => newPos.add(p))
      }
      positions = newPos
      // printMapWithPositions(positions)
    }
    printMapWithPositions(positions)

    return positions.size
  }

  function getAdjacentPositionsP2(pos: string) {
    const adjPos: string[] = []
    const width = map.boundaries?.end.x ?? 0
    const height = map.boundaries?.end.y ?? 0
    for (const dir of directions) {
      const movePos = Vector2.Add(Vector2.FromString(pos), dir)
      let checkPos = Vector2.FromPoint(movePos)
      if (!map.isInBounds(checkPos)) {
        checkPos = new Vector2(NumberUtils.mod(movePos.x, width + 1), NumberUtils.mod(movePos.y, height + 1))
        // console.log(Vector2.Add(Vector2.FromString(pos), dir), '->', movePos)
      }
      if (!map.hasItem(checkPos)) adjPos.push(movePos.toString())
    }
    return adjPos
  }

  async function solve2(input: string[]) {
    map = FieldMap.fromInput(input, (c) => (['#', 'S'].includes(c) ? c : undefined))
    map.boundaries = new Rectangle({ x: 0, y: 0 }, { x: input[0].length - 1, y: input.length - 1 })
    const startField = map.findFieldWithValue('S')
    if (!startField) throw new Error('No Start found')
    map.deleteItem(Vector2.FromString(startField[0]))
    const width = map.boundaries?.end.x ?? 0
    const height = map.boundaries?.end.y ?? 0
    let memSize = 0
    let memDelta = 0
    let positions = new Set<string>([startField[0]])
    for (let step = 0; step < 50; step++) {
      let fieldCountMap = new FieldMap<number>()
      const newPos = new Set<string>()
      for (const pos of positions) {
        getAdjacentPositionsP2(pos).forEach((p) => {
          newPos.add(p)
          const v = Vector2.FromString(p)
          const x = Math.floor(v.x / (width + 1))
          const y = Math.floor(v.y / (height + 1))
          const vMod = new Vector2(x, y)
          const value = fieldCountMap.getItem(vMod) ?? 0
          fieldCountMap.addItem(vMod, value + 1)
        })
      }

      console.log(
        step,
        fieldCountMap
          .getAllItems()
          .map(([p, n]) => `${p.x}|${p.y} = ${n}`)
          .sort()
      )

      positions = newPos
      // console.log('After step', step + 1, positions.size, ' + ', positions.size - memSize, ' d ', memSize - positions.size - memDelta)
      memDelta = memSize - positions.size
      memSize = positions.size
    }

    return positions.size
  }

  return { solve1, solve2 }
}
