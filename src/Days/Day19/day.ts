import { DayResult } from '../../types'
import { Range } from '../../types/numeric/Range'

type Part = {
  x: number
  m: number
  a: number
  s: number
}

type PartRange = Record<keyof Part, Range>

type Instruction = {
  source: string
  key?: keyof Part
  operation?: string
  value?: number
  target: string
}

export default function Day(): DayResult {
  const map = new Map<string, Instruction[]>()
  function init(input: string[]) {
    const parts: Part[] = []
    input.forEach((line) => {
      if (!line) return
      if (line.startsWith('{')) {
        const part = line
          .replace(/[{}]/g, '')
          .split(',')
          .map((term) => term.split('='))
          .reduce<Part>((part, [key, value]) => ({ ...part, [key]: Number(value) }), { x: 0, m: 0, a: 0, s: 0 })
        parts.push(part)
        return
      }

      const [name, instructionString] = line.replace('}', '').split('{')
      const instructions = instructionString.split(',').map<Instruction>((term) => {
        if (!term.includes(':')) {
          return { source: name, target: term } as Instruction
        }
        const [opS, target] = term.split(':')
        return {
          source: name,
          target,
          key: opS[0],
          operation: opS[1],
          value: Number(opS.substring(2)),
        } as Instruction
      })
      map.set(name, instructions)
    })

    return { parts }
  }

  function runInstructionOn(part: Part, instruction: Instruction) {
    if (!instruction.key || !instruction.value || !instruction.operation) return instruction.target
    const value = part[instruction.key]
    switch (instruction.operation) {
      case '>':
        if (value > instruction.value) return instruction.target
        else return null
      case '<':
        if (value < instruction.value) return instruction.target
        else return null
      default:
        return null
    }
  }

  async function solve1(input: string[]) {
    const { parts } = init(input)

    const acceptedParts: Part[] = []

    parts.forEach((part) => {
      let step = 'in'
      while (!['A', 'R'].includes(step)) {
        for (const instruction of map.get(step) ?? []) {
          const targetFound = runInstructionOn(part, instruction)
          if (targetFound) {
            step = targetFound
            break
          }
        }
      }
      if (step === 'A') acceptedParts.push(part)
    })

    return acceptedParts.reduce((sum, part) => sum + part.a + part.m + part.s + part.x, 0)
  }

  function limitRangeByInstruction(range: Range, operation: string, value: number): { accepted: Range | null; denied: Range | null } {
    if (operation === '<') {
      return { accepted: Range.FromNumbers(range.start, value - 1), denied: Range.FromNumbers(value, range.end) }
    }
    if (operation === '>') {
      return { accepted: Range.FromNumbers(value + 1, range.end), denied: Range.FromNumbers(range.start, value) }
    }
    throw new Error('Invalid operation')
  }

  function applyInstructionToRange(part: PartRange, instruction: Instruction) {
    let acceptedRange: PartRange | null = { ...part }
    let deniedRange: PartRange | null = { ...part }

    if (!instruction.key || !instruction.value || !instruction.operation) return { acceptedRange, deniedRange: null }

    const { accepted, denied } = limitRangeByInstruction(part[instruction.key], instruction.operation, instruction.value)
    accepted ? (acceptedRange[instruction.key] = accepted) : (acceptedRange = null)
    denied ? (deniedRange[instruction.key] = denied) : (deniedRange = null)
    return { acceptedRange, deniedRange }
  }

  function findAcceptedRanges(step: string, inPart: PartRange) {
    let acceptedRanges: PartRange[] = []
    let part: PartRange = { ...inPart }
    for (const instruction of map.get(step) ?? []) {
      if (instruction.target === 'A' && !instruction.operation) {
        acceptedRanges.push(part)
        break
      }
      if (instruction.target === 'R' && !instruction.operation) break
      const { acceptedRange, deniedRange } = applyInstructionToRange(part, instruction)
      if (acceptedRange) {
        if (instruction.target === 'A') {
          acceptedRanges.push(acceptedRange)
        } else if (instruction.target !== 'R') {
          const ranges = findAcceptedRanges(instruction.target, acceptedRange)
          if (ranges) acceptedRanges.push(...ranges)
        }
      }
      if (!deniedRange) break
      part = deniedRange
    }
    return acceptedRanges
  }

  async function solve2(input: string[]) {
    init(input)
    const ranges = findAcceptedRanges('in', { a: new Range(1, 4000), m: new Range(1, 4000), s: new Range(1, 4000), x: new Range(1, 4000) })
    return ranges.reduce((sum, range) => sum + range.a.size() * range.m.size() * range.s.size() * range.x.size(), 0)
  }

  return { solve1, solve2 }
}
