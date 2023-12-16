import chalk from 'chalk'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'

type Beam = {
  position: Vector2
  direction: Vector2
}
// 8678
const TransformationMatrix = {
  '/': [
    [Vector2.Right, [Vector2.Down]],
    [Vector2.Down, [Vector2.Right]],
    [Vector2.Left, [Vector2.Up]],
    [Vector2.Up, [Vector2.Left]],
  ],
  '\\': [
    [Vector2.Left, [Vector2.Down]],
    [Vector2.Down, [Vector2.Left]],
    [Vector2.Right, [Vector2.Up]],
    [Vector2.Up, [Vector2.Right]],
  ],
  '-': [
    [Vector2.Down, [Vector2.Left, Vector2.Right]],
    [Vector2.Up, [Vector2.Left, Vector2.Right]],
  ],
  '|': [
    [Vector2.Left, [Vector2.Down, Vector2.Up]],
    [Vector2.Right, [Vector2.Down, Vector2.Up]],
  ],
  '.': [],
} as const

type TransformationValues = keyof typeof TransformationMatrix

export default function Day(): DayResult {
  const map = new FieldMap<TransformationValues>()
  const beamRouteMap = new Map<string, Set<string>>()
  let log = true

  function init(input: string[]) {
    input.forEach((line, y) => {
      Array.from(line).forEach((char, x) => {
        if (char !== '.') map.addItem({ x, y }, char as TransformationValues)
      })
    })
    map.calcBounds(true)
  }

  function printBeam(beam: Beam) {
    if (!log) return
    map.printField((v, pos) => {
      if (beam.position.equals(pos)) return chalk.yellow('x')
      return v ?? '.'
    })
  }

  function printHeatMap(heatSet: Set<string>) {
    if (!log) return
    const heatMap = new FieldMap<string>()
    Array.from(heatSet.values()).forEach((value) => heatMap.addItem(Vector2.FromString(value), '#'))
    heatMap.printField((v) => v ?? '.')
  }

  function printHeatMapOntoField(heatMap: Set<string>) {
    if (!log) return
    const heatMapPositions = Array.from(heatMap.values()).map((value) => {
      const [x, y] = value.split('|')
      return new Vector2(Number(x), Number(y))
    })
    map.printField((v, pos) => {
      if (heatMapPositions.find((hp) => hp.equals(pos))) return chalk.yellow('x')
      return v ?? '.'
    })
  }

  function createKeyForBeam(beam: Beam, nextBeams: Beam[]) {
    return beam.position.toString() + '|' + nextBeams.map((nBeam) => nBeam.direction.toString()).join('|')
  }

  function traceBeam(beam: Beam, beamRoute: Set<string>): Set<string> {
    beam.position.add(beam.direction)

    printBeam(beam)
    if (!map.boundaries?.containsPoint(beam.position)) return beamRoute
    beamRoute.add(beam.position.toString())

    const mirror = map.getItem(beam.position)
    const beams = mirror ? transformBeam(beam, mirror) : [beam]
    const beamKey = createKeyForBeam(beam, beams)
    if (mirror) {
      const foundRoute = beamRouteMap.get(beamKey)
      if (foundRoute) {
        if (log) {
          console.log('Route')
          printHeatMapOntoField(foundRoute)
          console.log('')
        }
        Array.from(foundRoute.values()).forEach((value) => {
          beamRoute.add(value)
        })
        return beamRoute
      }
    }
    if (!mirror) {
      traceBeam(beams[0], beamRoute)
    } else {
      const subRoute = new Set<string>()
      beamRouteMap.set(beamKey, subRoute)
      for (const beam of beams) {
        const result = traceBeam(beam, subRoute)
        printHeatMapOntoField(result)
        Array.from(result.values()).forEach((value) => subRoute.add(value))
      }
      beamRouteMap.set(beamKey, subRoute)
      Array.from(subRoute.values()).forEach((value) => beamRoute.add(value))
    }
    return beamRoute
  }

  function transformBeam(beam: Beam, type: TransformationValues): Beam[] {
    const transformValue = TransformationMatrix[type]?.find(([dir]) => beam.direction.equals(dir))?.[1]
    if (!transformValue?.length) return [beam]
    const newBeams: Beam[] = []
    transformValue.forEach((dir) => {
      newBeams.push({ position: Vector2.FromPoint(beam.position), direction: dir })
    })
    return newBeams
  }

  async function solve1(input: string[]) {
    log = input.length < 20
    let startBeam: Beam = { position: new Vector2(-1, 0), direction: Vector2.Right }
    init(input)
    const heatMap = new Set<string>()
    traceBeam(startBeam, heatMap)

    return heatMap.size
  }

  async function solve2(input: string[]) {
    log = input.length < 20
    init(input)
    const startBeams: Beam[] = [
      // { position: new Vector2(-1, 0), direction: Vector2.Right },
      // { position: new Vector2(-1, 0), direction: Vector2.Right },
      // { position: new Vector2(1, 10), direction: Vector2.Down },
      // { position: new Vector2(3, -1), direction: Vector2.Up },
    ]
    input.forEach((line, y) => {
      startBeams.push({ position: new Vector2(-1, y), direction: Vector2.Right })
      startBeams.push({ position: new Vector2(line.length, y), direction: Vector2.Left })
    })
    for (let x = 0; x < input.length; x++) {
      startBeams.push({ position: new Vector2(x, -1), direction: Vector2.Up })
      startBeams.push({ position: new Vector2(x, input.length), direction: Vector2.Down })
    }
    let best = 0
    startBeams.forEach((beam, index) => {
      beamRouteMap.clear()
      const heatMap = new Set<string>()
      traceBeam(beam, heatMap)

      console.log('Running beam', index, 'result:', heatMap.size)
      if (heatMap.size > best) {
        {
          best = heatMap.size
          console.log('New best', best, beam)
          printHeatMap(heatMap)
        }
      }
    })

    return best
  }

  return { solve1, solve2 }
}
