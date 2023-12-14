import chalk from 'chalk'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'
import { RingBuffer } from '../../types/RingBuffer'
import { Rectangle } from '../../types/2D/Rectangle'

export default function Day(): DayResult {
  let log = true
  function init(input: string[]) {
    const roundRocks: Vector2[] = []
    const cubeRocks: Vector2[] = []
    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < input[y].length; x++) {
        if (input[y][x] === 'O') roundRocks.push(new Vector2(x, y))
        else if (input[y][x] === '#') cubeRocks.push(new Vector2(x, y))
      }
    }

    return { roundRocks, cubeRocks }
  }

  function printRocks(roundRocks: Vector2[], cubeRocks: Vector2[], yellow?: Vector2[]) {
    if (!log) return
    const map = new FieldMap<string>()
    roundRocks.forEach((rock) => map.addItem(rock, yellow?.includes(rock) ? chalk.yellow('O') : 'O'))
    cubeRocks.forEach((rock) => map.addItem(rock, '#'))
    map.printField((v, pos) => v ?? '.')
  }

  async function solve1(input: string[]) {
    if (input.length > 20) log = false
    const { roundRocks, cubeRocks } = init(input)
    const fixedRocks = [...cubeRocks]
    const movableRocks = [...roundRocks].sort(Vector2.SortByY)

    printRocks(roundRocks, cubeRocks)

    while (movableRocks.length) {
      const rock = movableRocks.shift() as Vector2
      while (true) {
        printRocks(roundRocks, cubeRocks)
        if (rock.y === 0 || fixedRocks.find((fr) => fr.equals(Vector2.Add(rock, Vector2.Down)))) {
          fixedRocks.push(rock)
          break
        } else {
          rock.add(Vector2.Down)
        }
      }
    }

    return roundRocks.reduce((sum, rock) => sum + (input.length - rock.y), 0)
  }

  async function solve2(input: string[]) {
    if (input.length > 20) log = false
    const { roundRocks, cubeRocks } = init(input)

    const movableRocks = [...roundRocks].sort(Vector2.SortByY)

    const directionBuffer = new RingBuffer([Vector2.Down, Vector2.Left, Vector2.Up, Vector2.Right])
    const bounds = new Rectangle({ x: 0, y: 0 }, { x: input[0].length - 1, y: input.length - 1 })
    let memPositions: { pos: string; cycle: number; weight: number }[] = []
    printRocks(roundRocks, cubeRocks)

    const cycles = 1000000000
    let index = 0
    while (index < cycles * 4) {
      if (directionBuffer.index === 0 || directionBuffer.index === 2) {
        movableRocks.sort(Vector2.SortByY)
        if (directionBuffer.index === 2) movableRocks.reverse()
      } else if (directionBuffer.index === 1 || directionBuffer.index === 3) {
        movableRocks.sort(Vector2.SortByX)
        if (directionBuffer.index === 3) movableRocks.reverse()
      }
      const direction = directionBuffer.next()
      const rockMap = FieldMap.fromVectorArray(cubeRocks, () => '#')
      movableRocks.forEach((rock) => {
        while (true) {
          const nextPos = Vector2.Add(rock, direction)
          if (!bounds.containsPoint(nextPos) || rockMap.hasItem(nextPos)) {
            rockMap.addItem(rock, 'O')
            break
          } else {
            rock.add(direction)
          }
        }
      })
      index++
      if (directionBuffer.index === 0) {
        const cycle = index / 4
        const currentWeight = roundRocks.reduce((sum, rock) => sum + (input.length - rock.y), 0)

        // console.log('Cycle', cycle, '. Weight:', currentWeight)

        const currentPositions = roundRocks
          .sort()
          .map((r) => r.toString())
          .join(';')
        const foundPos = memPositions.find((m) => m.pos === currentPositions)
        if (foundPos) {
          console.log('Found memPos from cycle', foundPos.cycle)
          const remainingCycles = cycles - cycle
          const loopLen = cycle - foundPos.cycle
          const cycleShift = remainingCycles % loopLen
          return memPositions.find((pos) => pos.cycle === foundPos.cycle + cycleShift)?.weight
        }
        memPositions.push({ pos: currentPositions, cycle, weight: currentWeight })
      }
    }

    return roundRocks.reduce((sum, rock) => sum + (input.length - rock.y), 0)
  }

  return { solve1, solve2 }
}
