import { Graph, OperationMeta } from '../../types';

const complexGraphData: Graph = {
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
  ],
  nodes: [
    // Main project
    // Retrain Flow (parallel)
    { id: 'R1', name: 'run_data_prep', type: 'process', groups: ['main_project', 'databricks'] },
    { id: 'R2', name: 'train_eval_inference', type: 'process', groups: ['main_project', 'train_eval_inference', 'databricks'] },
    { id: 'R3', name: 'train', type: 'process', groups: ['main_project', 'train_eval_inference', 'databricks'] },
    { id: 'R4', name: 'eval', type: 'process', groups: ['main_project', 'train_eval_inference', 'databricks'] },
    { id: 'R5', name: 'run_inference', type: 'process', groups: ['main_project', 'train_eval_inference', 'databricks'] },
    // Deployment flow
    { id: 'R6', name: 'deploy', type: 'process', groups: ['main_project', 'databricks'] },
    { id: 'R7', name: 'deploy_pipeline', type: 'process', groups: ['main_project', 'deploy_tool'] },
    { id: 'R8', name: 'inference_api', type: 'data', groups: ['main_project', 'kubernetes'] },
    // Job Runner system
    { id: 'JR1', name: 'daily_inference', type: 'process', groups: ['main_project', 'job_runner'] },
    // Data Prep workflow
    { id: 'DP1', name: 'base_table', type: 'process', groups: ['main_project', 'databricks', 'data_prep'] },
    { id: 'DP2', name: 'feature_tables', type: 'process', groups: ['main_project', 'databricks', 'data_prep'] },
    { id: 'DP3', name: 'split_data', type: 'process', groups: ['main_project', 'databricks', 'data_prep'] },
    // Inference workflow
    { id: 'INF1', name: 'run_data_prep', type: 'process', groups: ['main_project', 'databricks','inference'] },
    { id: 'INF2', name: 'inference', type: 'process', groups: ['main_project', 'databricks', 'inference'] },
    { id: 'INF3', name: 'do_deploy', type: 'process', groups: ['main_project', 'databricks', 'inference'] }
  ],
  edges: [
    // Retrain flow edges
    { from: 'R1', to: 'R2' },
    { from: 'R2', to: 'R3' },
    { from: 'R2', to: 'R4' },
    { from: 'R2', to: 'R5' },
    // Deployment flow edges
    { from: 'R5', to: 'INF1' },
    { from: 'R6', to: 'R7' },
    { from: 'R7', to: 'R8' },
    // Job runner edge
    { from: 'JR1', to: 'R5' },
    // Data Prep workflow edges
    { from: 'DP1', to: 'DP2' },
    { from: 'DP2', to: 'DP3' },
    { from: 'R1', to: 'DP1' },
    { from: 'INF1', to: 'DP1' },

    { from: 'INF1', to: 'INF2' },
    { from: 'INF2', to: 'INF3' },
    { from: 'INF3', to: 'R6' },
  ]
};

const complexExampleSource = (): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    return [complexGraphData, resultGraph, true];
  };

  return {
    id: 'complex-example-source',
    label: 'Complex Source',
    priority: 0,
    type: 'source',
    operation
  };
};

export default complexExampleSource; 