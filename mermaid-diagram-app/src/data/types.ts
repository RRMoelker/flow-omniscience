// Group type options
export const GROUP_TYPES = ['database', 'project', 'system', 'workflow'] as const;
export type GroupType = typeof GROUP_TYPES[number];

export interface Group {
  id: string;
  type: GroupType;
}

export interface Node {
  id: string;
  name: string;
  type: 'process' | 'data' | 'group' | 'view' | 'database';
  groups?: string[]; // Array of group ids
}

export interface Edge {
  from: string;
  to: string;
  label?: string; // Optional edge label
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
  groups: Group[];
}

// Operation is a function that transforms graphs and returns whether it was applied
// Receives both the base graph and the result graph from the previous operation
// Returns new base graph, new result graph, and whether it was applied
export type Operation = (baseGraph: Graph, resultGraph: Graph) => [Graph, Graph, boolean];

// Operation types
export type OperationType = 'source' | 'constructive' | 'transform' | 'filter';

// OperationMeta contains metadata about an operation
export interface OperationMeta {
  id: string;
  label: string;
  priority: number; // 0 for source, 100 for constructive, 200 for transform, 300 for filter
  type: OperationType;
  operation: Operation;
}

// OpCreator is a function that takes parameters and returns an OperationMeta
export type OpCreator = (...args: any[]) => OperationMeta;

// Metadata for UI display
export interface FilterMetadata {
  id: string;
  type: 'start' | 'end' | 'pass-through';
  nodeId: string;
  label: string;
}

export interface TransformationMetadata {
  id: string;
  type: 'group-collapse';
  groupId: string;
  label: string;
}
