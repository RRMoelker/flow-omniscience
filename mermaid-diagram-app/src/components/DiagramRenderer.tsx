import React, { useEffect, useRef, forwardRef } from 'react';
import mermaid from 'mermaid';
import { Graph, OperationMeta, Node } from '../data/types';
import { convertToMermaid } from '../data/mermaidConverter';
import { addSvgButtonsToNodes } from './display/svgButtonRenderer';
import { addHoverHighlighting } from './display/hoverHighlighter';

interface DiagramRendererProps {
  graphData: Graph;
  onSetStartNode: (nodeId: string) => void;
  onSetEndNode: (nodeId: string) => void;
  onSetPassThroughNode: (nodeId: string) => void;
  onGroupCollapseNode: (groupId: string) => void;
  onNodeSelect: (node: Node | null) => void;
}

const DiagramRenderer = forwardRef<HTMLDivElement, DiagramRendererProps>(
  ({ 
    graphData, 
    onSetStartNode, 
    onSetEndNode, 
    onSetPassThroughNode,
    onGroupCollapseNode,
    onNodeSelect
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Simple node selection function
    const addSimpleNodeSelection = (container: HTMLDivElement, graphData: Graph, onNodeSelect: (node: Node | null) => void) => {
      // Find all node elements
      const nodeElements = container.querySelectorAll('.node');
      
      nodeElements.forEach((nodeElement) => {
        // Get the node ID from the element's ID or parent's ID
        let nodeId = nodeElement.id;
        if (!nodeId && nodeElement.parentElement) {
          nodeId = nodeElement.parentElement.id;
        }
        
        // Extract node ID from flowchart ID (e.g., "flowchart-A" -> "A")
        const nodeIdMatch = nodeId?.match(/flowchart-([A-Z])/);
        const extractedNodeId = nodeIdMatch ? nodeIdMatch[1] : nodeId;
        
        if (!extractedNodeId) return;
        
        // Find the corresponding node data
        const node = graphData.nodes.find(n => n.id === extractedNodeId);
        if (!node) return;
        
        // Add click event listener
        nodeElement.addEventListener('click', (event) => {
          event.stopPropagation();
          
          // Clear previous selection
          container.querySelectorAll('.selected-node').forEach(el => {
            el.classList.remove('selected-node');
          });
          
          // Add selection class to clicked node
          nodeElement.classList.add('selected-node');
          
          // Call the callback with the selected node
          onNodeSelect(node);
        });
      });
      
      // Add click listener to container background to clear selection
      container.addEventListener('click', (event) => {
        if (event.target === container) {
          container.querySelectorAll('.selected-node').forEach(el => {
            el.classList.remove('selected-node');
          });
          onNodeSelect(null);
        }
      });
    };

    useEffect(() => {
      const renderDiagram = async () => {
        if (!containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        try {
          // Initialize Mermaid
          mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            flowchart: {
              nodeSpacing: 80,
              rankSpacing: 80,
              curve: 'basis',
              useMaxWidth: true,
              htmlLabels: true,
              padding: 20,
              diagramPadding: 30
            },
            fontFamily: 'Arial, sans-serif',
            fontSize: 14,
            logLevel: 1
          });

          // Convert graph data to Mermaid syntax
          const mermaidCode = convertToMermaid(graphData);
          console.log('Generated Mermaid code:', mermaidCode);

          // Create a unique ID for this diagram
          const diagramId = `mermaid-diagram-${Date.now()}`;

          // Render the diagram using mermaid.render()
          const { svg } = await mermaid.render(diagramId, mermaidCode);
          
          // Insert the SVG into the container
          containerRef.current.innerHTML = svg;

          // Add SVG buttons to nodes
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            addSvgButtonsToNodes(
              svgElement,
              onSetStartNode,
              onSetEndNode,
              onSetPassThroughNode,
              onGroupCollapseNode,
              graphData
            );
            
            // Add hover highlighting
            addHoverHighlighting(svgElement, graphData);
            
            // Add simple node selection
            addSimpleNodeSelection(containerRef.current, graphData, onNodeSelect);
          }
        } catch (error) {
          console.error('Error rendering diagram:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = '<p>Error rendering diagram</p>';
          }
        }
      };

      renderDiagram();
    }, [graphData, onSetStartNode, onSetEndNode, onSetPassThroughNode, onGroupCollapseNode, onNodeSelect]);

    return (
      <div 
        ref={(el) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
          containerRef.current = el;
        }}
        className="mermaid-diagram-container"
        style={{ 
          width: '100%', 
          height: '600px', 
          border: '1px solid #ccc',
          overflow: 'auto'
        }}
      />
    );
  }
);

DiagramRenderer.displayName = 'DiagramRenderer';

export default DiagramRenderer; 