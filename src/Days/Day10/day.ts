import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'
import { Point2D } from '../../types/2D/types2D'
import { Pipe } from './Pipe'
import chalk from 'chalk'

const replaceValues = [
  ['F', '┌'],
  ['L', '└'],
  ['7', '┐'],
  ['J', '┘'],
  ['-', '─'],
  ['|', '│'],
]

export default function Day(): DayResult {
  function init(input: string[]) {
    input = input.map((q) => q.replace(/(O|I)/g, '.'))
    const map = FieldMap.fromInput(input, (q) => q)
    return { map }
  }

  async function solve1(input: string[]) {
    const { map } = init(input)
    map.printField()
    const startPosString = map.findFieldWithValue('S')?.[0] ?? ''
    const startPos = Vector2.FromString(startPosString)
    const startPipe = new Pipe(null, startPos, map)
    let pos = startPipe
    do {
      pos = pos.findNext(map)
    } while (!pos.isStart)
    const loop = startPipe.getLoop()
    // loop.forEach((pipe, index) => console.log(index, pipe.type, pipe.position.toString()))

    return Math.ceil((loop.length - 1) / 2)
  }

  function fillRemainingSpaces(positions: Point2D[], map: FieldMap<string>, loop: Pipe[]) {
    const checkedPositions: Point2D[] = []
    const positionsToCheck = positions

    while (positionsToCheck.length) {
      const posToCheck = positionsToCheck.shift() as Point2D

      if (map.getItem(posToCheck) === '.' || !loop.find((l) => l.position.equals(posToCheck))) {
        map.addItem(posToCheck, 'I')
      }
      checkedPositions.push(posToCheck)

      const directions = [Vector2.Add(posToCheck, Vector2.Up), Vector2.Add(posToCheck, Vector2.Down), Vector2.Add(posToCheck, Vector2.Left), Vector2.Add(posToCheck, Vector2.Right)]
      const adjPos = map
        .getItems(directions)
        .map((q) => q[0])
        .filter(
          (q) => !positionsToCheck.find((pos) => Vector2.equals(pos, q)) && !checkedPositions.find((pos) => Vector2.equals(pos, q)) && !loop.find((l) => l.position.equals(q)) && !!map.isInBounds(q)
        )

      positionsToCheck.push(...adjPos)
    }
  }

  async function solve2(input: string[]) {
    const { map } = init(input)
    // map.printField()
    const startPosString = map.findFieldWithValue('S')?.[0] ?? ''
    const startPos = Vector2.FromString(startPosString)
    const startPipe = new Pipe(null, startPos, map)
    const inverse = true

    let pos = startPipe
    do {
      pos = pos.findNext(map, inverse)
    } while (!pos.isStart)
    const loop = startPipe.getLoop()
    let currentPipe: Pipe | null = startPipe
    // use pre-determined inside vector because I'm too stupid to find it through the given input
    let insideTracer = inverse ? new Vector2(0, -1) : new Vector2(-1, 0)
    do {
      const currentCheckPos = Vector2.Add(currentPipe.position, insideTracer)
      const checkPositions: Vector2[] = [currentCheckPos]

      if (['F', 'J', '7', 'L'].includes(currentPipe.getNext().type) && !currentPipe.isStart) {
        const nextTracer = currentPipe.transformTracer(insideTracer)
        const nextCheckPos = Vector2.Add(currentPipe.getNext().position, nextTracer)
        const diffToNextPipe = currentPipe.getDiffVectorToNext()
        const tracerDiff = Vector2.Sub(nextCheckPos, currentCheckPos)
        const count = Math.abs(tracerDiff.x * diffToNextPipe.x + tracerDiff.y * diffToNextPipe.y)
        let moveVector = Vector2.FromPoint(currentCheckPos)
        for (let i = 0; i < count; i++) {
          moveVector.add(diffToNextPipe)
          checkPositions.push(Vector2.FromPoint(moveVector))
        }
      }

      for (const checkPos of checkPositions) {
        if (map.getItem(checkPos) === '.') map.addItem(checkPos, 'I')
        if (!loop.find((l) => l.position.equals(checkPos))) map.addItem(checkPos, 'I')
      }

      if (input.length < 20) {
        map.printField((v, pos) => {
          if (checkPositions.find((p) => p.equals(pos))) return chalk.yellow('C')
          if (currentPipe?.position.equals(pos)) return chalk.blue('P')

          replaceValues.forEach((rp) => {
            v = v?.replace(rp[0], rp[1])
          })
          return v ?? ''
        })
      }

      insideTracer = currentPipe.transformTracer(insideTracer)
      currentPipe = currentPipe?.getNext()
    } while (!currentPipe.isStart)

    const allIPositions = Array.from(map.map.entries())
      .filter(([_, value]) => value === 'I' || value === '+')
      .map(([pos]) => Vector2.FromString(pos))
    fillRemainingSpaces(allIPositions, map, loop)

    console.log('Final Map')
    map.printField((v) => {
      if (v === '.') return chalk.red('.')
      if (v === 'I') return chalk.yellow('I')
      replaceValues.forEach((rp) => {
        v = v?.replace(rp[0], rp[1])
      })
      return v ?? ' '
    })

    return map.findAllFieldsWithValue('I').length
  }

  return { solve1, solve2 }
}
