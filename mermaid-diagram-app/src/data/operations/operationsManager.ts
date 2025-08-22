import { Graph, OperationMeta } from '../../types';
import { createEmptyGraph } from '../graph/emptyGraph';
//
import startFilter from './filter/startFilter';
import endFilter from './filter/endFilter';
import passThroughFilter from './filter/passThroughFilter';
import connectedFilter from './filter/connectedFilter';
//
import groupCollapseTransform from './transform/groupCollapseTransform';
import nodeRemove from './remove/nodeRemove';
//
import growInAdd from './add/growInAdd';
import growOutAdd from './add/growOutAdd';
import allNodesAdd from './add/allNodesAdd';
import nodeAdd from './add/nodeAdd';
import groupAdd from './add/groupAdd';
//
import exampleSource1 from './source/exampleSource1';
import exampleSource2 from './source/exampleSource2';
import externalSource from './source/externalSource';

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
  const op = connectedFilter(nodeId);
  return { ...op, type: 'filter' };
};

// Create transformation operations
export const createGroupCollapseTransformation = (groupId: string): OperationMeta => {
  return groupCollapseTransform(groupId);
};

export const createRemoveNodeTransformation = (nodeId: string): OperationMeta => {
  return nodeRemove(nodeId);
};

export const createGrowInTransformation = (nodeId: string): OperationMeta => {
  return growInAdd(nodeId);
};

export const createGrowOutTransformation = (nodeId: string): OperationMeta => {
  return growOutAdd(nodeId);
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
  return allNodesAdd();
};
