import chalk from 'chalk'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'
import { Rectangle } from '../../types/2D/Rectangle'

type Beam = {
  position: Vector2
  direction: Vector2
}

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
    map.boundaries = new Rectangle({ x: 0, y: 0 }, { x: input[0].length - 1, y: input.length - 1 })
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

    printHeatMapOntoField(beamRoute)
    if (!map.boundaries?.containsPoint(beam.position)) return beamRoute
    beamRoute.add(beam.position.toString())

    const mirror = map.getItem(beam.position)
    const beams = transformBeam(beam, mirror)
    const mirrorKey = createKeyForBeam(beam, beams)

    if (mirror) {
      const foundRoute = beamRouteMap.get(mirrorKey)
      if (foundRoute) {
        if (log) {
          console.log('Route')
          printHeatMapOntoField(foundRoute)
          console.log('')
        }
        // console.log(beamKey, 'Found Subroute', foundRoute.size)
        Array.from(foundRoute.values()).forEach((value) => {
          beamRoute.add(value)
        })
        return beamRoute
      }
    }
    if (!mirror || beams.length === 1) {
      traceBeam(beams[0], beamRoute)
    } else {
      const subRoute = new Set<string>()
      subRoute.add(beam.position.toString())
      beamRouteMap.set(mirrorKey, subRoute)
      for (const beam of beams) {
        traceBeam(beam, subRoute)
      }

      Array.from(subRoute.values()).forEach((value) => {
        beamRoute.add(value)
      })
    }
    return beamRoute
  }

  function transformBeam(beam: Beam, type: TransformationValues = '.'): Beam[] {
    const transformValue = TransformationMatrix[type]?.find(([dir]) => beam.direction.equals(dir))?.[1]
    if (!transformValue?.length) return [{ position: Vector2.FromPoint(beam.position), direction: beam.direction }]
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
    const route = traceBeam(startBeam, new Set<string>())

    return route.size
  }

  // 12|30|0|-1|0|1 2395
  async function solve2(input: string[]) {
    log = input.length < 20
    init(input)
    const startBeams: Beam[] = [
      // { position: new Vector2(3, -1), direction: Vector2.Up },
      // { position: new Vector2(4, -1), direction: Vector2.Up },
      // { position: new Vector2(-1, 4), direction: Vector2.Right },
      // { position: new Vector2(6, 10), direction: Vector2.Down },
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
      const copyOfBeam: Beam = { position: Vector2.FromPoint(beam.position), direction: Vector2.FromPoint(beam.direction) }

      const route = traceBeam(beam, new Set<string>())

      console.log('Running beam', index, 'result:', route.size)

      if (route.size > best) {
        {
          best = route.size
          console.log('New best', index, best, copyOfBeam)
          printHeatMapOntoField(route)
          console.log('')
        }
      }
      // printHeatMapOntoField(route)
    })

    return best
  }

  return { solve1, solve2 }
}
