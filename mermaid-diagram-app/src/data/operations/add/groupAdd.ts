import { Graph, OperationMeta } from '../../../types';

export default (groupId: string): OperationMeta => {
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
    
    // Add the group to the result graph
    const newResultGraph: Graph = {
      ...resultGraph,
      groups: [...resultGraph.groups, groupToAdd]
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