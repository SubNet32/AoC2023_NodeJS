import chalk from 'chalk'
import { DayResult } from '../../types'
import { FieldMap } from '../../types/2D/FieldMap'
import Vector2 from '../../types/2D/Vector2'
import { Point2D } from '../../types/2D/types2D'
import { Node, PathFinder, PathNode } from './PathFinder'
import { PathFinderPart2, SubPathNode } from './PathFinderPart2'

const Directions = [Vector2.Up, Vector2.Down, Vector2.Left, Vector2.Right]
const TileDirections = {
  '>': Vector2.Right,
  '<': Vector2.Left,
  '^': Vector2.Down,
  v: Vector2.Up,
} as const

type TileType = keyof typeof TileDirections | '.'

export default function Day(): DayResult {
  const map = new FieldMap<TileType>()
  let log = true
  function init(input: string[]) {
    let startPoint = Vector2.Zero
    let endPoint = Vector2.Zero
    input.forEach((line, y) => {
      Array.from(line).forEach((c, x) => {
        if (c !== '#') {
          map.addItem({ x, y }, c as TileType)
          if (y === 0) startPoint = new Vector2(x, y)
          if (y === input.length - 1) endPoint = new Vector2(x, y)
        }
      })
    })
    return { startPoint, endPoint }
  }

  function printCurrentPath(currentNode: PathNode) {
    if (!log) return
    const path: { pos: Point2D; value: string }[] = [{ pos: currentNode.position, value: 'X' }]
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

    map.printField((v, pos) => {
      const foundPathNode = path.find((n) => Vector2.equals(n.pos, pos))
      if (foundPathNode) {
        if (foundPathNode.value === 'X') return chalk.red(foundPathNode.value)
        if (v === '.') return chalk.yellow(foundPathNode.value)
        else if (!!v) return chalk.blue(foundPathNode.value)
      }
      return v ?? '#'
    })
  }

  function printCurrentPos(node: Node) {
    if (!log) return
    map.printField((v, pos) => {
      if (Vector2.equals(pos, node.position)) return chalk.red('x')

      return v ?? '#'
    })
  }

  function getAdjacentNodes(currentNode: PathNode) {
    printCurrentPath(currentNode)
    const adjNodes: Node[] = []
    const currentTile = map.getItem(currentNode.position)
    if (currentTile && currentTile !== '.') {
      const dir = TileDirections[currentTile]
      adjNodes.push({ position: Vector2.Add(currentNode.position, dir), cost: currentNode.cost + 1 })
      return adjNodes
    }
    Directions.forEach((direction) => {
      const adjNodePos = Vector2.Add(currentNode.position, direction)
      if (currentNode.prevNode && adjNodePos.equals(currentNode.prevNode.position)) return
      const tile = map.getItem(adjNodePos)
      if (!tile) return
      if (tile !== '.') {
        const tileDir = TileDirections[tile]
        if (Vector2.Add(adjNodePos, tileDir).equals(currentNode.position)) return
      }
      adjNodes.push({ position: adjNodePos, cost: currentNode.cost + 1 })
    })
    return adjNodes
  }

  async function solve1(input: string[]) {
    if (input.length > 20) log = false
    const { startPoint, endPoint } = init(input)

    const path = PathFinder(startPoint, endPoint, getAdjacentNodes)

    return path?.cost ?? 0
  }

  function getAdjacentNodesPart2(currentNode: SubPathNode) {
    printCurrentPos(currentNode)
    const adjNodes: Node[] = []
    Directions.forEach((direction) => {
      const adjNodePos = Vector2.Add(currentNode.position, direction)
      if (currentNode.prevNode && adjNodePos.equals(currentNode.prevNode.position)) return
      const tile = map.getItem(adjNodePos)
      if (!tile) return
      adjNodes.push({ position: adjNodePos, cost: currentNode.cost + 1 })
    })
    return adjNodes
  }

  async function solve2(input: string[]) {
    log = false
    const { startPoint, endPoint } = init(input)

    return PathFinderPart2(startPoint, endPoint, getAdjacentNodesPart2)
  }

  return { solve1, solve2 }
}
