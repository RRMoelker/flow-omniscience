import { Graph } from '../../types';

/**
 * Loads graph data from a JSON file
 * @param jsonData - The JSON string or parsed object containing graph data
 * @returns Graph object
 */
export const loadGraphFromJson = (jsonData: string | object): Graph => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Validate the structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON data structure');
    }
    
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges) || !Array.isArray(data.groups)) {
      throw new Error('JSON must contain nodes, edges, and groups arrays');
    }
    
    return data as Graph;
  } catch (error) {
    console.error('Error loading graph from JSON:', error);
    throw new Error(`Failed to load graph from JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Saves graph data to a JSON string
 * @param graph - The Graph object to save
 * @param pretty - Whether to format the JSON with indentation
 * @returns JSON string
 */
export const saveGraphToJson = (graph: Graph, pretty: boolean = true): string => {
  try {
    if (pretty) {
      return JSON.stringify(graph, null, 2);
    }
    return JSON.stringify(graph);
  } catch (error) {
    console.error('Error saving graph to JSON:', error);
    throw new Error(`Failed to save graph to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Loads graph data from a JSON file using fetch
 * @param filePath - Path to the JSON file
 * @returns Promise<Graph>
 */
export const loadGraphFromJsonFile = async (filePath: string): Promise<Graph> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    return loadGraphFromJson(jsonData);
  } catch (error) {
    console.error('Error loading graph from JSON file:', error);
    throw new Error(`Failed to load graph from JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
