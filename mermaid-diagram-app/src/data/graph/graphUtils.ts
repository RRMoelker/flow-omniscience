import { Graph } from '../types';

// Find all nodes reachable from a given start node
export const findReachableNodes = (graph: Graph, startNodeId: string): Set<string> => {
  const reachable = new Set<string>();
  const toVisit = [startNodeId];
  
  while (toVisit.length > 0) {
    const current = toVisit.pop()!;
    if (reachable.has(current)) continue;
    
    reachable.add(current);
    
    // Find all edges from current node
    const outgoingEdges = graph.edges.filter(edge => edge.from === current);
    for (const edge of outgoingEdges) {
      toVisit.push(edge.to);
    }
  }
  
  return reachable;
};

// Find all nodes that can reach a given end node
export const findReachingNodes = (graph: Graph, endNodeId: string): Set<string> => {
  const reaching = new Set<string>();
  const toVisit = [endNodeId];
  
  while (toVisit.length > 0) {
    const current = toVisit.pop()!;
    if (reaching.has(current)) continue;
    
    reaching.add(current);
    
    // Find all edges to current node
    const incomingEdges = graph.edges.filter(edge => edge.to === current);
    for (const edge of incomingEdges) {
      toVisit.push(edge.from);
    }
  }
  
  return reaching;
};

// Find all nodes that pass through a given node (the specified node plus all incoming and outgoing paths)
export const findPassThroughNodes = (graph: Graph, nodeId: string): Set<string> => {
  const passThrough = new Set<string>();
  
  // Add the specified node
  passThrough.add(nodeId);
  
  // Find all nodes that can reach the specified node (incoming paths)
  const canReachNode = findReachingNodes(graph, nodeId);
  for (const node of Array.from(canReachNode)) {
    passThrough.add(node);
  }
  
  // Find all nodes that the specified node can reach (outgoing paths)
  const canBeReachedFromNode = findReachableNodes(graph, nodeId);
  for (const node of Array.from(canBeReachedFromNode)) {
    passThrough.add(node);
  }
  
  return passThrough;
}; 