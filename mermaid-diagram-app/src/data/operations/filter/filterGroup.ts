import { Node, Edge, Graph, OperationMeta } from '../../../types';

const filterGroup = (groupId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Find the group in the base graph
    const groupToFilter = baseGraph.groups.find(g => g.id === groupId);
    
    if (!groupToFilter) {
      console.warn(`Group with ID "${groupId}" not found in base graph`);
      return [baseGraph, resultGraph, false];
    }

    // Find all nodes that belong to this group
    const groupNodes: Node[] = resultGraph.nodes.filter(node => 
      node.groups && node.groups.includes(groupId)
    );

    if (groupNodes.length === 0) {
      console.warn(`No nodes found in group "${groupId}"`);
      return [baseGraph, resultGraph, false];
    }

    // Find all edges that connect nodes in this group
    const groupEdges: Edge[] = resultGraph.edges.filter(edge => {
      const sourceInGroup = groupNodes.some(node => node.id === edge.from);
      const targetInGroup = groupNodes.some(node => node.id === edge.to);
      return sourceInGroup && targetInGroup;
    });

    // Find all groups that contain any of the filtered nodes
    const relevantGroups = resultGraph.groups.filter(group => {
      return groupNodes.some(node => 
        node.groups && node.groups.includes(group.id)
      );
    });

    // Create new result graph with only the filtered content
    const newResultGraph: Graph = {
      ...resultGraph,
      nodes: groupNodes,
      edges: groupEdges,
      groups: relevantGroups
    };

    return [baseGraph, newResultGraph, true];
  };

  return {
    id: `filter-group-${groupId}`,
    label: `Filter Group: ${groupId}`,
    priority: 2,
    type: 'filter',
    operation
  };
};

export default filterGroup;