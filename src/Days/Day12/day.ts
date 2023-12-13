import chalk from 'chalk'
import { StringUtils } from '../../Utils/StringUtils'
import { DayResult } from '../../types'

type Row = {
  line: string
  values: number[]
}

export default function Day(): DayResult {
  let log = false
  function init(input: string[], multiply: number = 1, mod: string = '', modStart: string = '') {
    if (input.length > 10 || multiply > 2) log = false
    return input.map<Row>((line) => ({
      line: Array(multiply)
        .fill(modStart + line.split(' ')[0] + mod)
        .join('?'),
      values: Array(multiply)
        .fill(StringUtils.getAllNumbersInString(line))
        .reduce((arr, num) => [...arr, ...num], []),
    }))
  }

  let resultMap = new Map<string, number>()

  function findPossibleAssignments(line: string, values: number[], startAt: number = 0): number {
    if (log) console.log('Matching', line, values)
    const key = `${startAt};${values.join(';')}`
    if (resultMap.has(key)) return resultMap.get(key) ?? 0
    const memValues = [...values]
    const lengthToMatch = memValues.shift() ?? 0
    const restLen = memValues.reduce((sum, v) => sum + v + 1, 0)
    const maxI = line.length - restLen - lengthToMatch
    let matches = 0
    for (let i = startAt; i <= maxI; i++) {
      let match = true
      for (let s = i; s < i + lengthToMatch + 1; s++) {
        if (log) {
          console.log(
            Array.from(line)
              .map((q, ind) => {
                if (ind !== s) return q
                if (ind === i + lengthToMatch) return chalk.blue(q)
                return chalk.red(q)
              })
              .join('')
          )
        }
        if (s >= line.length) {
          if (s < i + lengthToMatch) match = false
          break
        }
        if ((line[s] === '.' && s < i + lengthToMatch) || (s === i + lengthToMatch && line[s] === '#')) {
          match = false
          break
        }
      }
      if (match) {
        if (memValues.length) {
          let newLine = StringUtils.insertAt(line, '#'.repeat(lengthToMatch) + '.', i)
          matches += findPossibleAssignments(newLine, memValues, i + lengthToMatch + 1)
        } else {
          if (!line.substring(i + lengthToMatch + 1).includes('#')) {
            let newLine = StringUtils.insertAt(line, '#'.repeat(lengthToMatch) + '.', i)
            if (log) console.log('Match', chalk.yellow(newLine))
            matches++
          }
        }
      }
      if (line[i] === '#') break
    }
    resultMap.set(key, matches)
    return matches
  }

  function testMatches(match: string, line: string, values: number[]) {
    const errorFound = () => {
      console.log('Found error')
      console.log('Input', line, values)
      console.log(match)
      console.log('')
    }

    if (values.reduce((sum, v) => sum + v, 0) !== Array.from(match).filter((q) => q === '#').length) errorFound()
    let copy = match
    values.forEach((value) => {
      const indexOf = copy.indexOf('#'.repeat(value))
      const endOf = indexOf + value
      if (indexOf === -1 || (copy.length > endOf && copy[endOf] === '#')) {
        errorFound()
      } else {
        copy = StringUtils.insertAt(copy, 'x'.repeat(value), indexOf)
      }
    })
    if (copy.includes('#')) errorFound()
  }

  async function solve1(input: string[]) {
    const rows = init(input)
    return rows.reduce((sum, row) => {
      resultMap.clear()
      const matches = findPossibleAssignments(row.line, row.values)
      if (log) {
        console.log('Matches', matches)
        console.log(row.line, row.values)
      }

      if (log) {
        console.log('')
        console.log('')
      }
      return sum + matches
    }, 0)
  }

  async function solve2(input: string[]) {
    const rows5 = init(input, 5)

    return rows5.reduce((sum, row, index) => {
      resultMap.clear()
      const matches = findPossibleAssignments(row.line, row.values)
      return sum + matches
    }, 0)
  }

  return { solve1, solve2 }
}
