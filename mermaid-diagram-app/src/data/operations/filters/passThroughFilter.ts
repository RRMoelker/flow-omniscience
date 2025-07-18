import { Graph, OperationMeta } from '../../types';
import { findReachableNodes, findReachingNodes } from '../../graph/graphUtils';

// Pass-through filter operation: takes a nodeId and returns an OperationMeta
const passThroughFilter = (nodeId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Check if the pass-through node exists in the result graph
    const node = resultGraph.nodes.find(node => node.id === nodeId);
    if (!node) {
      return [baseGraph, resultGraph, false]; // Return unchanged and indicate not applied
    }
    
    const passThrough = new Set<string>();
    
    // Add the specified node
    passThrough.add(nodeId);
    
    // Find all nodes that can reach the specified node (incoming paths)
    const canReachNode = findReachingNodes(resultGraph, nodeId);
    for (const node of Array.from(canReachNode)) {
      passThrough.add(node);
    }
    
    // Find all nodes that the specified node can reach (outgoing paths)
    const canBeReachedFromNode = findReachableNodes(resultGraph, nodeId);
    for (const node of Array.from(canBeReachedFromNode)) {
      passThrough.add(node);
    }
    
    // Filter nodes
    const filteredNodes = resultGraph.nodes.filter(node => passThrough.has(node.id));
    
    // Filter edges (both endpoints must be in valid nodes)
    const filteredEdges = resultGraph.edges.filter(edge => 
      passThrough.has(edge.from) && passThrough.has(edge.to)
    );
    
    const newResultGraph = {
      nodes: filteredNodes,
      edges: filteredEdges,
      groups: resultGraph.groups || []
    };
    
    return [baseGraph, newResultGraph, true]; // Return filtered graph and indicate applied
  };

  return {
    id: `pass-through-filter-${nodeId}`,
    label: `Pass-Through: ${nodeId}`,
    priority: 300, // Filter priority
    type: 'filter',
    operation
  };
};

export default passThroughFilter; 