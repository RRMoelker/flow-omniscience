import { Graph, OperationMeta } from '../../../types';

// Remove node transformation operation: takes a nodeId and returns an OperationMeta
const nodeRemove = (nodeId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Check if the node exists in the result graph
    const nodeExists = resultGraph.nodes.some(node => node.id === nodeId);
    if (!nodeExists) return [baseGraph, resultGraph, false];

    // Remove the node and all edges connected to it
    const filteredNodes = resultGraph.nodes.filter(node => node.id !== nodeId);
    const filteredEdges = resultGraph.edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId);

    const newResultGraph = {
      nodes: filteredNodes,
      edges: filteredEdges,
      groups: resultGraph.groups
    };

    return [baseGraph, newResultGraph, true];
  };

  return {
    id: `remove-node-${nodeId}`,
    label: `Remove Node: ${nodeId}`,
    priority: 200, // Transform priority
    type: 'remove',
    operation
  };
};

export default nodeRemove; 