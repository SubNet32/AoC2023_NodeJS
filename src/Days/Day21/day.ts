import chalk from 'chalk'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'
import { Rectangle } from '../../types/2D/Rectangle'
import { NumberUtils } from '../../Utils/NumberUtils'
import { Point2D } from '../../types/2D/types2D'

type StepRecords = {
  C: number
  U: number
  U2: number
  UR: number
  UR2: number
  UL: number
  UL2: number
  D: number
  D2: number
  DR: number
  DR2: number
  DL: number
  DL2: number
  L: number
  L2: number
  R: number
  R2: number
}

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
    let tileMap: null | StepRecords = null
    const fullTileCount: number[] = []
    let positions = new Set<string>([startField[0]])

    // the rhombus shaped pattern as seen in part1 continues forever and the values for each tile (131x131) repeats every 2 super-steps (131 steps) after reaching the first border (65 steps in)
    // run default algorithm until the second new tile is reached and save the values for each tile.
    for (let step = 0; step <= 65 + 131 * 2; step++) {
      let fieldCountMap = new FieldMap<number>()
      const newPos = new Set<string>()
      const isCheckStep = (step + 1) % 131 === 65 && step > 131 * 2
      for (const pos of positions) {
        getAdjacentPositionsP2(pos).forEach((p) => {
          if (newPos.has(p)) return
          newPos.add(p)
          if (isCheckStep) {
            const v = Vector2.FromString(p)
            const x = Math.floor(v.x / (width + 1))
            const y = Math.floor(v.y / (height + 1))
            const vMod = new Vector2(x, y)
            const value = fieldCountMap.getItem(vMod) ?? 0
            fieldCountMap.addItem(vMod, value + 1)
          }
        })
      }

      if (isCheckStep) {
        fullTileCount.push(fieldCountMap.getItem({ x: 0, y: 0 }) ?? 0)
        tileMap = {
          U: fieldCountMap.getItem({ x: 0, y: 1 }) ?? 0,
          U2: fieldCountMap.getItem({ x: 0, y: 2 }) ?? 0,
          D: fieldCountMap.getItem({ x: 0, y: -1 }) ?? 0,
          D2: fieldCountMap.getItem({ x: 0, y: -2 }) ?? 0,
          L: fieldCountMap.getItem({ x: -1, y: 0 }) ?? 0,
          L2: fieldCountMap.getItem({ x: -2, y: 0 }) ?? 0,
          R: fieldCountMap.getItem({ x: 1, y: 0 }) ?? 0,
          R2: fieldCountMap.getItem({ x: 2, y: 0 }) ?? 0,
          C: fieldCountMap.getItem({ x: 0, y: 0 }) ?? 0,
          UL: fieldCountMap.getItem({ x: -1, y: 1 }) ?? 0,
          UL2: fieldCountMap.getItem({ x: -2, y: 1 }) ?? 0,
          UR: fieldCountMap.getItem({ x: 1, y: 1 }) ?? 0,
          UR2: fieldCountMap.getItem({ x: 2, y: 1 }) ?? 0,
          DL: fieldCountMap.getItem({ x: -1, y: -1 }) ?? 0,
          DL2: fieldCountMap.getItem({ x: -2, y: -1 }) ?? 0,
          DR: fieldCountMap.getItem({ x: 1, y: -1 }) ?? 0,
          DR2: fieldCountMap.getItem({ x: 2, y: -1 }) ?? 0,
        }
      }

      positions = newPos
      memDelta = memSize - positions.size
      memSize = positions.size
    }
    if (!tileMap) return
    console.log('TileMap', JSON.stringify(tileMap, undefined, 2))

    // the pattern of the 2 values A & B repeats like a chess-board until the edge is reached. This pattern toggles after each super-step (131 steps)
    const steps = (26501365 - 65) / 131 //  -65 since from start to the first edge it takes 65 steps. 131 steps to repeat the pattern afterwards
    const isEvenStep = steps % 2 === 0
    const A = isEvenStep ? tileMap.C : tileMap.R
    const B = isEvenStep ? tileMap.R : tileMap.C
    const incompleteDiag = steps - 1 // number of incomplete diagonal tiles in every direction. (these are almost finished)
    const incompleteDiag2 = steps // number of incomplete diagonal tiles between the other diagonal tiles in every direction (these are only just started)
    const completeDiag = ((steps - 2) / 2) * (steps - 1) // number of complete diagonal tiles in every direction (4 x this in total). Sum = (n-1)/2 * n  (sum off all numbers)
    const completeDiagForValueA = Math.floor((steps - 1) / 2) * Math.floor((steps - 1) / 2) // number of complete diagonal tiles that are of value A (sum of all odd numbers)

    // add the center tile to the sum (its either A or B depending on the step)
    let sum = A

    // add 4 times the pattern for every non diagonal direction + the last tile of each direction. Every direction alternates between A and B and the pattern starts with B
    sum += 4 * (Math.floor((steps - 1) / 2) * A + Math.ceil((steps - 1) / 2) * B) + tileMap.U2 + tileMap.D2 + tileMap.L2 + tileMap.R2

    // add the complete diagonal tiles for every direction
    sum += 4 * (completeDiagForValueA * A + (completeDiag - completeDiagForValueA) * B)

    // add the incomplete diagonal tiles for every direction
    sum += incompleteDiag * (tileMap.UL + tileMap.UR + tileMap.DL + tileMap.DR)

    // add the remaining small triangular tiles that run across the diagonals
    sum += incompleteDiag2 * (tileMap.UL2 + tileMap.UR2 + tileMap.DL2 + tileMap.DR2)

    return sum
  }

  return { solve1, solve2 }
}
