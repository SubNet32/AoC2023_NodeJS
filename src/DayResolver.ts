import { exit } from 'process'
import { DayFile, DayResult } from './types'

async function importDay(day: number): Promise<DayResult | undefined> {
  const dayId = day.toString().padStart(2, '0')
  return (await import(`./Days/Day${dayId}/Day`)).default()
}

export async function DayResolver(dayFile: DayFile, input: string[], part: number | undefined) {
  const day = await importDay(dayFile.day)
  if (!day) throw 'invalid day'

  const startTime = Date.now()

  console.log(`Running Day${dayFile.day} P${part ?? '?'}${dayFile.isTest ? ' Test' : ''}`)
  if (!part) {
    day
      .solve2(input)
      .then((result) => {
        if (result === '') day.solve1(input).then((result) => handleResult(result, 1))
        else handleResult(result, 2)
      })
      .catch(handleError)
  } else if (part === 2)
    day
      .solve2(input)
      .then((result) => handleResult(result, 2))
      .catch(handleError)
  else if (part === 1)
    day
      .solve1(input)
      .then((result) => handleResult(result, 1))
      .catch(handleError)
  else throw `Invalid Part '${part}'`

  function handleError(reason: any) {
    console.error('\n\nERROR:', reason, '\n\n')
    exit()
  }

  function handleResult(result: any, part: number) {
    console.log(`\nResult Day${dayFile.day} P${part}${dayFile.isTest ? ' Test' : ''} after ${(Date.now() - startTime) / 1000}s :`, result.toString(), '\n\n')
    exit()
  }
}
