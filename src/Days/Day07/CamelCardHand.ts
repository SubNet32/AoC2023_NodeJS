import { PokerCardValues } from '../../constants/constants'

const CardStrengths = {
  fiveOfAKind: 6,
  fourOfAKind: 5,
  fullHouse: 4,
  threeOfAKind: 3,
  twoPairs: 2,
  onePair: 1,
  highCard: 0,
} as const

type CardCounter = { [card: string]: number }

export class CamelCardHand {
  public value: string
  public bid: number
  public strength: number = 0

  constructor(value: string, part2?: boolean) {
    const [hand, bid] = value.split(' ')
    this.value = hand
    this.bid = Number(bid)
    this.strength = part2 ? CamelCardHand.determineStrength2(hand) : CamelCardHand.determineStrength(hand)
  }

  public static determineStrength(value: string) {
    const counter: CardCounter = {}
    for (const char of value) {
      counter[char] = (counter[char] ?? 0) + 1
    }
    if (Object.values(counter).includes(5)) return CardStrengths.fiveOfAKind
    if (Object.values(counter).includes(4)) return CardStrengths.fourOfAKind
    if (Object.values(counter).includes(3) && Object.values(counter).includes(2)) return CardStrengths.fullHouse
    if (Object.values(counter).includes(3)) return CardStrengths.threeOfAKind
    if (Object.values(counter).filter((q) => q === 2).length === 2) return CardStrengths.twoPairs
    if (Object.values(counter).filter((q) => q === 2).length === 1) return CardStrengths.onePair
    return CardStrengths.highCard
  }

  public static determineStrength2(value: string) {
    const counter: CardCounter = {}
    for (const char of value) {
      counter[char] = (counter[char] ?? 0) + 1
    }
    if (counter.J > 0) {
      if (counter.J === 5) {
        counter['A'] = 5
      } else {
        const bestCardCounter = Object.entries(counter).reduce<null | [string, number]>((best, [key, value]) => {
          if (key !== 'J' && (!best || value > best[1])) return [key, value]
          return best
        }, null)
        if (bestCardCounter) counter[bestCardCounter[0]] += counter.J
      }
      counter.J = 0
    }

    if (Object.values(counter).includes(5)) return CardStrengths.fiveOfAKind
    if (Object.values(counter).includes(4)) return CardStrengths.fourOfAKind
    if (Object.values(counter).includes(3) && Object.values(counter).includes(2)) return CardStrengths.fullHouse
    if (Object.values(counter).includes(3)) return CardStrengths.threeOfAKind
    if (Object.values(counter).filter((q) => q === 2).length === 2) return CardStrengths.twoPairs
    if (Object.values(counter).filter((q) => q === 2).length === 1) return CardStrengths.onePair
    return CardStrengths.highCard
  }

  public static sort(a: CamelCardHand, b: CamelCardHand) {
    if (a.strength !== b.strength) return b.strength - a.strength
    for (let i = 0; i < a.value.length; i++) {
      const valueA = PokerCardValues.get(a.value[i]) ?? 0
      const valueB = PokerCardValues.get(b.value[i]) ?? 0
      if (valueA !== valueB) return valueB - valueA
    }
    throw new Error(`Same value detected. How to handle? ${a.value}`)
  }
}
