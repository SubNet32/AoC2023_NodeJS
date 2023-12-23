import Heap from 'heap-js'
import Vector2 from '../../types/2D/Vector2'
import { Node, PathFinder } from './PathFinder'

export type SubPathNode = {
  prevNode: Node | null
  prevJunction: Junction
} & Node

type Junction = {
  position: Vector2
  connectedJunctions: ConnectedJunction[]
  id: number
}

type ConnectedJunction = {
  junction: Junction
  cost: number
}

function hashNode(node: Node) {
  return Vector2.toString(node.position)
}

export function PathFinderPart2(startPosition: Vector2, endPosition: Vector2, getAdjacentNodes: (current: SubPathNode) => Node[]) {
  const nodesToCheck = new Heap<SubPathNode>((a, b) => a.cost - b.cost)
  const junctions: Junction[] = [{ id: 0, position: startPosition, connectedJunctions: [] }]
  let currentNode: SubPathNode = { position: startPosition, prevJunction: junctions[0], prevNode: null, cost: 0 }
  let checkedPaths = new Set<string>()
  let endJunction: Junction | null = null
  do {
    const isEndPos = Vector2.equals(currentNode.position, endPosition)
    const adjNodes = getAdjacentNodes(currentNode)

    // default
    if (adjNodes.length > 1 || isEndPos) {
      let foundJunction = junctions.find((j) => j.position.equals(currentNode.position)) ?? null
      if (foundJunction) {
        if (!foundJunction.connectedJunctions.find((jc) => jc.junction.position.equals(currentNode.prevJunction.position))) {
          foundJunction.connectedJunctions.push({ junction: currentNode.prevJunction, cost: currentNode.cost })
        }
      } else {
        foundJunction = { id: 0, position: Vector2.FromPoint(currentNode.position), connectedJunctions: [{ junction: currentNode.prevJunction, cost: currentNode.cost }] }
        junctions.push(foundJunction)
      }
      if (!currentNode.prevJunction.connectedJunctions.find((cj) => cj.junction.position.equals(currentNode.position))) {
        currentNode.prevJunction.connectedJunctions.push({ junction: foundJunction, cost: currentNode.cost })
      }
      if (isEndPos) {
        endJunction = foundJunction
      } else {
        adjNodes.forEach((node) => {
          const nodeKey = hashNode(node)
          if (checkedPaths.has(nodeKey)) return
          checkedPaths.add(nodeKey)
          nodesToCheck.push({ ...node, cost: 1, prevJunction: foundJunction as Junction, prevNode: currentNode })
        })
      }

      let nextNode = nodesToCheck.pop()
      if (!nextNode) break
      currentNode = nextNode
    } else if (adjNodes.length === 1) {
      currentNode = { ...adjNodes[0], cost: currentNode.cost + 1, prevJunction: currentNode.prevJunction, prevNode: currentNode }
    } else {
      let nextNode = nodesToCheck.pop()
      if (!nextNode) break
      currentNode = nextNode
    }
  } while (currentNode)

  junctions.forEach((j, index) => {
    j.id = index

    // if the node is connected to the end (only 1 possible) remove all other junctions since every junction can only be visited once
    if (j.connectedJunctions.find((jc) => jc.junction.position.equals(endPosition))) {
      j.connectedJunctions = j.connectedJunctions.filter((jc) => !!jc.junction.position.equals(endPosition))
    }

    console.log(
      j.position.toString(),
      'connects to',
      j.connectedJunctions.map((jc) => `${jc.junction.position.toString()} cost ${jc.cost}`)
    )
  })

  console.log(
    'Junctions',
    junctions.length,
    'max path count',
    junctions.reduce((prod, j) => prod * Math.max(j.connectedJunctions.length - 1, 1), 1)
  )

  return findMaxPathFromJunctions(junctions, endPosition)
}

type JunctionNode = {
  id: number
  connectedJunctions: ConnectedJunction[]
  visitedNodes: string
  cost: number
}

function findMaxPathFromJunctions(junctions: Junction[], endPos: Vector2) {
  const endNodeId = junctions.find((j) => j.position.equals(endPos))?.id ?? 0
  const startNode: JunctionNode = { id: junctions[0].id, connectedJunctions: junctions[0].connectedJunctions, visitedNodes: '0'.repeat(junctions.length + 1), cost: 0 }

  return findMaxPath(startNode, endNodeId)
}

const pathMap = new Map<string, number>()
function findMaxPath(node: JunctionNode, endNodeId: number) {
  if (node.id === endNodeId) {
    return node.cost
  }
  const key = node.id + '|' + node.visitedNodes
  const keyValue = pathMap.get(key)
  if (keyValue) {
    return node.cost + keyValue
  }
  node.visitedNodes = node.visitedNodes.substring(0, node.id) + '1' + node.visitedNodes.substring(node.id + 1)

  let maxResult = 0
  for (const nextNode of node.connectedJunctions) {
    if (node.visitedNodes[nextNode.junction.id] !== '0') continue
    const result = findMaxPath({ id: nextNode.junction.id, connectedJunctions: nextNode.junction.connectedJunctions, visitedNodes: node.visitedNodes, cost: node.cost + nextNode.cost }, endNodeId)
    maxResult = Math.max(result, maxResult)
  }
  if (maxResult) {
    pathMap.set(key, maxResult - node.cost)
  }
  return maxResult
}
