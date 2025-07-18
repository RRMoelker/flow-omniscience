import { Graph, OperationMeta } from '../../types';
import { findReachingNodes } from '../../graph/graphUtils';

// End filter operation: takes a nodeId and returns an OperationMeta
const endFilter = (nodeId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Check if the end node exists in the result graph
    const node = resultGraph.nodes.find(node => node.id === nodeId);
    if (!node) {
      return [baseGraph, resultGraph, false]; // Return unchanged and indicate not applied
    }
    
    const validNodes = findReachingNodes(resultGraph, nodeId);
    
    // Filter nodes
    const filteredNodes = resultGraph.nodes.filter(node => validNodes.has(node.id));
    
    // Filter edges (both endpoints must be in valid nodes)
    const filteredEdges = resultGraph.edges.filter(edge => 
      validNodes.has(edge.from) && validNodes.has(edge.to)
    );
    
    const newResultGraph = {
      nodes: filteredNodes,
      edges: filteredEdges,
      groups: resultGraph.groups || []
    };
    
    return [baseGraph, newResultGraph, true]; // Return filtered graph and indicate applied
  };

  return {
    id: `end-filter-${nodeId}`,
    label: `End: ${nodeId}`,
    priority: 300, // Filter priority
    type: 'filter',
    operation
  };
};

export default endFilter; 