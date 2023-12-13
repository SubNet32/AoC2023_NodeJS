import chalk from 'chalk'
import { DayResult } from '../../types'
import { StringUtils } from '../../Utils/StringUtils'

export default function Day(): DayResult {
  let log = true

  function printField(field: string[], yellow?: number[], blue?: number[]) {
    if (!log) return
    field.forEach((line, index) => {
      console.log(yellow?.includes(index) ? chalk.yellow(line) : blue?.includes(index) ? chalk.blue(line) : line)
    })
    console.log('')
  }

  // 0 1 2 3 [4] 5 v 6 [7] 8

  function findMirrorLineInField(field: string[]) {
    printField(field)
    for (let y = 0; y < field.length - 1; y++) {
      if (field.length && field[y] === field[y + 1]) {
        let check = true
        const upperLimit = field.length - (y + 2)
        const limit = Math.min(y, upperLimit)
        for (let c = 1; c <= limit; c++) {
          printField(field, [y - c, y + 1 + c])
          if (field[y - c] !== field[y + 1 + c]) {
            check = false
            break
          }
        }
        if (check) {
          if (log) console.log('Mirror Line found', y, y + 1)
          printField(field, [y, y + 1])
          return y + 1
        }
      }
    }
    return null
  }

  function findMirrorLineInFieldPart2(field: string[]) {
    for (let y = 0; y < field.length - 1; y++) {
      printField(field, undefined, [y, y + 1])
      const differences = StringUtils.getDifferenceCount(field[y], field[y + 1])
      if (differences <= 1) {
        let fixedSmudge = differences === 1
        let check = true
        const upperLimit = field.length - (y + 2)
        const limit = Math.min(y, upperLimit)
        for (let c = 1; c <= limit; c++) {
          printField(field, [y - c, y + 1 + c], [y, y + 1])
          const checkDifferences = StringUtils.getDifferenceCount(field[y - c], field[y + 1 + c])
          if (checkDifferences > 0) {
            if (!fixedSmudge && checkDifferences === 1) {
              fixedSmudge = true
              continue
            }
            check = false
            break
          }
        }
        if (check && fixedSmudge) {
          if (log) console.log('Mirror Line found', y, y + 1)
          printField(field, [y, y + 1])
          return y + 1
        }
      }
    }
    return null
  }

  async function solve1(input: string[]) {
    if (input.length > 50) log = false
    let currentMap: string[] = []
    let sum = 0
    input.forEach((line, index) => {
      if (!line || index === input.length - 1) {
        if (!currentMap.length) return
        let result = findMirrorLineInField(currentMap)
        if (!result) {
          result = findMirrorLineInField(StringUtils.rotateStringArray(currentMap))
          if (!result) throw new Error('No mirror line found')
        } else {
          result *= 100
        }
        currentMap = []
        if (result) sum += result
      } else {
        currentMap.push(line)
      }
    })

    return sum
  }

  async function solve2(input: string[]) {
    if (input.length > 50) log = false
    let currentMap: string[] = []
    let sum = 0
    input.forEach((line, index) => {
      if (!line || index === input.length - 1) {
        if (!currentMap.length) return
        let result = findMirrorLineInFieldPart2(currentMap)
        if (!result) {
          result = findMirrorLineInFieldPart2(StringUtils.rotateStringArray(currentMap))
          if (!result) throw new Error('No mirror line found')
        } else {
          result *= 100
        }
        currentMap = []
        sum += result
      } else {
        currentMap.push(line)
      }
    })

    return sum
  }

  return { solve1, solve2 }
}
