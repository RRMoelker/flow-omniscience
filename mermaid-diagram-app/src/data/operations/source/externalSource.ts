import { Graph, OperationMeta } from '../../../types';

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