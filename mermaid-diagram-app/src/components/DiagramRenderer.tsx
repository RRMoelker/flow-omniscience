import React, { useEffect, useRef, forwardRef } from 'react';
import mermaid from 'mermaid';
import { Graph } from '../data/types';
import { convertToMermaid } from '../data/mermaidConverter';
import { addSvgButtonsToNodes } from './display/svgButtonRenderer';
import { addHoverHighlighting } from './display/hoverHighlighter';

interface DiagramRendererProps {
  graphData: Graph;
  groupType: string;
  onSetStartNode: (nodeId: string) => void;
  onSetEndNode: (nodeId: string) => void;
  onSetPassThroughNode: (nodeId: string) => void;
  onGroupCollapseNode: (groupId: string) => void;
  onNodeSelect?: (nodeId: string) => void;
}

const DiagramRenderer = forwardRef<HTMLDivElement, DiagramRendererProps>(
  ({ 
    graphData, 
    groupType,
    onSetStartNode, 
    onSetEndNode, 
    onSetPassThroughNode,
    onGroupCollapseNode,
    onNodeSelect
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const renderDiagram = async () => {
        if (!containerRef.current) return;

        // Save current transform if present
        let prevTransform = '';
        const prevSvg = containerRef.current.querySelector('svg');
        if (prevSvg && prevSvg.style.transform) {
          prevTransform = prevSvg.style.transform;
        }

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
          const mermaidCode = convertToMermaid(graphData, groupType);
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
            // Restore previous transform if present
            if (prevTransform) {
              svgElement.style.transform = prevTransform;
              svgElement.style.transformOrigin = 'center';
            }
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

            // Add click event for node selection
            if (typeof onNodeSelect === 'function') {
              const nodeGroups = svgElement.querySelectorAll('g.node');
              nodeGroups.forEach((nodeGroup) => {
                nodeGroup.addEventListener('click', (e) => {
                  // Prevent button clicks from triggering node select
                  if ((e.target as Element).closest('.svg-button')) return;
                  e.stopPropagation();
                  const nodeId = nodeGroup.getAttribute('id')?.split('-')[1];
                  if (nodeId) onNodeSelect(nodeId);
                });
              });
            }
          }
        } catch (error) {
          console.error('Error rendering diagram:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = '<p>Error rendering diagram</p>';
          }
        }
      };

      renderDiagram();
    }, [graphData, onSetStartNode, onSetEndNode, onSetPassThroughNode, onGroupCollapseNode]);

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