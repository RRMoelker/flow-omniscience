import { Graph, Node, Edge, Group, GroupType } from './types';

// Convert graph data to Mermaid syntax
export const convertToMermaid = (graphData: Graph, groupType: GroupType = 'database'): string => {
  let mermaid = 'graph LR\n';

  // Add class definitions for styling
  mermaid += '  classDef group fill:#e6e6fa,stroke:#333,stroke-width:2px\n';
  mermaid += '  classDef data fill:#f5f5dc,stroke:#333,stroke-width:1px\n';
  mermaid += '  classDef process fill:#f0f8ff,stroke:#333,stroke-width:1px\n';
  mermaid += '  classDef view fill:#ffe0b2,stroke:#ff9800,stroke-width:2px,stroke-dasharray: 4 2\n';
  mermaid += '  classDef database fill:#e0f7fa,stroke:#00838f,stroke-width:2px\n';

  // Build a map of groupId to group object
  const groupMap: { [groupId: string]: Group } = {};
  if (graphData.groups) {
    graphData.groups.forEach(group => {
      groupMap[group.id] = group;
    });
  }

  // Build a map of groupId to nodes in that group
  const groupNodesMap: { [groupId: string]: Node[] } = {};
  if (graphData.groups) {
    graphData.groups.forEach(group => {
      groupNodesMap[group.id] = [];
    });
  }
  graphData.nodes.forEach(node => {
    if (node.groups) {
      node.groups.forEach(groupId => {
        if (!groupNodesMap[groupId]) groupNodesMap[groupId] = [];
        groupNodesMap[groupId].push(node);
      });
    }
  });

  // Track nodes that have been rendered in a group
  const renderedNodeIds = new Set<string>();

  // Add subgraphs for each group of the selected type
  if (graphData.groups) {
    graphData.groups.forEach(group => {
      if (group.type === groupType) {
        const nodesInGroup = (groupNodesMap[group.id] || []).filter(node => !renderedNodeIds.has(node.id));
        if (nodesInGroup.length > 0) {
          mermaid += `  subgraph ${group.id}\n`;
          nodesInGroup.forEach(node => {
            renderedNodeIds.add(node.id);
            // Node label is just the name
            const nodeLabel = node.name;
            if (node.type === 'group') {
              mermaid += `    ${node.id}["${nodeLabel}"]:::group\n`;
            } else if (node.type === 'data') {
              mermaid += `    ${node.id}["${nodeLabel}"]:::data\n`;
            } else if (node.type === 'process') {
              mermaid += `    ${node.id}["${nodeLabel}"]:::process\n`;
            } else if (node.type === 'view') {
              mermaid += `    ${node.id}["${nodeLabel}"]:::view\n`;
            } else if (node.type === 'database') {
              mermaid += `    ${node.id}[(${nodeLabel})]:::database\n`;
            }
          });
          mermaid += '  end\n';
        }
      }
    });
  }

  // Add ungrouped nodes (nodes not in any group or not in a displayed group)
  graphData.nodes.forEach(node => {
    if (!renderedNodeIds.has(node.id)) {
      const nodeLabel = node.name;
      if (node.type === 'group') {
        mermaid += `  ${node.id}["${nodeLabel}"]:::group\n`;
      } else if (node.type === 'data') {
        mermaid += `  ${node.id}["${nodeLabel}"]:::data\n`;
      } else if (node.type === 'process') {
        mermaid += `  ${node.id}["${nodeLabel}"]:::process\n`;
      } else if (node.type === 'view') {
        mermaid += `  ${node.id}["${nodeLabel}"]:::view\n`;
      } else if (node.type === 'database') {
        mermaid += `  ${node.id}[(${nodeLabel})]:::database\n`;
      }
    }
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