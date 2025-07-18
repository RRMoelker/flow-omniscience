import { Graph, OperationMeta } from '../types';
import { createEmptyGraph } from '../graph/emptyGraph';
import startFilter from './filters/startFilter';
import endFilter from './filters/endFilter';
import passThroughFilter from './filters/passThroughFilter';
import groupCollapseTransformation from './transforms/groupCollapseTransformation';
import allConstructive from './constructs/allConstructive';
import addGroupConstructive from './constructs/addGroupConstructive';
import exampleSource from './sources/exampleSource';
import complexExampleSource from './sources/complexExampleSource';
import externalSource from './sources/externalSource';

// Apply operations to a graph in priority order
export const applyOperations = (originalGraph: Graph, operations: OperationMeta[]): Graph => {
  if (operations.length === 0) {
    return createEmptyGraph(); // Return empty graph when no operations
  }
  
  // Start with empty graphs
  let baseGraph: Graph = createEmptyGraph();
  let resultGraph: Graph = createEmptyGraph();
  
  for (const operationMeta of operations) {
    const [newBaseGraph, newResultGraph] = operationMeta.operation(baseGraph, resultGraph);
    baseGraph = newBaseGraph;
    resultGraph = newResultGraph;
  }
  
  return resultGraph;
};

// Create filter operations
export const createStartFilter = (nodeId: string): OperationMeta => {
  return startFilter(nodeId);
};

export const createEndFilter = (nodeId: string): OperationMeta => {
  return endFilter(nodeId);
};

export const createPassThroughFilter = (nodeId: string): OperationMeta => {
  return passThroughFilter(nodeId);
};

// Create transformation operations
export const createGroupCollapseTransformation = (groupId: string): OperationMeta => {
  return groupCollapseTransformation(groupId);
};

// Create source operations
export const createExampleSource = (): OperationMeta => {
  return exampleSource();
};

export const createComplexExampleSource = (): OperationMeta => {
  return complexExampleSource();
};

export const createExternalSource = (): OperationMeta => {
  return externalSource();
};

// Create constructive operations
export const createAllConstructive = (): OperationMeta => {
  return allConstructive();
};

export const createAddGroupConstructive = (groupId: string): OperationMeta => {
  return addGroupConstructive(groupId);
}; 