import { Graph, OperationMeta } from '../../../types';
import { findConnectedComponent } from '../../graph/graphUtils';

// Filter Connected operation: keeps only the connected component of the node
const connectedFilter = (nodeId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Check if the node exists in the result graph
    const nodeExists = resultGraph.nodes.some(node => node.id === nodeId);
    if (!nodeExists) return [baseGraph, resultGraph, false];

    // Find all nodes in the connected component
    const connectedNodeIds = findConnectedComponent(resultGraph, nodeId);

    // Filter nodes
    const filteredNodes = resultGraph.nodes.filter(node => connectedNodeIds.has(node.id));
    // Filter edges (both endpoints must be in the connected component)
    const filteredEdges = resultGraph.edges.filter(edge => connectedNodeIds.has(edge.from) && connectedNodeIds.has(edge.to));
    // Filter groups (only groups referenced by remaining nodes)
    const usedGroupIds = new Set(filteredNodes.flatMap(node => node.groups || []));
    const filteredGroups = (resultGraph.groups || []).filter(group => usedGroupIds.has(group.id));

    const newResultGraph = {
      nodes: filteredNodes,
      edges: filteredEdges,
      groups: filteredGroups
    };

    return [baseGraph, newResultGraph, true];
  };

  return {
    id: `filter-connected-${nodeId}`,
    label: `Filter Connected: ${nodeId}`,
    priority: 300, // Filter priority
    type: 'filter',
    operation
  };
};

export default connectedFilter; 