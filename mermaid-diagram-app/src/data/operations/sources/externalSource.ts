import { Graph, OperationMeta } from '../../types';

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
        
        return [externalGraph, externalGraph, true];
      } catch (error) {
        console.error('Error loading external data:', error);
        // Return empty graph if external data fails to load
        return [{ nodes: [], edges: [] }, { nodes: [], edges: [] }, false];
      }
    }
  };
};

export default externalSource; 