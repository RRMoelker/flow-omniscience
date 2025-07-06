import { Graph, OperationMeta } from '../../types';

// Remote source operation: sets a remote graph as the base graph
const remoteSource = (): OperationMeta => {
  const operation = (baseGraph: Graph, resultGraph: Graph): [Graph, Graph, boolean] => {
    // For now, return a basic remote graph (no actual remote connection)
    const remoteGraphData: Graph = {
      nodes: [
        { id: 'remote1', name: 'Remote Node 1', type: 'process' },
        { id: 'remote2', name: 'Remote Node 2', type: 'data' },
        { id: 'remote3', name: 'Remote Node 3', type: 'process', group: 'remote-group' },
        { id: 'remote4', name: 'Remote Node 4', type: 'data', group: 'remote-group' }
      ],
      edges: [
        { from: 'remote1', to: 'remote2' },
        { from: 'remote2', to: 'remote3' },
        { from: 'remote3', to: 'remote4' }
      ]
    };
    
    // Source operations only change the base graph, result graph stays the same
    return [remoteGraphData, resultGraph, true];
  };

  return {
    id: 'remote-source',
    label: 'Remote Source',
    priority: 0, // Source priority
    type: 'source',
    operation
  };
};

export default remoteSource; 