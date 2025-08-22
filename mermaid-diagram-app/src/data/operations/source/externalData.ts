import { Graph } from '../../../types';

const getData = (): Graph => {
  return {
    groups: [{ id: 'remote-group', type: 'database' }],
    nodes: [
      { id: 'remote1', name: 'Remote Node 1', type: 'process' },
      { id: 'remote2', name: 'Remote Node 2', type: 'data' },
      { id: 'remote3', name: 'Remote Node 3', type: 'process', groups: ['remote-group'] },
      { id: 'remote4', name: 'Remote Node 4', type: 'data', groups: ['remote-group'] }
    ],
    edges: [
      { from: 'remote1', to: 'remote2' },
      { from: 'remote2', to: 'remote3' },
      { from: 'remote3', to: 'remote4' }
    ]
  };
};

export default getData; 