import { NumberUtils } from '../../Utils/NumberUtils'
import { DayResult } from '../../types'
import { RingBuffer } from '../../types/RingBuffer'

type Position = { position: string; startedCycleAt: string; foundZAfter: number }

export default function Day(): DayResult {
  function init(input: string[]) {
    const instructionsString = input.shift() ?? ''
    const map = new Map<string, [string, string]>()
    for (const line of input) {
      if (!line) continue
      const [name, paths] = line.split(' = ').map((q) => q.trim())
      const [left, right] = paths.replace(/[(),]/g, '').trim().split(' ')
      map.set(name, [left, right])
    }

    const instructions = new RingBuffer(Array.from(instructionsString))
    return { instructions, map }
  }

  async function solve1(input: string[]) {
    const { instructions, map } = init(input)

    let currentPosition = 'AAA'
    let counter = 0
    while (currentPosition !== 'ZZZ') {
      const paths = map.get(currentPosition)
      if (!paths) throw new Error('no path found')
      const instruction = instructions.next()

      currentPosition = instruction === 'L' ? paths[0] : paths[1]
      counter++
    }

    return counter
  }

  async function solve2(input: string[]) {
    const { instructions, map } = init(input)

    let counter = 0
    let positions = Array.from(map.keys())
      .filter((q) => q.endsWith('A'))
      .map<Position>((q) => ({ position: q, startedCycleAt: q, foundZAfter: 0 }))

    console.log(
      'Start',
      positions.map((q) => q.position)
    )
    while (true) {
      const instruction = instructions.next()
      counter++

      positions.forEach((pos) => {
        if (pos.foundZAfter > 0) return
        const paths = map.get(pos.position)
        if (!paths) throw new Error('no path found')
        pos.position = instruction === 'L' ? paths[0] : paths[1]
        if (pos.position.endsWith('Z')) {
          pos.foundZAfter = counter
        }

        if (instructions.index === 0) {
          pos.startedCycleAt = pos.position
        }
      })

      if (!positions.find((q) => q.foundZAfter === 0)) {
        return NumberUtils.leastCommonMultiple(...positions.map((q) => q.foundZAfter))
      }
    }
  }

  return { solve1, solve2 }
}
