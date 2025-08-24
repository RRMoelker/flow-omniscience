import { Graph, OperationMeta } from '../../../types';
import { validateGraph } from '../../graph/validator';
import { loadGraphFromJsonFile } from '../../io/jsonUtils';

const externalSource = (): OperationMeta => {
  return {
    id: 'external-source',
    label: 'External Source',
    type: 'source',
    priority: 0,
    operation: async (baseGraph: Graph, resultGraph: Graph): Promise<[Graph, Graph, boolean]> => {
      try {
        // Load external graph data from JSON file
        const externalGraph = await loadGraphFromJsonFile('/data/custom.json');
        
        // Validate the external graph data before returning it
        const validation = validateGraph(externalGraph);
        if (!validation.isValid) {
          console.warn('External graph validation failed:', validation.errors);
          throw new Error('External graph validation failed');
        }

        return [externalGraph, resultGraph, true];
      } catch (error) {
        console.error('Error loading external data:', error);
        // Return empty graph if external data fails to load
        return [{ nodes: [], edges: [], groups: [] }, { nodes: [], edges: [], groups: [] }, false];
      }
    }
  };
};

export default externalSource; 