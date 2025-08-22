import { Graph, OperationMeta } from '../../types';
import { createEmptyGraph } from '../graph/emptyGraph';
//
import startFilter from './filter/startFilter';
import endFilter from './filter/endFilter';
import passThroughFilter from './filter/passThroughFilter';
import filterConnected from './filter/connectedFilter';
//
import groupCollapseTransformation from './transform/groupCollapseTransform';
import removeNodeTransformation from './remove/nodeRemove';
//
import growInTransformation from './add/growInAdd';
import growOutTransformation from './add/growOutAdd';
import allConstructive from './add/allNodesAdd';
import addGroupConstructive from './add/groupAdd';
//
import exampleSource1 from './source/exampleSource1';
import exampleSource2 from './source/exampleSource2';
import externalSource from './source/externalSource';

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

export const createFilterConnected = (nodeId: string): OperationMeta => {
  const op = filterConnected(nodeId);
  return { ...op, type: 'filter' };
};

// Create transformation operations
export const createGroupCollapseTransformation = (groupId: string): OperationMeta => {
  return groupCollapseTransformation(groupId);
};

export const createRemoveNodeTransformation = (nodeId: string): OperationMeta => {
  return removeNodeTransformation(nodeId);
};

export const createGrowInTransformation = (nodeId: string): OperationMeta => {
  return growInTransformation(nodeId);
};

export const createGrowOutTransformation = (nodeId: string): OperationMeta => {
  return growOutTransformation(nodeId);
};

// Create source operations
export const createExampleSource1 = (): OperationMeta => {
  return exampleSource1();
};

export const createExampleSource2 = (): OperationMeta => {
  return exampleSource2();
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