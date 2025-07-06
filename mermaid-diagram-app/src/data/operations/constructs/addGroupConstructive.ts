import { Graph, OperationMeta } from '../../types';

// Add group constructive operation: adds all nodes for provided group
const addGroupConstructive = (groupId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Find all nodes in the specified group from the base graph
    const nodesInGroup = baseGraph.nodes.filter(node => node.group === groupId);
    
    if (nodesInGroup.length === 0) {
      return [baseGraph, resultGraph, false]; // Return unchanged if no nodes in group
    }
    
    // Get all edges that connect to/from nodes in this group
    const nodeIdsInGroup = nodesInGroup.map(node => node.id);
    const edgesInGroup = baseGraph.edges.filter(edge => 
      nodeIdsInGroup.includes(edge.from) || nodeIdsInGroup.includes(edge.to)
    );
    
    // Combine with result graph (avoid duplicates)
    const existingNodeIds = new Set(resultGraph.nodes.map(node => node.id));
    const newNodes = nodesInGroup.filter(node => !existingNodeIds.has(node.id));
    
    const existingEdgeIds = new Set(resultGraph.edges.map(edge => `${edge.from}-${edge.to}`));
    const newEdges = edgesInGroup.filter(edge => 
      !existingEdgeIds.has(`${edge.from}-${edge.to}`)
    );
    
    const newResultGraph = {
      nodes: [...resultGraph.nodes, ...newNodes],
      edges: [...resultGraph.edges, ...newEdges]
    };
    
    return [baseGraph, newResultGraph, newNodes.length > 0 || newEdges.length > 0];
  };

  return {
    id: `add-group-constructive-${groupId}`,
    label: `Add Group: ${groupId}`,
    priority: 100, // Constructive priority
    type: 'constructive',
    operation
  };
};

export default addGroupConstructive; 