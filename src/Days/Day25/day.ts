import { DayResult } from '../../types'

export default function Day(): DayResult {
  const initialComponents = new Map<string, string[]>()
  let components = new Map<string, string[]>()

  function addConnectionToComponent(name: string, connectionsToAdd: string[]) {
    const connections = initialComponents.get(name) ?? []
    connectionsToAdd.forEach((con) => {
      if (connections.includes(con)) return
      connections.push(con)
    })
    initialComponents.set(name, connections)
  }

  function init(input: string[]) {
    input.forEach((line) => {
      const [name, ...connections] = line.replace(':', '').split(' ')
      addConnectionToComponent(name, connections)
      connections.forEach((con) => {
        addConnectionToComponent(con, [name])
      })
    })
    components = new Map<string, string[]>(initialComponents)
  }

  function mergeComponents(cmpToMerge: string[]) {
    const newComponentName = cmpToMerge.join('-')
    const newConnections: string[] = []
    for (const cmp of cmpToMerge) {
      components.get(cmp)?.forEach((con) => {
        if (!cmpToMerge.includes(con)) newConnections.push(con)
      })
      components.delete(cmp)
    }
    newConnections.sort()
    components.set(newComponentName, newConnections)
    newConnections.forEach((cmp) => {
      components.set(
        cmp,
        components
          .get(cmp)
          ?.map((con) => {
            if (cmpToMerge.includes(con)) return newComponentName
            return con
          })
          ?.sort() ?? []
      )
    })
    return [newComponentName, newConnections]
  }

  function printComponents() {
    components.forEach((connections, cmp) => {
      console.log(cmp, ' connects to', connections.length, Array.from(connections.values()).join(', '))
    })
  }

  function pickAtRandom() {
    const allConnection = new Set<[string, string]>()
    components.forEach((cmpCons, cmp) => {
      cmpCons.forEach((con) => {
        const [a, b] = [cmp, con].sort()
        allConnection.add([a, b])
      })
    })
    const index = Math.floor(Math.random() * allConnection.size)
    return Array.from(allConnection)[index]
  }

  function trySolve() {
    while (components.size > 2) {
      const con = pickAtRandom()
      mergeComponents(con)
    }
  }

  // using Kargers Min Cut Algorithm
  // https://www.cs.princeton.edu/courses/archive/fall13/cos521/lecnotes/lec2final.pdf
  async function solve1(input: string[]) {
    init(input)
    printComponents()

    while (true) {
      components = new Map<string, string[]>(initialComponents)
      trySolve()
      let all3 = true
      for (const cmp of components) {
        if (cmp[1].length !== 3) {
          all3 = false
          break
        }
      }
      if (all3) break
    }

    printComponents()

    let result = 1
    components.forEach((_, cmp) => {
      result *= cmp.split('-').length
    })

    return result
  }

  async function solve2(input: string[]) {
    return ''
  }

  return { solve1, solve2 }
}
