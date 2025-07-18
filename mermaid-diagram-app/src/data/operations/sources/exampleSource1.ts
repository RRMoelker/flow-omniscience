import { Graph, OperationMeta } from '../../types';

// Data transformation pipeline with 20 nodes, multiple entry/exit points
const exampleGraphData: Graph = {
  groups: [
    { id: 'pipeline', type: 'database' },
    { id: 'data_sources', type: 'database' },
    { id: 'validation', type: 'database' },
    { id: 'processing', type: 'database' },
    { id: 'security', type: 'database' },
    { id: 'analytics', type: 'database' }
  ],
  nodes: [
    // Data Sources (group: data_sources)
    { id: 'A', name: 'Raw User Data', type: 'database', groups: ['data_sources'] },
    { id: 'B', name: 'Transaction Logs', type: 'data', groups: ['data_sources'] },
    { id: 'C', name: 'External API Data', type: 'data', groups: ['data_sources'] },
    
    // Data Processing Operations - Validation (group: validation)
    { id: 'D', name: 'Data Validation', type: 'process', groups: ['validation', 'pipeline'] },
    { id: 'M', name: 'Schema Validation', type: 'process', groups: ['validation', 'pipeline'] },
    { id: 'K', name: 'Outlier Detection', type: 'process', groups: ['validation', 'pipeline'] },
    
    // Data Processing Operations - Processing (group: processing)
    { id: 'E', name: 'Data Cleaning', type: 'process', groups: ['processing', 'pipeline'] },
    { id: 'F', name: 'Feature Engineering', type: 'process', groups: ['processing', 'pipeline'] },
    { id: 'G', name: 'Data Aggregation', type: 'process', groups: ['processing', 'pipeline'] },
    { id: 'H', name: 'Enrich Data', type: 'process', groups: ['processing', 'pipeline'] },
    { id: 'I', name: 'Compute Feature Store', type: 'process', groups: ['processing', 'pipeline'] },
    { id: 'J', name: 'Data Normalization', type: 'process', groups: ['processing', 'pipeline'] },
    { id: 'L', name: 'Data Transformation', type: 'process', groups: ['processing', 'pipeline'] },
    { id: 'N', name: 'Data Deduplication', type: 'process', groups: ['processing', 'pipeline'] },
    { id: 'O', name: 'Data Partitioning', type: 'process', groups: ['processing', 'pipeline'] },
    
    // Security Operations (group: security)
    { id: 'P', name: 'Data Compression', type: 'process', groups: ['security'] },
    { id: 'Q', name: 'Data Encryption', type: 'process', groups: ['security'] },
    { id: 'R', name: 'Data Indexing', type: 'process', groups: ['security'] },
    
    // Analytics and Quality (group: analytics)
    { id: 'S', name: 'Data Archiving', type: 'process', groups: ['analytics'] },
    { id: 'T', name: 'Quality Check', type: 'process', groups: ['analytics'] },
    
    // Processed Data Outputs (no group)
    { id: 'U', name: 'Processed Dataset', type: 'data' },
    { id: 'V', name: 'Feature Dataset', type: 'data' },
    { id: 'W', name: 'Analytics dashboard', type: 'view' }
  ],
  edges: [
    // Data source flows
    { from: 'A', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'H' },
    
    // Validation and cleaning flows
    { from: 'D', to: 'F' },
    { from: 'D', to: 'K' },
    { from: 'E', to: 'F' },
    { from: 'E', to: 'K' },
    
    // Feature engineering flows
    { from: 'F', to: 'G' },
    { from: 'F', to: 'I' },
    { from: 'G', to: 'J' },
    { from: 'H', to: 'I' },
    { from: 'I', to: 'L' },
    { from: 'J', to: 'K' },
    { from: 'K', to: 'M' },
    
    // Data processing flows
    { from: 'M', to: 'N' },
    { from: 'N', to: 'O' },
    { from: 'O', to: 'P' },
    { from: 'P', to: 'Q' },
    { from: 'Q', to: 'R' },
    { from: 'R', to: 'S' },
    { from: 'S', to: 'T' },
    
    // Quality control flows
    { from: 'L', to: 'V' },
    
    // Final output flows
    { from: 'T', to: 'U' },
    { from: 'T', to: 'V' },
    { from: 'T', to: 'W' },
    
    // Cross-process connections
    { from: 'L', to: 'M' },
    { from: 'Q', to: 'T' },
    { from: 'R', to: 'T' }
  ]
};

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