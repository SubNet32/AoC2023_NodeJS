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

  function findPossibleAssignments(line: string, values: number[], startAt: number = 0): string[] {
    if (log) console.log('Matching', line, values)
    const memValues = [...values]
    const lengthToMatch = memValues.shift() ?? 0
    const restLen = memValues.reduce((sum, v) => sum + v + 1, 0)
    const maxI = line.length - restLen - lengthToMatch
    const matches: string[] = []
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
          matches.push(...findPossibleAssignments(newLine, memValues, i + lengthToMatch + 1))
        } else {
          if (!line.substring(i + lengthToMatch + 1).includes('#')) {
            let newLine = StringUtils.insertAt(line, '#'.repeat(lengthToMatch) + '.', i)
            if (log) console.log('Match', chalk.yellow(newLine))
            matches.push(newLine)
          }
        }
      }
      if (line[i] === '#') break
    }

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
      const matches = findPossibleAssignments(row.line, row.values)
      if (log) {
        console.log('Matches', matches.length)
        console.log(row.line, row.values)
      }
      matches.forEach((match) => {
        testMatches(match, row.line, row.values)
        if (log) {
          console.log(
            Array.from(match)
              .map((q) => (q === '#' ? chalk.yellow(q) : q))
              .join('')
          )
        }
      })
      if (log) {
        console.log('')
        console.log('')
      }
      return sum + matches.length
    }, 0)
  }

  async function solve2(input: string[]) {
    const rows = init(input)
    const rows2 = init(input, 2)
    const rows3 = init(input, 3)
    const rows5 = init(input, 5)
    const rowsMod = init(input, 1, '?')
    const rowsModStart = init(input, 1, '', '?')

    return rows.reduce<bigint>((sum, row, index) => {
      console.log('Row', index)

      const matches = BigInt(findPossibleAssignments(row.line, row.values).length)
      const matches2 = BigInt(findPossibleAssignments(rows2[index].line, rows2[index].values).length)
      const matches3 = BigInt(findPossibleAssignments(rows3[index].line, rows3[index].values).length)
      const mod = BigInt(findPossibleAssignments(rowsMod[index].line, rowsMod[index].values).length)
      const modStart = BigInt(findPossibleAssignments(rowsModStart[index].line, rowsModStart[index].values).length)
      const factor = matches2 / matches
      if (matches * factor * factor !== matches3) {
        console.log('Err')
      }
      const totalMatches = matches * factor ** BigInt(4)
      return sum + totalMatches
    }, BigInt(0))
  }

  return { solve1, solve2 }
}
