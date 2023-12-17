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

function compareNodes(nodeA: Node, nodeB: Node) {
  return Vector2.equals(nodeA.position, nodeB.position) && Vector2.equals(nodeA.direction, nodeB.direction)
}

function hashNode(node: Node) {
  return Vector2.toString(node.position) + '|' + Vector2.toString(node.direction)
}

export function PathFinder(startNode: Node, endNode: Node, getAdjacentNodes: (current: PathNode) => Node[]) {
  const visitedNodes = new Set<string>()
  let nodesToCheck: PathNode[] = []
  let currentNode: PathNode = { position: startNode.position, prevNode: null, cost: 0, direction: Vector2.Zero }
  do {
    const adjNodes = getAdjacentNodes(currentNode).filter((n) => !visitedNodes.has(hashNode(n)))
    visitedNodes.add(hashNode(currentNode))

    if (adjNodes?.length) {
      adjNodes.forEach((node) => {
        const foundNode = nodesToCheck.find((n) => compareNodes(node, n))
        if (!foundNode) {
          nodesToCheck.push({ ...node, prevNode: currentNode })
          return
        }

        // found faster path to this node
        if (node.cost < foundNode.cost) {
          foundNode.cost = node.cost
          foundNode.prevNode = currentNode
        }
      })
    }
    let nextNode: PathNode | null = null
    for (const nodeToCheck of nodesToCheck) {
      if (!nextNode || nodeToCheck.cost < nextNode.cost) nextNode = nodeToCheck
    }
    nodesToCheck = nodesToCheck.filter((node) => node !== nextNode)

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
