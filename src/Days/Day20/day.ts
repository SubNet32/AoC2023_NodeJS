import { NumberUtils } from '../../Utils/NumberUtils'
import { DayResult } from '../../types'

type ModuleType = '%' | '&' | 'b' | 'none'
type Module = {
  type: ModuleType
  name: string
  memValue: boolean
  targets: string[]
  sourcesValues: Map<string, ConjunctionSource>
}

type ConjunctionSource = {
  name: string
  memValue: boolean
}

type Pulse = {
  pos: string
  from: string
  value: boolean
}

export default function Day(): DayResult {
  const modules = new Map<string, Module>()

  function init(input: string[]) {
    input.forEach((line) => {
      let [name, targetsString] = line.split(' -> ')
      const type = name[0] as ModuleType
      const targets = targetsString.split(',').map((q) => q.trim())
      if (type !== 'b') name = name.substring(1)
      modules.set(name, { type, name, targets, memValue: false, sourcesValues: new Map<string, ConjunctionSource>() } as Module)
    })
    modules.forEach((value) => {
      value.targets.forEach((target) => {
        const targetModule = modules.get(target)
        if (!targetModule) {
          modules.set(target, { type: 'none', name: target, targets: [], memValue: false, sourcesValues: new Map<string, ConjunctionSource>() })
          return
        }
        if (targetModule.type === '&') targetModule.sourcesValues.set(value.name, { name: value.name, memValue: false })
      })
    })
  }

  function handlePulse(pulse: Pulse): { targets: string[]; value: boolean } {
    const module = modules.get(pulse.pos) as Module
    if (module.type === 'b') return { targets: module.targets, value: pulse.value }
    if (module.type === '%') {
      if (pulse.value) return { targets: [], value: false }
      module.memValue = !module.memValue
      return { targets: module.targets, value: module.memValue }
    }
    if (module.type === '&') {
      const sourceModule = module.sourcesValues.get(pulse.from)
      if (!sourceModule) throw new Error(`Could not find source module ${pulse.pos} in ${JSON.stringify(module)}`)
      sourceModule.memValue = pulse.value
      let allHigh = true
      for (const sm of module.sourcesValues.values()) {
        if (!sm.memValue) {
          allHigh = false
          break
        }
      }
      return { targets: module.targets, value: !allHigh }
    }
    if (module.type === 'none') {
      return { targets: [], value: false }
    }
    throw new Error(`Unable to handle pulse ${JSON.stringify(pulse)}`)
  }

  function isInitialState() {
    for (const [_, m] of modules) {
      if (m.memValue) return false
      for (const [_, sm] of m.sourcesValues) {
        if (sm.memValue) return false
      }
    }
    return true
  }

  async function solve1(input: string[]) {
    init(input)

    const pulses: Pulse[] = []
    let lowCounter = 0
    let highCounter = 0
    let buttonPresses = 0
    do {
      pulses.push({ pos: 'broadcaster', value: false, from: 'button' })
      lowCounter++
      buttonPresses++
      while (pulses.length) {
        const pulse = pulses.shift() as Pulse
        const result = handlePulse(pulse)
        if (result.targets.length) {
          // console.log(pulse.pos, `-${result.value ? 'high' : 'low'}->`, result.targets.join(', '))

          if (result.value) highCounter += result.targets.length
          else lowCounter += result.targets.length

          pulses.push(...result.targets.map<Pulse>((t) => ({ pos: t, value: result.value, from: pulse.pos })))
        }
      }
      // console.log('')
    } while (buttonPresses < 1000)
    console.log('HighCounter', highCounter)
    console.log('LowCounter', lowCounter)

    return lowCounter * (1000 / buttonPresses) * highCounter * (1000 / buttonPresses)
  }

  async function solve2(input: string[]) {
    init(input)
    const target = Array.from(modules.values()).find((q) => q.targets.includes('rx')) as Module
    const requiredModules = Array.from(target.sourcesValues.values()).map((q) => ({ name: q.name, onAfter: 0, offAfter: 0 }))

    const pulses: Pulse[] = []
    let buttonPresses = 0
    do {
      pulses.push({ pos: 'broadcaster', value: false, from: 'button' })
      buttonPresses++
      while (pulses.length) {
        const pulse = pulses.shift() as Pulse
        const result = handlePulse(pulse)

        const reqMod = requiredModules.find((rm) => rm.name === pulse.pos)
        if (reqMod) {
          if (!result.value && reqMod.onAfter) {
            reqMod.offAfter = buttonPresses
          }
          if (result.value && !reqMod?.onAfter) {
            reqMod.onAfter = buttonPresses
          }
        }

        if (result.targets.length) {
          // console.log(pulse.pos, `-${result.value ? 'high' : 'low'}->`, result.targets.join(', '))
          if (result.value === false && result.targets.includes('rx')) {
            return buttonPresses
          }

          pulses.push(...result.targets.map<Pulse>((t) => ({ pos: t, value: result.value, from: pulse.pos })))
        }
      }
    } while (buttonPresses < 10000 && requiredModules.find((rm) => !rm.onAfter || !rm.offAfter))
    requiredModules.forEach((mod) => console.log('Module', mod, 'switches', mod.onAfter, ' -> ', mod.offAfter))

    return NumberUtils.leastCommonMultiple(...requiredModules.map((m) => m.onAfter))
  }

  return { solve1, solve2 }
}
