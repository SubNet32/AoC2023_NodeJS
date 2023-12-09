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
}
