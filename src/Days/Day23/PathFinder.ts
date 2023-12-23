import Heap from 'heap-js'
import Vector2 from '../../types/2D/Vector2'
import { Point2D } from '../../types/2D/types2D'

export type Node = {
  position: Point2D
  cost: number
}

export type PathNode = {
  prevNode: PathNode | null
} & Node

function hashNode(node: Node) {
  return Vector2.toString(node.position)
}

function getPathOfNode(node: PathNode) {
  const path = new Set<string>()
  let tracer: PathNode | null = node
  while (tracer) {
    path.add(hashNode(tracer))
    tracer = tracer.prevNode
  }
  return path
}

export function PathFinder(startPosition: Vector2, endPosition: Vector2, getAdjacentNodes: (current: PathNode) => Node[]) {
  const nodesToCheck = new Heap<PathNode>((a, b) => a.cost - b.cost)
  let currentNode: PathNode = { position: startPosition, prevNode: null, cost: 0 }
  let worstPath: PathNode | null = null
  do {
    const adjNodes = getAdjacentNodes(currentNode)
    const pathTaken = getPathOfNode(currentNode)

    if (adjNodes?.length) {
      adjNodes.forEach((node) => {
        const nodeKey = hashNode(node)
        if (pathTaken.has(nodeKey)) return
        nodesToCheck.push({ ...node, prevNode: currentNode })
      })
    }

    let nextNode = nodesToCheck.pop()
    if (nextNode && Vector2.equals(nextNode.position, endPosition)) {
      if (!worstPath || nextNode.cost > worstPath.cost) {
        console.log('Found new worst path', nextNode.position, nextNode.cost)
        worstPath = nextNode
      }
      nextNode = nodesToCheck.pop()
    }
    if (!nextNode) break
    currentNode = nextNode
  } while (currentNode)

  return worstPath
}
