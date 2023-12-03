import { StringUtils } from '../../Utils/StringUtils'
import { DayResult } from '../../types'
import { Rectangle } from '../../types/2D/Rectangle'
import Vector2 from '../../types/2D/Vector2'

type EngineNumber = {
  value: number
  start: Vector2
  end: Vector2
}

type EngineSymbol = {
  value: string
  position: Vector2
}

export default function Day(): DayResult {
  function init(input: string[]) {
    const numbers: EngineNumber[] = []
    const symbols: EngineSymbol[] = []

    input.forEach((line, y) => {
      const numbersInLine = StringUtils.getAllNumbersInString(line)
      let lineCopy = line
      for (const num of numbersInLine) {
        const posInString = StringUtils.getPositionInString(lineCopy, num.toString())
        if (!posInString) throw new Error(`Number ${num} previously found in current line, could no longer be found. ${line}`)
        numbers.push({ value: num, start: new Vector2(posInString.start, y), end: new Vector2(posInString.end, y) })
        lineCopy = StringUtils.replaceRange(lineCopy, posInString.start, posInString.end + 1, '.')
      }
      const symbolsInLine = line.match(/[^\d.]{1}/g)?.map((q) => q.toString()) ?? []
      lineCopy = line
      for (const sym of symbolsInLine) {
        const posInString = StringUtils.getPositionInString(lineCopy, sym.toString())
        if (!posInString) throw new Error(`Symbol ${sym} previously found in current line, could no longer be found. ${line}`)
        if (posInString.start !== posInString.end) throw new Error(`Symbol ${sym} with length > 1 found. This should not happen`)
        symbols.push({ value: sym, position: new Vector2(posInString.start, y) })
        lineCopy = StringUtils.replaceRange(lineCopy, posInString.start, posInString.end + 1, '.')
      }
    })

    return { numbers, symbols }
  }

  async function solve1(input: string[]) {
    const { numbers, symbols } = init(input)
    const legitNumbers = numbers.filter((num) => {
      const boundRect = new Rectangle(num.start, num.end).grow(1)
      return !!symbols.find((sym) => boundRect.containsPoint(sym.position))
    })

    return legitNumbers.reduce((sum, num) => sum + num.value, 0)
  }
  async function solve2(input: string[]) {
    const { numbers, symbols } = init(input)
    return symbols.reduce((sum, sym) => {
      const boundRect = new Rectangle(sym.position, sym.position).grow(1)
      const foundNumbers = numbers.filter((num) => boundRect.intersects(new Rectangle(num.start, num.end)))
      if (foundNumbers.length === 2) return sum + foundNumbers.reduce((prod, num) => prod * num.value, 1)
      return sum
    }, 0)
  }

  return { solve1, solve2 }
}
