import { Graph, OperationMeta } from '../../../types';

// All constructive operation: returns the full original graph
const allNodesAdd = (): OperationMeta => {
  const operation = (baseGraph: Graph): [Graph, Graph, boolean] => {
    // Base graph stays the same, result graph gets the full base graph
    return [baseGraph, baseGraph, true];
  };

  return {
    id: 'all-nodes',
    label: 'All Nodes',
    priority: 100, // Constructive priority
    type: 'add',
    operation
  };
};

export default allNodesAdd; 