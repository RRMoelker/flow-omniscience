import { Node,Edge, Graph, OperationMeta } from '../../../types';

const removeGroup = (groupId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Find the group in the result graph
    const groupToRemove = resultGraph.groups.find(g => g.id === groupId);
    
    if (!groupToRemove) {
      console.warn(`Group with ID "${groupId}" not found in result graph`);
      return [baseGraph, resultGraph, false];
    }

    // Calculate the resulting nodes (all nodes NOT in the group to remove)
    const resultingNodes: Node[] = resultGraph.nodes.filter(node => 
      !node.groups || !node.groups.includes(groupId)
    );

    if (resultingNodes.length === 0) {
      console.warn(`No nodes would remain after removing group "${groupId}"`);
      return [baseGraph, resultGraph, false];
    }

    // Build sets for edges and groups by looping through all nodes
    const edgeSet = new Set<string>();
    const groupSet = new Set<string>();
    
    resultingNodes.forEach(node => {
      // Add node's groups to the group set
      if (node.groups) {
        node.groups.forEach(groupId => {
          if (groupId !== groupToRemove.id) { // Don't add the group being removed
            groupSet.add(groupId);
          }
        });
      }
      
      // Find edges where this node is source or target
      resultGraph.edges.forEach(edge => {
        if (edge.from === node.id || edge.to === node.id) {
          // Check if both source and target are in resulting nodes
          const sourceInResult = resultingNodes.some(n => n.id === edge.from);
          const targetInResult = resultingNodes.some(n => n.id === edge.to);
          if (sourceInResult && targetInResult) {
            // Create unique edge identifier since Edge doesn't have an id
            const edgeKey = `${edge.from}-${edge.to}`;
            edgeSet.add(edgeKey);
          }
        }
      });
    });

    // Convert sets back to arrays
    const internalEdges: Edge[] = resultGraph.edges.filter(edge => {
      const edgeKey = `${edge.from}-${edge.to}`;
      return edgeSet.has(edgeKey);
    });
    const relevantGroups = resultGraph.groups.filter(group => groupSet.has(group.id));

    // Create new result graph with the calculated content
    const newResultGraph: Graph = {
      ...resultGraph,
      groups: relevantGroups,
      nodes: resultingNodes,
      edges: internalEdges
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