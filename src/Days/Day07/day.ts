import { PokerCardValues } from '../../constants/constants'
import { DayResult } from '../../types'
import { CamelCardHand } from './CamelCardHand'

export default function Day(): DayResult {
  async function solve1(input: string[]) {
    const hands = input.map((line) => new CamelCardHand(line))
    hands.sort(CamelCardHand.sort)

    return hands.reduce((sum, hand, index) => (sum += (hands.length - index) * hand.bid), 0)
  }
  async function solve2(input: string[]) {
    PokerCardValues.set('J', 0)
    const hands = input.map((line) => new CamelCardHand(line, true))

    hands.sort(CamelCardHand.sort)

    return hands.reduce((sum, hand, index) => (sum += (hands.length - index) * hand.bid), 0)
  }

  return { solve1, solve2 }
}
