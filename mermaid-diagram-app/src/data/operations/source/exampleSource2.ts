import { Graph, OperationMeta } from '../../../types';
import { validateGraph } from '../../graph/validator';
import { loadGraphFromJsonFile } from '../../io/jsonUtils';

const exampleSource2 = (): OperationMeta => {
  const operation = async (baseGraph: Graph, resultGraph: Graph): Promise<[Graph, Graph, boolean]> => {
    try {
      // Load graph data from JSON file
      const complexGraphData = await loadGraphFromJsonFile('/data/exampleSource2.json');
      
      // Validate the graph data before returning it
      const validation = validateGraph(complexGraphData);
      if (!validation.isValid) {
        console.warn('Graph validation failed:', validation.errors);
        throw new Error('Graph validation failed');
      }
      
      return [complexGraphData, resultGraph, true];
    } catch (error) {
      console.error('Error loading example source 2:', error);
      throw new Error(`Failed to load example source 2: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    id: 'complex-example-source',
    label: 'Complex Source',
    priority: 0,
    type: 'source',
    operation
  };
};

export default exampleSource2; 