import { Graph, OperationMeta } from '../../types';
import { createEmptyGraph } from '../graph/emptyGraph';

// Apply operations to a graph in priority order
export const applyOperations = (originalGraph: Graph, operations: OperationMeta[]): [Graph, Graph] => {
  // Start with empty graphs
  let baseGraph: Graph = originalGraph;
  let resultGraph: Graph = createEmptyGraph();
  
  for (const operationMeta of operations) {
    const [newBaseGraph, newResultGraph] = operationMeta.operation(baseGraph, resultGraph);
    baseGraph = newBaseGraph;
    resultGraph = newResultGraph;
  }
  
  return [baseGraph, resultGraph];
};
