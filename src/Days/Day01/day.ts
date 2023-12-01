import { StringUtils } from '../../Utils/StringUtils'
import { DayResult, NumberValues } from '../../types'

export default function Day(): DayResult {
  function matchNumbers(value: string) {
    const num = value.replace(/[^\d]/g, '')
    return num
  }

  function sumFirstAndLastDigit(value: string) {
    const num = matchNumbers(value)
    // if (num.length < 2) return 0
    return Number(`${num[0]}${num[num.length - 1]} `)
  }

  function stringReplacer(value: string, ...tuples: [string, string][]) {
    let newString = ''
    for (let i = 0; i < value.length; i++) {
      if (StringUtils.isNumberString(value[i])) {
        newString += value[i]
        continue
      }
      const foundTuple = tuples.find((t) => value.substring(i).toLowerCase().startsWith(t[0].toLowerCase()))
      if (!foundTuple) continue
      newString += foundTuple[1]
    }

    return newString
  }

  function replaceNumberString(value: string) {
    return stringReplacer(value, ...Object.entries(NumberValues).map<[string, string]>(([key, value]) => [key, value.toString()]))
  }

  async function solve1(input: string[]) {
    return input.reduce((result, current) => result + sumFirstAndLastDigit(current), 0)
  }
  async function solve2(input: string[]) {
    return input.reduce((result, current) => result + sumFirstAndLastDigit(replaceNumberString(current)), 0)
  }

  return { solve1, solve2 }
}
