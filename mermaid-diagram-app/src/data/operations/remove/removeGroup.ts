import { Node,Edge, Graph, OperationMeta } from '../../../types';
const removeGroup = (groupId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Find the group in the result graph
    const groupToRemove = resultGraph.groups.find(g => g.id === groupId);
    
    if (!groupToRemove) {
      console.warn(`Group with ID "${groupId}" not found in result graph`);
      return [baseGraph, resultGraph, false];
    }

    // Find all nodes that belong to this group
    const nodesToRemove: Node[] = resultGraph.nodes.filter(node => 
      node.groups && node.groups.includes(groupId)
    );

    if (nodesToRemove.length === 0) {
      console.warn(`No nodes found in group "${groupId}" to remove`);
      return [baseGraph, resultGraph, false];
    }

    // Find all edges that connect to/from nodes in this group
    const edgesToRemove = resultGraph.edges.filter(edge => {
      const sourceInGroup = nodesToRemove.some(node => node.id === edge.from);
      const targetInGroup = nodesToRemove.some(node => node.id === edge.to);
      return sourceInGroup || targetInGroup;
    });

    // Remove the group, nodes, and edges
    const newResultGraph: Graph = {
      ...resultGraph,
      groups: resultGraph.groups.filter(g => g.id !== groupId),
      nodes: resultGraph.nodes.filter(node => 
        !node.groups || !node.groups.includes(groupId)
      ),
      edges: resultGraph.edges.filter(edge => {
        const sourceInGroup = nodesToRemove.some(node => node.id === edge.from);
        const targetInGroup = nodesToRemove.some(node => node.id === edge.to);
        return !sourceInGroup && !targetInGroup;
      })
    };

    return [baseGraph, newResultGraph, true];
  };

  return {
    id: `remove-group-${groupId}`,
    label: `Remove Group: ${groupId}`,
    priority: 3,
    type: 'remove',
    operation
  };
};

export default removeGroup;