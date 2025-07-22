import { Graph, OperationMeta } from '../../../types';

// All constructive operation: returns the full original graph
const allConstructive = (): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Constructive operations use the base graph to build the result graph
    // Base graph stays the same, result graph gets the full base graph
    return [baseGraph, baseGraph, true];
  };

  return {
    id: 'all-constructive',
    label: 'All Nodes',
    priority: 100, // Constructive priority
    type: 'constructive',
    operation
  };
};

export default allConstructive; 