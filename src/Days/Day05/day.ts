import { StringUtils } from '../../Utils/StringUtils'
import { DayResult } from '../../types'
import { Range } from '../../types/numeric/Range'

type TransformationRange = {
  range: Range
  transformation: number
}

type Map = {
  source: string
  target: string
  ranges: TransformationRange[]
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

  function transformRange(ranges: Range[], mapIndex: number, maps: Map[]) {
    if (mapIndex >= maps.length) return ranges.reduce<number | null>((lowest, range) => (lowest === null || range.start < lowest ? range.start : lowest), null)
    const map = maps[mapIndex]

    const rangesToCheck: Range[] = [...ranges]
    const transformedRanges: Range[] = []

    while (rangesToCheck.length) {
      const range = rangesToCheck.pop() as Range
      const intersections = map.ranges.map<TransformationRange>((r) => ({ range: r.range.intersection(range) as Range, transformation: r.transformation })).filter((q) => !!q.range)
      let remainingRanges = [range]
      intersections.forEach((inter) => {
        const cutRanges: Range[] = []
        remainingRanges.forEach((rr) => {
          cutRanges.push(...rr.cut(inter.range))
        })
        remainingRanges = [...cutRanges]
      })
      transformedRanges.push(...remainingRanges)
      transformedRanges.push(...intersections.map((inter) => inter.range.offset(inter.transformation)))
    }

    return transformRange(transformedRanges, mapIndex + 1, maps)
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

    return transformRange(seedRanges, 0, maps)
  }

  return { solve1, solve2 }
}
