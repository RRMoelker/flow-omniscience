import { Graph, OperationMeta } from '../../types';
import { createEmptyGraph } from '../graph/emptyGraph';
import startFilter from './filter/startFilter';
import endFilter from './filter/endFilter';
import passThroughFilter from './filter/passThroughFilter';
import connectedFilter from './filter/connectedFilter';
import filterGroup from './filter/filterGroup';
import groupCollapseTransform from './transform/groupCollapseTransform';
import nodeRemove from './remove/nodeRemove';
import removeGroup from './remove/removeGroup';
import growInAdd from './add/growInAdd';
import growOutAdd from './add/growOutAdd';
import allNodesAdd from './add/allNodesAdd';
import groupAdd from './add/groupAdd';
import exampleSource1 from './source/exampleSource1';
import exampleSource2 from './source/exampleSource2';
import externalSource from './source/externalSource';

// Apply operations to a graph in priority order
export const applyOperations = async (originalGraph: Graph, operations: OperationMeta[]): Promise<[Graph, Graph]> => {
  // Start with empty graphs
  let baseGraph: Graph = originalGraph;
  let resultGraph: Graph = createEmptyGraph();
  
  for (const operationMeta of operations) {
    const result = operationMeta.operation(baseGraph, resultGraph);
    
    // Handle both sync and async operations
    if (result instanceof Promise) {
      const [newBaseGraph, newResultGraph] = await result;
      baseGraph = newBaseGraph;
      resultGraph = newResultGraph;
    } else {
      const [newBaseGraph, newResultGraph] = result;
      baseGraph = newBaseGraph;
      resultGraph = newResultGraph;
    }
  }
  
  return [baseGraph, resultGraph];
};

// Export operations directly
export {
  startFilter,
  endFilter,
  passThroughFilter,
  connectedFilter,
  filterGroup,
  groupCollapseTransform,
  nodeRemove,
  removeGroup,
  growInAdd,
  growOutAdd,
  allNodesAdd,
  groupAdd,
  exampleSource1,
  exampleSource2,
  externalSource
};
