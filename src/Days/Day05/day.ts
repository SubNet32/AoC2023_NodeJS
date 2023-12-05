import { StringUtils } from '../../Utils/StringUtils'
import { DayResult } from '../../types'
import { Range } from '../../types/numeric/Range'

type Map = {
  source: string
  target: string
  ranges: { range: Range; transformation: number }[]
}

export default function Day(): DayResult {
  function init(input: string[]) {
    const seeds = StringUtils.getAllNumbersInString(input.splice(0, 1).pop() ?? '')
    const seedRanges: Range[] = []
    for (let i = 0; i < seeds.length; i += 2) {
      seedRanges.push(new Range(seeds[i], seeds[i] + seeds[i + 1] - 1))
    }
    const maps: Map[] = []
    let currentMap: Map | null = null
    for (let i = 0; i < input.length; i++) {
      const line = input[i]
      if (!line) {
        if (currentMap) maps.push(currentMap)
        continue
      }
      if (line.includes('map')) {
        const [source, target] = line
          .replace(' map:', '')
          .split('-to-')
          .map((q) => q.trim())
        currentMap = {
          source,
          target,
          ranges: [],
        }
        continue
      }
      if (!currentMap) throw new Error('currentMap is null. This should not happen')
      const [destRangeStart, sourceRangeStart, length] = StringUtils.getAllNumbersInString(line)
      currentMap.ranges.push({ range: new Range(sourceRangeStart, sourceRangeStart + length - 1), transformation: destRangeStart - sourceRangeStart })
    }
    if (currentMap) {
      maps.push(currentMap)
    }

    return { maps, seeds, seedRanges }
  }

  function transformWithMap(value: number, map: Map) {
    const foundRage = map.ranges.find((r) => r.range.inRange(value))
    if (!foundRage) return value
    return value + foundRage.transformation
  }

  async function solve1(input: string[]) {
    const { seeds, maps } = init(input)

    let lowestLocation: number | null = null
    seeds.forEach((seed) => {
      let value = seed
      console.log('\nRunning Seed', seed)
      maps.forEach((map) => {
        const valueBefore = value
        value = transformWithMap(value, map)
        console.log(valueBefore, '  ', map.source, ' - ', map.target, ' --> ', value)
      })
      if (lowestLocation === null || value < lowestLocation) lowestLocation = value
    })

    return lowestLocation
  }

  async function solve2(input: string[]) {
    const { seedRanges, maps } = init(input)

    let lowestLocation: number | null = null
    seedRanges.forEach((range) => {
      for (let seed = range.start; seed <= range.end; seed++) {
        let value = seed
        // console.log('\nRunning Seed', seed)
        maps.forEach((map) => {
          const valueBefore = value
          value = transformWithMap(value, map)
          // console.log(valueBefore, '  ', map.source, ' - ', map.target, ' --> ', value)
        })
        if (lowestLocation === null || value < lowestLocation) lowestLocation = value
      }
    })

    return lowestLocation
  }

  return { solve1, solve2 }
}
