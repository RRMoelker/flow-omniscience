import { Graph } from '../types';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Creates a basic example graph for demonstration purposes
 */
function createGraph(): Graph {
  return {
    groups: [
      { id: 'example_group', type: 'project' },
      { id: 'data_group', type: 'database' },
      { id: 'process_group', type: 'workflow' }
    ],
    nodes: [
      { id: 'start', name: 'Start Node', type: 'process', groups: ['example_group'] },
      { id: 'data1', name: 'Input Data', type: 'data', groups: ['data_group'] },
      { id: 'process1', name: 'Process Data', type: 'process', groups: ['process_group', 'example_group'] },
      { id: 'data2', name: 'Processed Data', type: 'data', groups: ['data_group'] },
      { id: 'end_node', name: 'end node', type: 'process', groups: ['example_group'] }
    ],
    edges: [
      { from: 'start', to: 'data1' },
      { from: 'data1', to: 'process1' },
      { from: 'process1', to: 'data2' },
      { from: 'data2', to: 'end_node' }
    ]
  };
}

/**
 * Main function that creates the graph and outputs to JSON
 */
function main() {
  try {
    // Get output path from command line arguments
    const outputPath = process.argv[2];
    
    if (!outputPath) {
      console.error('Usage: ts-node ingestExt.ts <output-path>');
      console.error('Example: ts-node ingestExt.ts ./public/data/custom.json');
      process.exit(1);
    }

    // Create the graph
    const graph = createGraph();
    
    // Convert to JSON with pretty formatting
    const jsonOutput = JSON.stringify(graph, null, 2);
    
    // Write to the specified path
    writeFileSync(outputPath, jsonOutput, 'utf8');
    
    console.log(`✅ Graph successfully written to: ${outputPath}`);
    console.log(`📊 Graph contains:`);
    console.log(`   - ${graph.groups.length} groups`);
    console.log(`   - ${graph.nodes.length} nodes`);
    console.log(`   - ${graph.edges.length} edges`);
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Run the script if called directly
main();

export { createGraph, main };
