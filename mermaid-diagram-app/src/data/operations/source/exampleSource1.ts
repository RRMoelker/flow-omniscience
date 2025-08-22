import { Graph, OperationMeta } from '../../../types';

// Data transformation pipeline with 20 nodes, multiple entry/exit points

const graphData: Graph = {
  groups: [
    { id: 'project_awesome', type: 'project' },
    { id: 'main_project', type: 'project' },
    { id: 'train_eval_inference', type: 'workflow' },
    { id: 'databricks', type: 'system' },
    { id: 'job_runner', type: 'system' },
    { id: 'deploy_tool', type: 'system' },
    { id: 'inference_api', type: 'system' },
    { id: 'kubernetes', type: 'system' },
    { id: 'data_prep', type: 'workflow' },
    { id: 'inference', type: 'workflow' },
    { id: 'catalog.all', type: 'database' },
    { id: 'validation', type: 'database' },
    { id: 'processing', type: 'database' },
    { id: 'security', type: 'database' },
    { id: 'analytics', type: 'database' },
    { id: 'ml', type: 'database' },
    { id: 'reporting', type: 'database' },
    { id: 'etl', type: 'database' },
    { id: 'archival', type: 'database' }
  ],
  nodes: [
    // Data Sources
    { id: 'A', name: 'Raw User Data', type: 'database', groups: ['catalog.all'] },
    { id: 'B', name: 'Transaction Logs', type: 'data', groups: ['catalog.all'] },
    { id: 'C', name: 'External API Data', type: 'data', groups: ['catalog.all'] },
    { id: 'D', name: 'IoT Sensor Data', type: 'data', groups: ['catalog.all'] },
    { id: 'E', name: 'Legacy System Export', type: 'data', groups: ['catalog.all'] },
    
    // Validation
    { id: 'F', name: 'Data Validation', type: 'process', groups: ['validation', 'project_awesome'] },
    { id: 'G', name: 'Schema Validation', type: 'process', groups: ['validation', 'project_awesome'] },
    { id: 'H', name: 'Outlier Detection', type: 'process', groups: ['validation', 'project_awesome'] },
    { id: 'I', name: 'Fraud Check', type: 'process', groups: ['validation', 'project_awesome'] },
    // ETL
    { id: 'J', name: 'ETL Loader', type: 'process', groups: ['etl', 'project_awesome'] },
    { id: 'K', name: 'ETL Staging Table', type: 'data', groups: ['etl', 'project_awesome'] },
    // Processing
    { id: 'L', name: 'Data Cleaning', type: 'process', groups: ['processing', 'project_awesome'] },
    { id: 'M', name: 'Feature Engineering', type: 'process', groups: ['processing', 'project_awesome'] },
    { id: 'N', name: 'Data Aggregation', type: 'process', groups: ['processing', 'project_awesome'] },
    { id: 'O', name: 'Enrich Data', type: 'process', groups: ['processing', 'project_awesome'] },
    { id: 'P', name: 'Compute Feature Store', type: 'process', groups: ['processing', 'project_awesome'] },
    { id: 'Q', name: 'Intermediate Table 1', type: 'data', groups: ['processing', 'project_awesome'] },
    { id: 'R', name: 'Intermediate Table 2', type: 'data', groups: ['processing', 'project_awesome'] },
    { id: 'S', name: 'Intermediate Table 3', type: 'data', groups: ['processing', 'project_awesome'] },
    // Security
    { id: 'T', name: 'Data Compression', type: 'process', groups: ['security'] },
    { id: 'U', name: 'Data Encryption', type: 'process', groups: ['security'] },
    { id: 'V', name: 'Data Indexing', type: 'process', groups: ['security'] },
    // ML
    { id: 'W', name: 'ML Model Training', type: 'process', groups: ['ml', 'project_awesome'] },
    { id: 'X', name: 'ML Feature Table', type: 'data', groups: ['ml', 'project_awesome'] },
    { id: 'Y', name: 'Model Evaluation', type: 'process', groups: ['ml', 'analytics'] },
    { id: 'Z', name: 'Model Output', type: 'data', groups: ['ml'] },
    // Analytics
    { id: 'AA', name: 'Data Archiving', type: 'process', groups: ['archival'] },
    { id: 'AB', name: 'Quality Check', type: 'process', groups: ['analytics'] },
    { id: 'AC', name: 'Analytics Dashboard', type: 'view', groups: ['analytics', 'reporting'] },
    { id: 'AD', name: 'Reporting Table', type: 'data', groups: ['reporting'] },
    { id: 'AE', name: 'Executive Report', type: 'view', groups: ['reporting'] },
    // Outputs
    { id: 'AF', name: 'Processed Dataset', type: 'data' },
    { id: 'AG', name: 'Feature Dataset', type: 'data' },
    { id: 'AH', name: 'Analytics Dataset', type: 'database' },
    { id: 'AI', name: 'Archived Data', type: 'database', groups: ['archival'] },
    // More nodes for complexity
    { id: 'AJ', name: 'User Segmentation', type: 'process', groups: ['analytics', 'ml'] },
    { id: 'AK', name: 'Churn Prediction', type: 'process', groups: ['ml'] },
    { id: 'AL', name: 'Customer Table', type: 'data', groups: ['ml', 'analytics'] },
    { id: 'AM', name: 'Marketing Table', type: 'data', groups: ['analytics', 'reporting'] },
    { id: 'AN', name: 'Sales Table', type: 'data', groups: ['analytics', 'reporting'] },
    { id: 'AO', name: 'Sales Dashboard', type: 'view', groups: ['reporting'] },
    { id: 'AP', name: 'Data Export', type: 'process', groups: ['archival'] },
    { id: 'AQ', name: 'Backup Table', type: 'data', groups: ['archival'] },
    { id: 'AR', name: 'Legacy Archive', type: 'database', groups: ['archival'] },
    { id: 'AS', name: 'Data Sync', type: 'process', groups: ['etl', 'archival'] },
    { id: 'AT', name: 'Data Lake', type: 'database', groups: ['etl', 'archival'] },
    { id: 'AU', name: 'Data Mart', type: 'database', groups: ['analytics', 'reporting'] },
    { id: 'AV', name: 'Realtime Stream', type: 'data', groups: ['etl'] },
    { id: 'AW', name: 'Realtime Analytics', type: 'process', groups: ['analytics', 'etl'] },
    { id: 'AX', name: 'Realtime Dashboard', type: 'view', groups: ['analytics', 'reporting'] },
    { id: 'AY', name: 'Data API', type: 'process', groups: ['etl', 'reporting'] },
    { id: 'AZ', name: 'API Output Table', type: 'data', groups: ['reporting'] },
  ],
  edges: [
    // Data source flows
    { from: 'A', to: 'F' }, { from: 'B', to: 'F' }, { from: 'C', to: 'F' }, { from: 'D', to: 'F' }, { from: 'E', to: 'F' },
    // Validation
    { from: 'F', to: 'G' }, { from: 'F', to: 'H' }, { from: 'G', to: 'J' }, { from: 'H', to: 'I' }, { from: 'I', to: 'J' },
    // ETL
    { from: 'J', to: 'K' }, { from: 'K', to: 'L' }, { from: 'K', to: 'M' },
    // Processing
    { from: 'L', to: 'Q' }, { from: 'M', to: 'R' }, { from: 'N', to: 'S' }, { from: 'O', to: 'Q' }, { from: 'P', to: 'R' },
    { from: 'Q', to: 'W' }, { from: 'R', to: 'W' }, { from: 'S', to: 'W' },
    // ML
    { from: 'W', to: 'X' }, { from: 'X', to: 'Y' }, { from: 'Y', to: 'Z' },
    { from: 'W', to: 'AJ' }, { from: 'AJ', to: 'AK' }, { from: 'AK', to: 'AL' },
    // Analytics
    { from: 'AL', to: 'AB' }, { from: 'AB', to: 'AC' }, { from: 'AC', to: 'AE' },
    { from: 'AB', to: 'AM' }, { from: 'AB', to: 'AN' }, { from: 'AM', to: 'AO' }, { from: 'AN', to: 'AO' },
    { from: 'AW', to: 'AX' }, { from: 'AV', to: 'AW' },
    // Reporting
    { from: 'AY', to: 'AZ' }, { from: 'AZ', to: 'AO' },
    // Security
    { from: 'T', to: 'U' }, { from: 'U', to: 'V' },
    // Archival
    { from: 'AP', to: 'AQ' }, { from: 'AQ', to: 'AR' }, { from: 'AR', to: 'AI' },
    { from: 'AP', to: 'AT' }, { from: 'AT', to: 'AI' },
    // Data Lake/Mart
    { from: 'AT', to: 'AU' }, { from: 'AU', to: 'AX' },
    // Outputs
    { from: 'AC', to: 'AF' }, { from: 'AC', to: 'AG' }, { from: 'AC', to: 'AH' },
    { from: 'Z', to: 'AF' }, { from: 'Z', to: 'AG' },
    { from: 'AI', to: 'AH' },
    // Cross-links
    { from: 'F', to: 'L' }, { from: 'F', to: 'M' }, { from: 'G', to: 'L' }, { from: 'G', to: 'M' },
    { from: 'J', to: 'L' }, { from: 'J', to: 'M' }, { from: 'L', to: 'N' }, { from: 'M', to: 'O' },
    { from: 'N', to: 'P' }, { from: 'O', to: 'P' },
    { from: 'Q', to: 'AL' }, { from: 'R', to: 'AL' }, { from: 'S', to: 'AL' },
    { from: 'AL', to: 'AM' }, { from: 'AL', to: 'AN' },
    { from: 'AM', to: 'AX' }, { from: 'AN', to: 'AX' },
    { from: 'AX', to: 'AE' },
    { from: 'AY', to: 'AO' },
    { from: 'AP', to: 'AR' },
    { from: 'AW', to: 'AE' },
  ]
};

// Example source operation: sets the example graph as the base graph
const exampleSource = (): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // Source operations only change the base graph, result graph stays the same
    return [graphData, resultGraph, true];
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