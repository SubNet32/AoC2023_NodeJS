import { obj } from '../../Utils/ObjectUtils'
import { DayResult } from '../../types'

type ColorCounter = {
  red: number
  green: number
  blue: number
}

type Game = {
  id: number
  shownColors: ColorCounter[]
}

export default function Day(): DayResult {
  function parseGames(input: string[]) {
    const games: Game[] = input.map<Game>((value) => {
      const [gameId, gameInput] = value.replace('Game ', '').split(':')
      const gameValues = gameInput.split(';').map((q) => q.trim().split(','))
      return {
        id: Number(gameId),
        shownColors: gameValues.map((values) => {
          const result: ColorCounter = { red: 0, green: 0, blue: 0 }
          for (const key of obj.keys(result)) {
            result[key] = Number(
              values
                .find((v) => v.includes(key))
                ?.trim()
                ?.split(' ')[0]
                ?.trim() || '0'
            )
          }
          return result
        }),
      }
    })
    return games
  }

  function isGamePossible(game: Game, colors: ColorCounter) {
    return !game.shownColors.find((q) => !!obj.keys(q).find((key) => q[key] > colors[key]))
  }

  function getMaxColorCount(game: Game): ColorCounter {
    const result: ColorCounter = { red: 0, green: 0, blue: 0 }

    for (const key of obj.keys(result)) {
      result[key] = Math.max(...game.shownColors.map((c) => c[key]))
    }

    return result
  }

  async function solve1(input: string[]) {
    const games = parseGames(input)
    return games.reduce((result, game) => {
      if (isGamePossible(game, { red: 12, green: 13, blue: 14 })) {
        console.log('possible game:', game.id)
        return result + game.id
      }

      console.log('impossible game:', game.id)
      return result
    }, 0)
  }
  async function solve2(input: string[]) {
    const games = parseGames(input)

    return games.reduce<number>((result, game) => {
      const lowestColorCount = getMaxColorCount(game)
      result += obj
        .keys(lowestColorCount)
        .map((key) => lowestColorCount[key])
        .reduce<number>((product, count) => product * count, 1)
      return result
    }, 0)
  }

  return { solve1, solve2 }
}
