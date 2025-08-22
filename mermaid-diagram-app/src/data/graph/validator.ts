import { Graph, Node, Group } from '../../types';

export interface ValidationError {
  type: 'duplicate_id';
  message: string;
  duplicates: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateGraph = (graph: Graph): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Check for duplicate IDs across nodes and groups
  const allIds = new Map<string, { type: 'node' | 'group', id: string }>();
  const duplicates = new Set<string>();
  
  // Check nodes
  graph.nodes.forEach((node: Node) => {
    const id = node.id;
    if (allIds.has(id)) {
      duplicates.add(id);
      const existing = allIds.get(id)!;
      throw new Error(`Duplicate ID "${id}" found in ${existing.type} "${existing.id}" and node "${node.id}"`);
    } else {
      allIds.set(id, { type: 'node', id: node.id });
    }
  });
  
  // Check groups
  graph.groups.forEach((group: Group) => {
    const id = group.id;
    if (allIds.has(id)) {
      duplicates.add(id);
      const existing = allIds.get(id)!;
      throw new Error(`Duplicate ID "${id}" found in ${existing.type} "${existing.id}" and group "${group.id}"`);
    } else {
      allIds.set(id, { type: 'group', id: group.id });
    }
  });
  
  // If duplicates found, create validation error
  if (duplicates.size > 0) {
    errors.push({
      type: 'duplicate_id',
      message: `Found ${duplicates.size} duplicate ID(s): ${Array.from(duplicates).join(', ')}`,
      duplicates: Array.from(duplicates)
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 