// Add hover highlighting to nodes in the SVG
export const addHoverHighlighting = (svgElement: SVGElement) => {
  // Find all node elements
  const nodeElements = svgElement.querySelectorAll('.node');
  
  nodeElements.forEach((nodeElement) => {
    const nodeId = nodeElement.getAttribute('id');
    if (!nodeId) return;
    
    // Add hover event listeners
    nodeElement.addEventListener('mouseenter', () => {
      highlightNode(svgElement, nodeId);
    });
    
    nodeElement.addEventListener('mouseleave', () => {
      clearHighlighting(svgElement);
    });
  });
};

// Highlight a node
const highlightNode = (svgElement: SVGElement, nodeId: string) => {
  // Add hovering class to SVG
  svgElement.classList.add('hovering');
  
  // Highlight the hovered node
  const nodeElement = svgElement.querySelector(`#${nodeId}`);
  if (nodeElement) {
    nodeElement.classList.add('hovered');
  }
};

// Clear all highlighting
const clearHighlighting = (svgElement: SVGElement) => {
  // Remove hovering class from SVG
  svgElement.classList.remove('hovering');
  
  // Remove hovered classes from all elements
  const hoveredElements = svgElement.querySelectorAll('.hovered');
  hoveredElements.forEach(element => {
    element.classList.remove('hovered');
  });
}; 