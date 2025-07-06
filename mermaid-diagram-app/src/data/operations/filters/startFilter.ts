import { Graph, OperationMeta } from '../../types';
import { findReachableNodes } from '../../graph/graphUtils';

// Start filter operation: takes a nodeId and returns an OperationMeta
const startFilter = (nodeId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Check if the start node exists in the result graph
    const node = resultGraph.nodes.find(node => node.id === nodeId);
    if (!node) {
      return [baseGraph, resultGraph, false]; // Return unchanged and indicate not applied
    }
    
    const validNodes = findReachableNodes(resultGraph, nodeId);
    
    // Filter nodes
    const filteredNodes = resultGraph.nodes.filter(node => validNodes.has(node.id));
    
    // Filter edges (both endpoints must be in valid nodes)
    const filteredEdges = resultGraph.edges.filter(edge => 
      validNodes.has(edge.from) && validNodes.has(edge.to)
    );
    
    const newResultGraph = {
      nodes: filteredNodes,
      edges: filteredEdges
    };
    
    return [baseGraph, newResultGraph, true]; // Return filtered graph and indicate applied
  };

  return {
    id: `start-filter-${nodeId}`,
    label: `Start: ${nodeId}`,
    priority: 300, // Filter priority
    type: 'filter',
    operation
  };
};

export default startFilter; 