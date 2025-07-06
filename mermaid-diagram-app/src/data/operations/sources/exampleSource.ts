import { Graph, OperationMeta } from '../../types';
import { exampleGraphData } from '../exampleSource';

// Example source operation: sets the example graph as the base graph
const exampleSource = (): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Source operations only change the base graph, result graph stays the same
    return [exampleGraphData, resultGraph, true];
  };

  return {
    id: 'example-source',
    label: 'Example Source',
    priority: 0, // Source priority
    type: 'source',
    operation
  };
};

export default exampleSource; 