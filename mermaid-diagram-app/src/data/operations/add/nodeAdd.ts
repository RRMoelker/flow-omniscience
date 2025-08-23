import { Graph, OperationMeta } from '../../../types';

const nodeAdd = (nodeId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Find the node in the base graph
    const nodeToAdd = baseGraph.nodes.find(n => n.id === nodeId);
    
    if (!nodeToAdd) {
      console.warn(`Node with ID "${nodeId}" not found in base graph`);
      return [baseGraph, resultGraph, false];
    }
    
    // Check if node already exists in result graph
    if (resultGraph.nodes.some(n => n.id === nodeId)) {
      console.warn(`Node with ID "${nodeId}" already exists in result graph`);
      return [baseGraph, resultGraph, false];
    }
    
    // Add the node to the result graph
    const newResultGraph: Graph = {
      ...resultGraph,
      nodes: [...resultGraph.nodes, nodeToAdd]
    };
    
    return [baseGraph, newResultGraph, true];
  };

  return {
    id: `add-node-${nodeId}`,
    label: `Add Node: ${nodeId}`,
    priority: 1,
    type: 'add',
    operation
  };
}; 

export default nodeAdd;