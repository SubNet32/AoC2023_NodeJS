import { StringUtils } from '../../Utils/StringUtils'
import { DayResult } from '../../types'

export default function Day(): DayResult {
  function calcDifferenceSequences(sequences: number[][]) {
    const diffSeq: number[] = []
    const sequence = sequences.at(-1) ?? []
    for (let i = 1; i < sequence.length; i++) {
      diffSeq.push(sequence[i] - sequence[i - 1])
    }
    sequences.push(diffSeq)

    if (isZeroSequence(diffSeq)) {
      return sequences
    }

    return calcDifferenceSequences(sequences)
  }

  function isZeroSequence(sequence: number[]) {
    return !sequence.find((n) => n !== 0)
  }

  function calcNextNumberForSequences(sequences: number[][]) {
    sequences[sequences.length - 1].push(0)
    sequences[sequences.length - 1].unshift(0)
    for (let i = sequences.length - 2; i >= 0; i--) {
      sequences[i].push(Number(sequences[i].at(-1)) + Number(sequences[i + 1].at(-1)))
      sequences[i].unshift(sequences[i][0] - sequences[i + 1][0])
    }

    return sequences
  }

  function printSequence(sequences: number[][]) {
    console.log('')
    console.log('')
    const longestNumber = Math.max(...sequences.flat(2).map((q) => Math.abs(q) * (q < 0 ? 10 : 1))).toString().length
    const numberOfSpaces = longestNumber
    const centerWithSpaces = (number: number) => {
      const prefixLen = Math.ceil(numberOfSpaces / 2) + (longestNumber - number.toString().length)
      const suffixLen = Math.floor(numberOfSpaces / 2)

      return ' '.repeat(prefixLen) + number.toString() + ' '.repeat(suffixLen)
    }
    sequences.forEach((seq, index) => {
      console.log(`${' '.repeat((Math.ceil(numberOfSpaces / 2) + (numberOfSpaces - longestNumber) + 1) * index)}${seq.map((n) => centerWithSpaces(n)).join('')}`)
    })
  }

  async function solve1(input: string[]) {
    const sequences = input.map((line) => StringUtils.getAllNumbersInString(line, true))

    let sum = 0
    sequences.forEach((seq) => {
      const diffSequences = calcNextNumberForSequences(calcDifferenceSequences([seq]))
      sum += diffSequences[0].at(-1) ?? 0
      // printSequence(diffSequences)
    })

    return sum
  }

  async function solve2(input: string[]) {
    const sequences = input.map((line) => StringUtils.getAllNumbersInString(line, true))

    let sum = 0
    sequences.forEach((seq) => {
      const diffSequences = calcNextNumberForSequences(calcDifferenceSequences([seq]))
      sum += diffSequences[0][0] ?? 0
      // printSequence(diffSequences)
    })

    return sum
  }

  return { solve1, solve2 }
}
