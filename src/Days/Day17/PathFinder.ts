import Heap from 'heap-js'
import Vector2 from '../../types/2D/Vector2'
import { Point2D } from '../../types/2D/types2D'

export type Node = {
  position: Point2D
  cost: number
  direction: Point2D
}

export type PathNode = {
  prevNode: PathNode | null
} & Node

function hashNode(node: Node) {
  return Vector2.toString(node.position) + '|' + Vector2.toString(node.direction)
}

export function PathFinder(startNode: Node, endNode: Node, getAdjacentNodes: (current: PathNode) => Node[]) {
  const addedNodes = new Set<string>()
  const nodesToCheck = new Heap<PathNode>((a, b) => a.cost - b.cost)
  let currentNode: PathNode = { position: startNode.position, prevNode: null, cost: 0, direction: Vector2.Zero }

  do {
    const adjNodes = getAdjacentNodes(currentNode)

    if (adjNodes?.length) {
      adjNodes.forEach((node) => {
        const nodeKey = hashNode(node)
        if (addedNodes.has(nodeKey)) return
        addedNodes.add(nodeKey)
        nodesToCheck.push({ ...node, prevNode: currentNode })
      })
    }

    const nextNode = nodesToCheck.pop()

    if (!nextNode) throw new Error('No path found')
    currentNode = nextNode
  } while (currentNode && !Vector2.equals(currentNode.position, endNode.position))

  const path: PathNode[] = []
  let tracer: PathNode | null = currentNode
  while (tracer) {
    path.push(currentNode)
    tracer = tracer.prevNode
  }

  return path
}
