import { Graph } from '../../data/types';

// Add SVG buttons to nodes after Mermaid renders
export const addSvgButtonsToNodes = (
  svgElement: SVGElement,
  onSetStartNode: (nodeId: string) => void,
  onSetEndNode: (nodeId: string) => void,
  onSetPassThroughNode: (nodeId: string) => void,
  onGroupCollapseNode: (groupId: string) => void,
  graphData: Graph
) => {
  const nodeElements = svgElement.querySelectorAll('g.node');
  
  nodeElements.forEach((nodeElement) => {
    const nodeId = nodeElement.getAttribute('id')?.split('-')[1];
    if (!nodeId) return;
    
    // Find the node data to check if it has a group
    const nodeData = graphData.nodes.find(node => node.id === nodeId);
    const hasGroup = nodeData?.group;
    
    // Create button group
    const buttonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    buttonGroup.setAttribute('class', 'node-buttons');
    buttonGroup.setAttribute('data-node-id', nodeId);
    
    // Create start button with play emoji
    const startButton = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    startButton.setAttribute('class', 'svg-button start-button');
    startButton.setAttribute('data-action', 'start');
    
    const startRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    startRect.setAttribute('x', '-45');
    startRect.setAttribute('y', '-35');
    startRect.setAttribute('width', '25');
    startRect.setAttribute('height', '20');
    startRect.setAttribute('rx', '3');
    startRect.setAttribute('fill', '#4CAF50');
    startRect.setAttribute('stroke', '#45a049');
    startRect.setAttribute('stroke-width', '1');
    
    const startText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    startText.setAttribute('x', '-32');
    startText.setAttribute('y', '-22');
    startText.setAttribute('font-size', '12');
    startText.setAttribute('fill', 'white');
    startText.setAttribute('text-anchor', 'middle');
    startText.textContent = '▶️';
    
    startButton.appendChild(startRect);
    startButton.appendChild(startText);
    
    // Create pass-through button with shuffle emoji
    const passThroughButton = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    passThroughButton.setAttribute('class', 'svg-button pass-through-button');
    passThroughButton.setAttribute('data-action', 'pass-through');
    
    const passThroughRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    passThroughRect.setAttribute('x', '-10');
    passThroughRect.setAttribute('y', '-35');
    passThroughRect.setAttribute('width', '25');
    passThroughRect.setAttribute('height', '20');
    passThroughRect.setAttribute('rx', '3');
    passThroughRect.setAttribute('fill', '#FF9800');
    passThroughRect.setAttribute('stroke', '#F57C00');
    passThroughRect.setAttribute('stroke-width', '1');
    
    const passThroughText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    passThroughText.setAttribute('x', '3');
    passThroughText.setAttribute('y', '-22');
    passThroughText.setAttribute('font-size', '12');
    passThroughText.setAttribute('fill', 'white');
    passThroughText.setAttribute('text-anchor', 'middle');
    passThroughText.textContent = '🔀';
    
    passThroughButton.appendChild(passThroughRect);
    passThroughButton.appendChild(passThroughText);
    
    // Create end button with stop emoji
    const endButton = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    endButton.setAttribute('class', 'svg-button end-button');
    endButton.setAttribute('data-action', 'end');
    
    const endRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    endRect.setAttribute('x', '25');
    endRect.setAttribute('y', '-35');
    endRect.setAttribute('width', '25');
    endRect.setAttribute('height', '20');
    endRect.setAttribute('rx', '3');
    endRect.setAttribute('fill', '#2196F3');
    endRect.setAttribute('stroke', '#1976D2');
    endRect.setAttribute('stroke-width', '1');
    
    const endText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    endText.setAttribute('x', '38');
    endText.setAttribute('y', '-22');
    endText.setAttribute('font-size', '12');
    endText.setAttribute('fill', 'white');
    endText.setAttribute('text-anchor', 'middle');
    endText.textContent = '⏹️';
    
    endButton.appendChild(endRect);
    endButton.appendChild(endText);
    
    // Add click handlers
    startButton.addEventListener('click', (e) => {
      e.stopPropagation();
      onSetStartNode(nodeId);
    });
    
    endButton.addEventListener('click', (e) => {
      e.stopPropagation();
      onSetEndNode(nodeId);
    });
    
    passThroughButton.addEventListener('click', (e) => {
      e.stopPropagation();
      onSetPassThroughNode(nodeId);
    });
    
    // Add buttons to the group
    buttonGroup.appendChild(startButton);
    buttonGroup.appendChild(passThroughButton);
    buttonGroup.appendChild(endButton);
    
    // Add group collapse button only if node has a group
    if (hasGroup) {
      const groupCollapseButton = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      groupCollapseButton.setAttribute('class', 'svg-button group-collapse-button');
      groupCollapseButton.setAttribute('data-action', 'group-collapse');
      
      const groupCollapseRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      groupCollapseRect.setAttribute('x', '60');
      groupCollapseRect.setAttribute('y', '-35');
      groupCollapseRect.setAttribute('width', '25');
      groupCollapseRect.setAttribute('height', '20');
      groupCollapseRect.setAttribute('rx', '3');
      groupCollapseRect.setAttribute('fill', '#E91E63');
      groupCollapseRect.setAttribute('stroke', '#C2185B');
      groupCollapseRect.setAttribute('stroke-width', '1');
      
      const groupCollapseText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      groupCollapseText.setAttribute('x', '73');
      groupCollapseText.setAttribute('y', '-22');
      groupCollapseText.setAttribute('font-size', '12');
      groupCollapseText.setAttribute('fill', 'white');
      groupCollapseText.setAttribute('text-anchor', 'middle');
      groupCollapseText.textContent = '🗂️';
      
      groupCollapseButton.appendChild(groupCollapseRect);
      groupCollapseButton.appendChild(groupCollapseText);
      
      groupCollapseButton.addEventListener('click', (e) => {
        e.stopPropagation();
        onGroupCollapseNode(hasGroup);
      });
      
      buttonGroup.appendChild(groupCollapseButton);
    }
    
    // Add the button group to the node
    nodeElement.appendChild(buttonGroup);
  });
}; 