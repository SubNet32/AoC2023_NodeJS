import chalk from 'chalk'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'
import { Node, PathFinder, PathNode } from './PathFinder'
import { Point2D } from '../../types/2D/types2D'

export default function Day(): DayResult {
  const directions = [Vector2.Up, Vector2.Down, Vector2.Left, Vector2.Right]
  let log = true
  function printCurrentPath(currentNode: PathNode, field: FieldMap<number>) {
    if (!log) return
    const path: { pos: Point2D; value: string }[] = [{ pos: currentNode.position, value: '#' }]
    let tracer: PathNode | null = currentNode
    while (tracer?.prevNode) {
      const dir = Vector2.Sub(tracer.position, tracer.prevNode.position)
      let value = '?'
      if (dir.equals(Vector2.Up)) value = 'v'
      else if (dir.equals(Vector2.Down)) value = '^'
      else if (dir.equals(Vector2.Left)) value = '<'
      else if (dir.equals(Vector2.Right)) value = '>'

      tracer = tracer?.prevNode
      path.push({ pos: tracer.position, value })
    }

    field.printField((v, pos) => {
      const foundPathNode = path.find((n) => Vector2.equals(n.pos, pos))
      if (foundPathNode) {
        if (foundPathNode.value === '#') return chalk.red(foundPathNode.value)
        return chalk.yellow(foundPathNode.value)
      }
      return v?.toString() ?? ' '
    })
  }

  function getAdjacentNodes(currentNode: PathNode, field: FieldMap<number>) {
    printCurrentPath(currentNode, field)
    const adjNodes: Node[] = []
    directions.forEach((direction) => {
      const adjNodePos = Vector2.Add(currentNode.position, direction)
      if (!field.boundaries?.containsPoint(adjNodePos)) return
      if (currentNode.prevNode && adjNodePos.equals(currentNode.prevNode.position)) return
      let adjNodeDirection = Vector2.FromPoint(direction)
      if (Vector2.Zero.equals(currentNode.direction) || Vector2.Normalize(Vector2.FromPoint(currentNode.direction)).equals(direction)) {
        adjNodeDirection = Vector2.Add(currentNode.direction, direction)
      }
      if (adjNodeDirection.length() >= 4) {
        return
      }
      const adjNodeCost = field.getItem(adjNodePos)
      if (adjNodeCost) adjNodes.push({ position: adjNodePos, cost: currentNode.cost + adjNodeCost, direction: adjNodeDirection })
    })
    return adjNodes
  }

  function getAdjacentNodesP2(currentNode: PathNode, field: FieldMap<number>, endNode: Node) {
    printCurrentPath(currentNode, field)
    const adjNodes: Node[] = []
    directions.forEach((direction) => {
      const adjNodePos = Vector2.Add(currentNode.position, direction)
      if (!field.boundaries?.containsPoint(adjNodePos)) return
      if (currentNode.prevNode && adjNodePos.equals(currentNode.prevNode.position)) return
      let adjNodeDirection = Vector2.FromPoint(direction)
      if (Vector2.Zero.equals(currentNode.direction) || Vector2.Normalize(Vector2.FromPoint(currentNode.direction)).equals(direction)) {
        adjNodeDirection = Vector2.Add(currentNode.direction, direction)
      }
      if (!Vector2.Zero.equals(currentNode.direction)) {
        if (Vector2.equals(Vector2.FromPoint(currentNode.direction).normalize(), direction)) {
          if (adjNodeDirection.length() >= 11) return
        } else {
          if (Vector2.FromPoint(currentNode.direction).length() < 4) return
        }
      }
      if (adjNodePos.equals(endNode.position) && adjNodeDirection.length() < 4) return
      const adjNodeCost = field.getItem(adjNodePos)
      if (adjNodeCost) adjNodes.push({ position: adjNodePos, cost: currentNode.cost + adjNodeCost, direction: adjNodeDirection })
    })
    return adjNodes
  }

  async function solve1(input: string[]) {
    if (input.length > 20) log = false
    const field = FieldMap.fromInput<number>(input, (v) => Number(v))
    const startNode: Node = { position: Vector2.Zero, cost: 0, direction: Vector2.Zero }
    const endNodePos = new Vector2(input[0].length - 1, input.length - 1)
    const endNode: Node = { position: endNodePos, cost: field.getItem(endNodePos) ?? 0, direction: Vector2.Zero }
    if (!startNode || !endNode) throw new Error('Start or End not found')
    const path = PathFinder(startNode, endNode, (currentNode) => getAdjacentNodes(currentNode, field))
    printCurrentPath(path[0], field)
    return path[0].cost
  }

  async function solve2(input: string[]) {
    if (input.length > 20) log = false
    const field = FieldMap.fromInput<number>(input, (v) => Number(v))
    const startNode: Node = { position: Vector2.Zero, cost: 0, direction: Vector2.Zero }
    const endNodePos = new Vector2(input[0].length - 1, input.length - 1)
    const endNode: Node = { position: endNodePos, cost: field.getItem(endNodePos) ?? 0, direction: Vector2.Zero }
    if (!startNode || !endNode) throw new Error('Start or End not found')
    const path = PathFinder(startNode, endNode, (currentNode) => getAdjacentNodesP2(currentNode, field, endNode))
    printCurrentPath(path[0], field)
    return path[0].cost
  }

  return { solve1, solve2 }
}
