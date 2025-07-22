import { Graph } from '../../types';

/**
 * Creates an empty graph with no nodes or edges
 * @returns An empty Graph object
 */
export const createEmptyGraph = (): Graph => {
  return {
    nodes: [],
    edges: [],
    groups: []
  };
}; 