import { DayResult } from '../../types'

type Lense = {
  label: string
  focalLen: number
}

export default function Day(): DayResult {
  function hashValue(value: string) {
    let hash = 0
    Array.from(value).forEach((char) => {
      hash += char.charCodeAt(0)
      hash *= 17
      hash %= 256
    })
    return hash
  }

  async function solve1(input: string[]) {
    return input
      .join('')
      .split(',')
      .reduce((sum, value) => (sum += hashValue(value)), 0)
  }

  async function solve2(input: string[]) {
    const map: Lense[][] = Array(256)
      .fill(0)
      .map(() => [])
    input
      .join('')
      .split(',')
      .forEach((line) => {
        // rn=1 cm-
        const [label, op, focalLen] = line.split(/(=|-)/)
        const boxIndex = hashValue(label)
        if (op === '-') {
          map[boxIndex] = map[boxIndex].filter((l) => l.label !== label)
        } else {
          const foundLabel = map[boxIndex].find((l) => l.label === label)
          if (foundLabel) foundLabel.focalLen = Number(focalLen)
          else map[boxIndex].push({ label, focalLen: Number(focalLen) })
        }
        // console.log('After', line)
        // map.filter((m) => m.length).forEach((lenses, index) => console.log('Box', index, ': ', lenses))
      })

    return map.reduce((sum, lenses, index) => sum + lenses.reduce((lenSum, lense, lenIndex) => lenSum + (index + 1) * (lenIndex + 1) * lense.focalLen, 0), 0)
  }

  return { solve1, solve2 }
}
