import { Node, Edge, Graph, OperationMeta } from '../../../types';

export const groupAdd =(groupId: string): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Find the group in the base graph
    const groupToAdd = baseGraph.groups.find(g => g.id === groupId);
    
    if (!groupToAdd) {
      console.warn(`Group with ID "${groupId}" not found in base graph`);
      return [baseGraph, resultGraph, false];
    }
    
    // Check if group already exists in result graph
    if (resultGraph.groups.some(g => g.id === groupId)) {
      console.warn(`Group with ID "${groupId}" already exists in result graph`);
      return [baseGraph, resultGraph, false];
    }
    
    // Find all nodes that belong to this group
    const nodesInGroup: Node[] = baseGraph.nodes.filter(node => 
      node.groups && node.groups.includes(groupId)
    );
    
    // Find all edges that connect to/from nodes in this group
    const nodeIdsInGroup: string[] = nodesInGroup.map(node => node.id);
    const edgesInGroup: Edge[] = baseGraph.edges.filter(edge => 
      nodeIdsInGroup.includes(edge.from) || nodeIdsInGroup.includes(edge.to)
    );

    // List all nodes that are in the edges
    // for all edges, add the nodes to relatedNodes array
    // Collect all nodes referenced by edgesInGroup, filtering out undefined and duplicates
    const relatedNodesSet = new Set<Node>();
    edgesInGroup.forEach(edge => {
      const fromNode = baseGraph.nodes.find(node => node.id === edge.from);
      if (fromNode) relatedNodesSet.add(fromNode);
      const toNode = baseGraph.nodes.find(node => node.id === edge.to);
      if (toNode) relatedNodesSet.add(toNode);
    });
    const relatedNodes: Node[] = Array.from(relatedNodesSet);

    // Add the related nodes to the nodesInGroup array
    nodesInGroup.push(...relatedNodes);

    // Get existing IDs to avoid duplicates
    const existingNodeIds: Set<string> = new Set(resultGraph.nodes.map(node => node.id));
    const existingEdgeIds: Set<string> = new Set(resultGraph.edges.map(edge => `${edge.from}-${edge.to}`));
    
    // Filter out nodes and edges that already exist
    const newNodes: Node[] = nodesInGroup.filter(node => !existingNodeIds.has(node.id));
    const newEdges: Edge[] = edgesInGroup.filter(edge => 
      !existingEdgeIds.has(`${edge.from}-${edge.to}`)
    );

    
    // Add the group, nodes, and edges to the result graph
    const newResultGraph: Graph = {
      ...resultGraph,
      groups: [...resultGraph.groups, groupToAdd],
      nodes: [...resultGraph.nodes, ...newNodes],
      edges: [...resultGraph.edges, ...newEdges]
    };
    
    return [baseGraph, newResultGraph, true];
  };

  return {
    id: `add-group-${groupId}`,
    label: `Add Group: ${groupId}`,
    priority: 1,
    type: 'add',
    operation
  };
}; 

export default groupAdd;
