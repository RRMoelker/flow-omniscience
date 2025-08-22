import { Graph, OperationMeta } from '../../../types';
import { validateGraph } from '../../graph/validator';

const externalSource = (): OperationMeta => {
  return {
    id: 'external-source',
    label: 'External Source',
    type: 'source',
    priority: 0,
    operation: (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
      try {
        // Import the external data
        const externalDataModule = require('./externalData');
        const externalGraph = externalDataModule.default();
        
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