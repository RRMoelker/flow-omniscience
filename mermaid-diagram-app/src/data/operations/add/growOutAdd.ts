import { Graph, OperationMeta } from '../../../types';

const growOutTransformation = (nodeId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Find all edges outgoing from nodeId
    const outgoingEdges = baseGraph.edges.filter(edge => edge.from === nodeId);
    if (outgoingEdges.length === 0) return [baseGraph, resultGraph, false];

    // Find all target nodes for these edges
    const outgoingNodeIds = new Set(outgoingEdges.map(edge => edge.to));
    const newNodes = baseGraph.nodes.filter(node => outgoingNodeIds.has(node.id));
    const newEdges = outgoingEdges;

    // Add to result graph (avoid duplicates)
    const existingNodeIds = new Set(resultGraph.nodes.map(node => node.id));
    const existingEdgeIds = new Set(resultGraph.edges.map(edge => `${edge.from}-${edge.to}`));
    const nodesToAdd = newNodes.filter(node => !existingNodeIds.has(node.id));
    const edgesToAdd = newEdges.filter(edge => !existingEdgeIds.has(`${edge.from}-${edge.to}`));

    const newResultGraph = {
      ...resultGraph,
      nodes: [...resultGraph.nodes, ...nodesToAdd],
      edges: [...resultGraph.edges, ...edgesToAdd],
    };

    return [baseGraph, newResultGraph, nodesToAdd.length > 0 || edgesToAdd.length > 0];
  };

  return {
    id: `grow-out-${nodeId}`,
    label: `Grow Out: ${nodeId}`,
    priority: 200,
    type: 'transform',
    operation
  };
};

export default growOutTransformation; 