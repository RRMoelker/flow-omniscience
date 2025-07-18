import { Graph } from '../../data/types';

// Remove all SVG widget buttons from nodes. Only keep hover highlighting if needed.
export const addSvgButtonsToNodes = (
  svgElement: SVGElement,
  onSetStartNode: (nodeId: string) => void,
  onSetEndNode: (nodeId: string) => void,
  onSetPassThroughNode: (nodeId: string) => void,
  onGroupCollapseNode: (groupId: string) => void,
  graphData: Graph
) => {
  // No-op: widget buttons are now removed from the diagram nodes.
}; 