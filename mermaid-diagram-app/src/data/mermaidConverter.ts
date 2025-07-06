import { Graph, Node, Edge } from './types';

// Convert graph data to Mermaid syntax
export const convertToMermaid = (graphData: Graph): string => {
  
  let mermaid = 'graph LR\n';
  
  // Add class definitions for styling
  mermaid += '  classDef group fill:#e6e6fa,stroke:#333,stroke-width:2px\n';
  mermaid += '  classDef data fill:#f5f5dc,stroke:#333,stroke-width:1px\n';
  mermaid += '  classDef process fill:#f0f8ff,stroke:#333,stroke-width:1px\n';
  
  // Add nodes
  graphData.nodes.forEach((node: Node) => {
    // Add node ID as prefix to the name
    const nodeNameWithId = `${node.id} - ${node.name}`;
    const nodeLabel = node.group 
      ? `${nodeNameWithId}<br/>Group: ${node.group}`
      : nodeNameWithId;
    
    // Add color styling based on node type
    let nodeStyle = '';
    if (node.type === 'group') {
      nodeStyle = ':::group';
    } else if (node.type === 'data') {
      nodeStyle = ':::data';
    } else if (node.type === 'process') {
      nodeStyle = ':::process';
    }
    
    mermaid += `  ${node.id}["${nodeLabel}"]${nodeStyle}\n`;
  });
  
  // Add edges
  graphData.edges.forEach((edge: Edge) => {
    if (edge.label) {
      mermaid += `  ${edge.from} -->|${edge.label}| ${edge.to}\n`;
    } else {
      mermaid += `  ${edge.from} --> ${edge.to}\n`;
    }
  });
  
  return mermaid;
}; 