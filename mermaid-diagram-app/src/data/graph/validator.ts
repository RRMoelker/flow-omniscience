import { Graph, Node, Group } from '../../types';

// Mermaid reserved keywords that cannot be used as node or group IDs
const MERMAID_RESERVED_KEYWORDS = [
  'end',           // Subgraph terminator
  'start',         // Potential subgraph starter
  'subgraph',      // Subgraph keyword
  'graph',         // Graph type keyword
  'flowchart',     // Graph type keyword
  'sequence',      // Graph type keyword
  'class',         // Class definition keyword
  'state',         // State diagram keyword
  'git',           // Git graph keyword
  'pie',           // Pie chart keyword
  'journey',       // Journey diagram keyword
  'gantt',         // Gantt chart keyword
  'classDef',      // Class definition keyword
  'link',          // Link keyword
  'click',         // Click event keyword
  'style',         // Style keyword
  'direction',     // Direction keyword
  'TB',            // Direction value
  'TD',            // Direction value
  'BT',            // Direction value
  'RL',            // Direction value
  'LR'             // Direction value
];

export interface ValidationError {
  type: 'duplicate_id' | 'reserved_keyword';
  message: string;
  duplicates?: string[];
  reservedKeywords?: string[];
  affectedIds?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateGraph = (graph: Graph, do_throw=true): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Check for duplicate IDs across nodes and groups
  const allIds = new Map<string, { type: 'node' | 'group', id: string }>();
  const duplicates = new Set<string>();
  
  // Check for reserved keywords
  const reservedKeywords = new Set<string>();
  const affectedIds = new Set<string>();
  
  // Check nodes
  graph.nodes.forEach((node: Node) => {
    const id = node.id;
    
    // Check for reserved keywords
    if (MERMAID_RESERVED_KEYWORDS.includes(id)) {
      reservedKeywords.add(id);
      affectedIds.add(`node:${id}`);
    }
    
    // Check for duplicates
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
    
    // Check for reserved keywords
    if (MERMAID_RESERVED_KEYWORDS.includes(id)) {
      reservedKeywords.add(id);
      affectedIds.add(`group:${id}`);
    }
    
    // Check for duplicates
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
  
  // If reserved keywords found, create validation error
  if (reservedKeywords.size > 0) {
    errors.push({
      type: 'reserved_keyword',
      message: `Found ${reservedKeywords.size} reserved keyword(s) used as ID(s): ${Array.from(reservedKeywords).join(', ')}. These are reserved by Mermaid and cannot be used as node or group IDs.`,
      reservedKeywords: Array.from(reservedKeywords),
      affectedIds: Array.from(affectedIds)
    });
  }
  
  if (do_throw && errors.length > 0) {
    for (const error of errors) {
      console.error(error.message);
    }
    throw new Error('Graph validation failed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 