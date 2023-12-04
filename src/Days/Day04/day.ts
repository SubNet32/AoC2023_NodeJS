import { StringUtils } from '../../Utils/StringUtils'
import { DayResult } from '../../types'

type Card = {
  number: number
  sumOfWinCards: number
}

export default function Day(): DayResult {
  function parseInput(input: string) {
    const [name, values] = input.replace('Card ', '').split(':')
    const [winningNumbersString, cardNumbersString] = values.split('|')
    const winningNumbers = StringUtils.getAllNumbersInString(winningNumbersString)
    const cardNumbers = StringUtils.getAllNumbersInString(cardNumbersString)
    const points = cardNumbers.filter((cn) => winningNumbers.includes(cn))
    return { number: Number.parseInt(name), points: points.length, winningNumbers, cardNumbers }
  }

  async function solve1(input: string[]) {
    return input.reduce((sum, line) => {
      const { points } = parseInput(line)
      if (!points) return sum
      return sum + Math.pow(2, points - 1)
    }, 0)
  }
  async function solve2(input: string[]) {
    input.reverse()
    const cards: Card[] = []
    input.forEach((line) => {
      const { number, points } = parseInput(line)
      let sum = 0
      if (points) {
        for (let i = 0; i < points; i++) {
          const cardIndex = cards.length - (i + 1)
          if (cardIndex < 0) break
          sum += cards[cardIndex].sumOfWinCards + 1 // +1 for itself
        }
      }
      cards.push({ number, sumOfWinCards: sum })
    })

    return cards.reduce(
      (sum, card) => sum + card.sumOfWinCards + 1, // +1 for itself
      0
    )
  }

  return { solve1, solve2 }
}
