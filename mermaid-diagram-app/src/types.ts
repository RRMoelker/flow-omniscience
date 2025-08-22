// =====================
// Constants & Enums
// =====================
export const GROUP_TYPES = ['database', 'project', 'system', 'workflow', 'team'] as const;
export type GroupType = typeof GROUP_TYPES[number];

// =====================
// Graph Data Model Types
// =====================
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

// =====================
// Operation Types
// =====================
export type Operation = (baseGraph: Graph, resultGraph: Graph) => [Graph, Graph, boolean];

export type OperationType = 'source' | 'add' | 'transform' | 'filter' | 'remove';

export interface OperationMeta {
  id: string;
  label: string;
  priority: number; // 0 for source, 100 for constructive, 200 for transform, 300 for filter
  type: OperationType;
  operation: Operation;
}

export type OpCreator = (...args: any[]) => OperationMeta;

// =====================
// UI Metadata Types
// =====================
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
