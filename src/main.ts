import * as fileSystem from 'fs'
import path from 'path'
import * as readline from 'readline'
import { DayResolver } from './DayResolver'
import { DayFile } from './types'
import Utils from './Utils/Utils'

const filesPath = './Files/'
readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('AoC2023 - By Philipp Priller')
const args = Utils.getProcessArgs()
const files = Utils.mapFiles(fileSystem.readdirSync(filesPath))
if (!!args.day) {
  loadDay(
    files.find((f) => f.day === args.day && f.isTest === args.test),
    args.part
  )
} else {
  loadDay(Utils.getMaxDay(files, args.test), args.part)
}

function loadDay(day: DayFile | undefined, part?: number) {
  if (!day) throw `File for day-test combination does not exist`
  const file = path.join(filesPath, day.file)
  const content = fileSystem
    .readFileSync(file, {
      encoding: 'utf-8',
    })
    .split('\r\n')

  DayResolver(day, content, part)
}
