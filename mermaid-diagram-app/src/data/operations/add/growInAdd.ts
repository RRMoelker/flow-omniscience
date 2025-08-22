import { Graph, OperationMeta } from '../../../types';

const growInAdd = (nodeId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Find all edges incoming to nodeId
    const incomingEdges = baseGraph.edges.filter(edge => edge.to === nodeId);
    if (incomingEdges.length === 0) return [baseGraph, resultGraph, false];

    // Find all source nodes for these edges
    const incomingNodeIds = new Set(incomingEdges.map(edge => edge.from));
    const newNodes = baseGraph.nodes.filter(node => incomingNodeIds.has(node.id));
    const newEdges = incomingEdges;

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
    id: `grow-in-${nodeId}`,
    label: `Grow In: ${nodeId}`,
    priority: 200,
    type: 'add',
    operation
  };
};

export default growInAdd; 