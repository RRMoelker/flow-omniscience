import { Graph, OperationMeta } from '../../../types';
import { validateGraph } from '../../graph/validator';
import { loadGraphFromJsonFile } from '../../io/jsonUtils';

// Example source operation: loads the example graph from JSON file
const exampleSource = (): OperationMeta => {
  const operation = async (baseGraph: Graph, resultGraph: Graph): Promise<[Graph, Graph, boolean]> => {
    try {
      // Load graph data from JSON file
      const graphData = await loadGraphFromJsonFile('/data/exampleSource1.json');
      
      // Validate the graph data before returning it
      validateGraph(graphData);
      
      // Source operations only change the base graph, result graph stays the same
      return [graphData, resultGraph, true];
    } catch (error) {
      console.error('Error loading example source 1:', error);
      throw new Error(`Failed to load example source 1: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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