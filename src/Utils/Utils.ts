import { DayFile, StartupArguments } from '../types'

const Utils = {
  mapFiles(files: string[]): DayFile[] {
    return files
      .filter((q) => q.match(/^day\d{2}(_test)?.txt/g))
      .map((file) => ({
        file,
        day: Utils.extractDay(file),
        isTest: !!file.includes('test'),
      }))
  },
  extractDay(file: string) {
    try {
      const match = file.match(/\d{2}/)?.pop()
      if (!match) return 0
      return Number.parseInt(match)
    } catch (_reason) {
      return 0
    }
  },
  getMaxDay(files: DayFile[], getTest: boolean) {
    return files.reduce<DayFile | undefined>((maxDay, currentDay) => {
      if (maxDay === undefined) return currentDay
      if (currentDay.day > maxDay.day || (currentDay.day === maxDay.day && currentDay.isTest === getTest)) return currentDay
      return maxDay
    }, undefined)
  },
  XOR(a: any, b: any) {
    return (!!a && !b) || (!a && !!b)
  },
  logAndPassThrough<T>(value: T, message?: string, printIf?: (value: T) => boolean) {
    if (!printIf || !!printIf(value)) console.log(message ?? '', value)
    return value
  },
  getNumberFromString(stringToParse: string, ignoreExceptions?: boolean) {
    if (!stringToParse) return undefined
    try {
      return Number.parseInt(stringToParse.replace(/[^\d]/g, ''))
    } catch (exception) {
      if (!ignoreExceptions) throw exception
      return undefined
    }
  },
  getProcessArgs(): StartupArguments {
    const processArgs = process.argv.slice(2)
    const day = processArgs.find((a) => a.toLowerCase().includes('day') || !!a.match(/^\d+$/))
    const part = processArgs.find((a) => a.toLowerCase().includes('part'))
    return { day: this.getNumberFromString(day ?? '', true), part: this.getNumberFromString(part ?? '', true), test: !!processArgs.find((a) => a.toLowerCase().includes('test')) }
  },
  containsDuplicate<T>(items: T[]) {
    if (!items) return undefined
    return items.length !== new Set(items).size
  },
  sum<T>(items: T[] | undefined, valueExtractor: (item: T) => number) {
    if (!items) return 0
    return items.reduce((sum, currentItem) => sum + valueExtractor(currentItem), 0)
  },
  rotateArray<T>(items: T[]) {
    let item = items.shift()
    if (item) items.push(item)
    return item
  },
  countElements<T>(items: T[], compareFunction: (a: T, b: T) => boolean = (a, b) => a === b) {
    const result: { item: T; count: number }[] = []
    items.forEach((item) => {
      const foundItem = result.find((r) => compareFunction(r.item, item))
      if (foundItem) foundItem.count++
      else result.push({ item, count: 1 })
    })
    result.sort((a, b) => a.count - b.count)
    return result
  },
}

export default Utils
