import chalk from 'chalk'
import { StringUtils } from '../../Utils/StringUtils'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'

export default function Day(): DayResult {
  function init(input: string[], expandBy: number) {
    const galaxies: Vector2[] = []
    let expansionLinesY: number[] = []
    let expansionLinesX: number[] = Array(input[0].length)
      .fill(0)
      .map((_, i) => i)
    input.forEach((line, y) => {
      if (!line.includes('#')) {
        expansionLinesY.push(y)
        return
      }
      const positions = StringUtils.getCharPositionsInString(line, '#')
      if (!positions?.length) return
      expansionLinesX = expansionLinesX.filter((q) => !positions?.includes(q))
      galaxies.push(...positions.map((x) => new Vector2(x, y)))
    })

    expansionLinesX.forEach((expX, index) => {
      for (let i = index + 1; i < expansionLinesX.length; i++) {
        expansionLinesX[i] += expandBy
      }
      galaxies.forEach((galaxy) => {
        if (galaxy.x >= expX) galaxy.x += expandBy
      })
    })

    expansionLinesY.forEach((expY, index) => {
      for (let i = index + 1; i < expansionLinesY.length; i++) {
        expansionLinesY[i] += expandBy
      }
      galaxies.forEach((galaxy) => {
        if (galaxy.y >= expY) galaxy.y += expandBy
      })
    })

    return { galaxies, expansionLinesX: expansionLinesX, expansionLinesY: expansionLinesY }
  }

  function printGalaxies(galaxies: Vector2[], highlight?: Vector2[]) {
    const map = new FieldMap<string>()
    galaxies.forEach((element) => {
      map.addItem(element, '#')
    })

    map.printField((value, pos) => {
      value ??= '.'
      if (highlight?.find((p) => p.equals(pos))) return chalk.yellow(value)
      return value
    })
  }

  async function solve1(input: string[]) {
    const { galaxies } = init(input, 1)

    printGalaxies(galaxies)
    const distances: number[] = []
    for (let a = 0; a < galaxies.length; a++) {
      for (let b = a + 1; b < galaxies.length; b++) {
        const dist = galaxies[a].lineDistanceTo(galaxies[b])
        distances.push(dist)
        if (input.length < 20) {
          console.log('Dist between', galaxies[a].toString(), ' - ', galaxies[b].toString(), ' = ', dist)
          printGalaxies(galaxies, [galaxies[a], galaxies[b]])
          console.log(' ')
        }
      }
    }

    return distances.reduce<number>((sum, dist) => sum + dist, 0)
  }

  async function solve2(input: string[]) {
    const { galaxies } = init(input, 1000000 - 1)

    const distances: number[] = []
    for (let a = 0; a < galaxies.length; a++) {
      for (let b = a + 1; b < galaxies.length; b++) {
        const dist = galaxies[a].lineDistanceTo(galaxies[b])
        distances.push(dist)
        if (input.length < 20) {
          console.log('Dist between', galaxies[a].toString(), ' - ', galaxies[b].toString(), ' = ', dist)
          printGalaxies(galaxies, [galaxies[a], galaxies[b]])
          console.log(' ')
        }
      }
    }

    return distances.reduce<number>((sum, dist) => sum + dist, 0)
  }

  return { solve1, solve2 }
}
