export const StringUtils = {
  isNumberString(value: string) {
    return !!value.match(/^\d+$/)
  },
  getAllNumbersInString(value: string, includeNegative?: boolean) {
    if (includeNegative) {
      return value.match(/-{0,1}\d+/g)?.map((match) => Number(match)) ?? []
    }
    return value.match(/\d+/g)?.map((match) => Number(match)) ?? []
  },
  getPositionInString(stringToCheck: string, value: string) {
    if (!stringToCheck.includes(value)) return null
    const start = stringToCheck.indexOf(value)
    return { start, end: start + value.length - 1 }
  },
  replaceRange(value: string, start: number, end: number, replaceValue: string) {
    const replaceValueLength = end - start
    const safeReplaceValue = replaceValue.repeat(replaceValueLength).substring(0, replaceValueLength)
    return value.substring(0, start) + safeReplaceValue + value.substring(end)
  },
  getCharPositionsInString(value: string, char: string) {
    if (!value.includes(char)) return []
    return Array.from(value).reduce<number[]>((positions, current, index) => (current === char ? [...positions, index] : positions), [])
  },
  insertAt(value: string, insert: string, position: number) {
    return (value.substring(0, position) + insert + value.substring(position + insert.length)).substring(0, value.length)
  },
  rotateStringArray(values: string[]) {
    const result: string[] = []
    for (let x = 0; x < values[0].length; x++) {
      let line = ''
      for (let y = values.length - 1; y >= 0; y--) {
        line += values[y][x]
      }
      result.push(line)
    }
    return result
  },
  getDifferenceCount(a: string, b: string) {
    let result = 0
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (i >= a.length || i >= b.length || a[i] !== b[i]) result++
    }
    return result
  },
}
