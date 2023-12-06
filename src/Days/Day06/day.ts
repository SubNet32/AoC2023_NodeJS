import { NumberUtils } from '../../Utils/NumberUtils'
import { StringUtils } from '../../Utils/StringUtils'
import { DayResult } from '../../types'

type Race = {
  duration: number
  record: number
}

export default function Day(): DayResult {
  async function solve1(input: string[]) {
    const durations = StringUtils.getAllNumbersInString(input[0])
    const records = StringUtils.getAllNumbersInString(input[1])
    const races = durations.map<Race>((duration, index) => ({ duration, record: records[index] }))

    return races.reduce((product, race) => {
      const { x1, x2 } = NumberUtils.solveQuadraticEquation(1, -race.duration, race.record + 1)
      const lower = Math.ceil(Math.min(x1, x2))
      const upper = Math.floor(Math.max(x1, x2))

      return product * (upper - lower + 1)
    }, 1)
  }
  async function solve2(input: string[]) {
    const durations = StringUtils.getAllNumbersInString(input[0])
    const records = StringUtils.getAllNumbersInString(input[1])
    const race: Race = { duration: Number(durations.join('')), record: Number(records.join('')) }
    const { x1, x2 } = NumberUtils.solveQuadraticEquation(1, -race.duration, race.record + 1)
    const lower = Math.ceil(Math.min(x1, x2))
    const upper = Math.floor(Math.max(x1, x2))

    return upper - lower + 1
  }

  return { solve1, solve2 }
}

// distance = x * (t - x)
// time = 7 record = 9
// y = x * (t - x) = xt - x^2
// offset by record +1 to find ranges ->  -x^2 +xt - (r+1) = 0  ->  x^2 -xt + r+1 = 0
// ax2 + bx + c = 0
