import { Graph, Node } from '../../data/types';

export function addNodeSelection(
  svgElement: SVGElement, 
  graphData: Graph, 
  onNodeSelect: (node: Node | null) => void
) {
  // Find all node elements (rectangles in Mermaid diagrams)
  const nodeElements = svgElement.querySelectorAll('rect[class*="node"], rect[class*="label"], g[class*="node"]');
  
  console.log('Found node elements:', nodeElements.length);
  
  nodeElements.forEach((nodeElement) => {
    // Extract node ID from the element's class or data attributes
    const nodeId = extractNodeId(nodeElement);
    console.log('Extracted node ID:', nodeId, 'from element:', nodeElement);
    
    if (!nodeId) return;
    
    // Find the corresponding node data
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (!node) {
      console.log('No node found for ID:', nodeId);
      return;
    }
    
    console.log('Found node:', node);
    
    // Add click event listener
    nodeElement.addEventListener('click', (event) => {
      event.stopPropagation();
      console.log('Node clicked:', node);
      
      // Clear previous selection
      svgElement.querySelectorAll('.selected-node').forEach(el => {
        el.classList.remove('selected-node');
      });
      
      // Add selection class to clicked node and its children
      nodeElement.classList.add('selected-node');
      nodeElement.querySelectorAll('rect, circle, ellipse').forEach(child => {
        child.classList.add('selected-node');
      });
      
      // Call the callback with the selected node
      onNodeSelect(node);
    });
  });
  
  // Add click listener to SVG background to clear selection
  svgElement.addEventListener('click', (event) => {
    if (event.target === svgElement) {
      svgElement.querySelectorAll('.selected-node').forEach(el => {
        el.classList.remove('selected-node');
      });
      onNodeSelect(null);
    }
  });
}

function extractNodeId(element: Element): string | null {
  // Try to extract from class names
  const classNames = element.getAttribute('class') || '';
  const classMatch = classNames.match(/node-([A-Z])/);
  if (classMatch) {
    return classMatch[1];
  }
  
  // Try to extract from data attributes
  const dataId = element.getAttribute('data-id');
  if (dataId) {
    return dataId;
  }
  
  // Try to extract from text content of nearby text elements
  const parent = element.parentElement;
  if (parent) {
    const textElement = parent.querySelector('text');
    if (textElement) {
      const textContent = textElement.textContent?.trim();
      if (textContent) {
        // Look for a node with this name
        return textContent;
      }
    }
  }
  
  // Try to find node ID from the parent group's class
  if (element.tagName === 'G') {
    const groupClass = element.getAttribute('class') || '';
    const groupMatch = groupClass.match(/flowchart-([A-Z])/);
    if (groupMatch) {
      return groupMatch[1];
    }
  }
  
  // Try to find node ID from the parent's id attribute
  const parentId = element.parentElement?.getAttribute('id');
  if (parentId) {
    const idMatch = parentId.match(/flowchart-([A-Z])/);
    if (idMatch) {
      return idMatch[1];
    }
  }
  
  return null;
} 