import { Graph, OperationMeta } from '../types';

// Data transformation pipeline with 20 nodes, multiple entry/exit points
export const exampleGraphData: Graph = {
  nodes: [
    // Data Sources (group: data_sources)
    { id: 'A', name: 'Raw User Data', type: 'data', group: 'data_sources' },
    { id: 'B', name: 'Transaction Logs', type: 'data', group: 'data_sources' },
    { id: 'C', name: 'External API Data', type: 'data', group: 'data_sources' },
    
    // Data Processing Operations - Validation (group: validation)
    { id: 'D', name: 'Data Validation', type: 'process', group: 'validation' },
    { id: 'M', name: 'Schema Validation', type: 'process', group: 'validation' },
    { id: 'K', name: 'Outlier Detection', type: 'process', group: 'validation' },
    
    // Data Processing Operations - Processing (group: processing)
    { id: 'E', name: 'Data Cleaning', type: 'process', group: 'processing' },
    { id: 'F', name: 'Feature Engineering', type: 'process', group: 'processing' },
    { id: 'G', name: 'Data Aggregation', type: 'process', group: 'processing' },
    { id: 'H', name: 'Enrich Data', type: 'process', group: 'processing' },
    { id: 'I', name: 'Compute Feature Store', type: 'process', group: 'processing' },
    { id: 'J', name: 'Data Normalization', type: 'process', group: 'processing' },
    { id: 'L', name: 'Data Transformation', type: 'process', group: 'processing' },
    { id: 'N', name: 'Data Deduplication', type: 'process', group: 'processing' },
    { id: 'O', name: 'Data Partitioning', type: 'process', group: 'processing' },
    
    // Security Operations (group: security)
    { id: 'P', name: 'Data Compression', type: 'process', group: 'security' },
    { id: 'Q', name: 'Data Encryption', type: 'process', group: 'security' },
    { id: 'R', name: 'Data Indexing', type: 'process', group: 'security' },
    
    // Analytics and Quality (group: analytics)
    { id: 'S', name: 'Data Archiving', type: 'process', group: 'analytics' },
    { id: 'T', name: 'Quality Check', type: 'process', group: 'analytics' },
    
    // Processed Data Outputs (no group)
    { id: 'U', name: 'Processed Dataset', type: 'data' },
    { id: 'V', name: 'Feature Dataset', type: 'data' },
    { id: 'W', name: 'Analytics Dataset', type: 'data' }
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