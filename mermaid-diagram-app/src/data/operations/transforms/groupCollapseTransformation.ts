import { Graph, Node, Edge, OperationMeta } from '../../types';

// Group collapse transformation operation: takes a groupId and returns an OperationMeta
const groupCollapseTransformation = (groupId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    const nodesInGroup = resultGraph.nodes.filter(node => node.groups && node.groups.includes(groupId));
    if (nodesInGroup.length === 0) return [baseGraph, resultGraph, false];

    // Create a new merged node
    const mergedNode: Node = {
      id: `GROUP_${groupId}`,
      name: `${groupId} (${nodesInGroup.length} nodes)`,
      type: 'group',
      groups: [groupId]
    };

    // Find all incoming edges to any node in the group
    const incomingEdges = resultGraph.edges.filter(edge => 
      nodesInGroup.some(node => node.id === edge.to)
    );
    
    // Find all outgoing edges from any node in the group
    const outgoingEdges = resultGraph.edges.filter(edge => 
      nodesInGroup.some(node => node.id === edge.from)
    );
    
    // Create new edges that connect to the merged node
    const newEdges: Edge[] = [];
    
    // Add incoming edges to the merged node
    incomingEdges.forEach(edge => {
      // Only add if the source is not in the same group
      if (!nodesInGroup.some(node => node.id === edge.from)) {
        newEdges.push({
          from: edge.from,
          to: mergedNode.id,
          label: edge.label
        });
      }
    });
    
    // Add outgoing edges from the merged node
    outgoingEdges.forEach(edge => {
      // Only add if the destination is not in the same group
      if (!nodesInGroup.some(node => node.id === edge.to)) {
        newEdges.push({
          from: mergedNode.id,
          to: edge.to,
          label: edge.label
        });
      }
    });
    
    // Remove all nodes in the group and their edges
    const nodeIdsInGroup = nodesInGroup.map(node => node.id);
    const filteredNodes = resultGraph.nodes.filter(node => !nodeIdsInGroup.includes(node.id));
    const filteredEdges = resultGraph.edges.filter(edge => 
      !nodeIdsInGroup.includes(edge.from) && !nodeIdsInGroup.includes(edge.to)
    );
    
    // Add the merged node and new edges
    const allEdges = [...filteredEdges, ...newEdges];
    
    // Remove duplicate edges
    const uniqueEdges = allEdges.filter((edge, index, self) => 
      index === self.findIndex(e => e.from === edge.from && e.to === edge.to)
    );
    
    const newResultGraph = {
      nodes: [...filteredNodes, mergedNode],
      edges: uniqueEdges
    };
    
    // Add empty groups array to newResultGraph if missing
    return [baseGraph, { ...newResultGraph, groups: resultGraph.groups || [] }, true];
  };

  return {
    id: `group-collapse-${groupId}`,
    label: `Group Collapse: ${groupId}`,
    priority: 200, // Transform priority
    type: 'transform',
    operation
  };
};

export default groupCollapseTransformation; 