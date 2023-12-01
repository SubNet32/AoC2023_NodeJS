export type DayFile = {
  file: string
  day: number
  isTest: boolean
}

export interface DayResult {
  solve1: (input: string[]) => Promise<any>
  solve2: (input: string[]) => Promise<any>
}

export type StartupArguments = {
  day?: number
  part?: number
  test: boolean
}

export const NumberValues = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}
