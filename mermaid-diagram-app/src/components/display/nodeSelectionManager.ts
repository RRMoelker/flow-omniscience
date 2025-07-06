import { Graph, Node } from '../../data/types';

class NodeSelectionManager {
  private container: HTMLDivElement | null = null;
  private graphData: Graph | null = null;
  private onNodeSelect: ((node: Node | null) => void) | null = null;
  private selectedNodeId: string | null = null;

  initialize(container: HTMLDivElement, graphData: Graph, onNodeSelect: (node: Node | null) => void) {
    this.container = container;
    this.graphData = graphData;
    this.onNodeSelect = onNodeSelect;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.container) return;

    // Remove existing listeners
    this.removeEventListeners();

    // Find all node elements
    const nodeElements = this.container.querySelectorAll('.node');
    
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
      const node = this.graphData?.nodes.find(n => n.id === extractedNodeId);
      if (!node) return;
      
      // Add click event listener
      nodeElement.addEventListener('click', (event) => {
        event.stopPropagation();
        this.selectNode(extractedNodeId, node);
      });
    });
    
    // Add click listener to container background to clear selection
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.clearSelection();
      }
    });

    // Restore previous selection if any
    this.restoreSelection();
  }

  private selectNode(nodeId: string, node: Node) {
    if (!this.container) return;

    // Clear previous selection
    this.clearSelection();
    
    // Find and highlight the clicked node
    const nodeElements = this.container.querySelectorAll('.node');
    nodeElements.forEach((nodeElement) => {
      let elementId = nodeElement.id;
      if (!elementId && nodeElement.parentElement) {
        elementId = nodeElement.parentElement.id;
      }
      
      const elementIdMatch = elementId?.match(/flowchart-([A-Z])/);
      const extractedElementId = elementIdMatch ? elementIdMatch[1] : elementId;
      
      if (extractedElementId === nodeId) {
        nodeElement.classList.add('selected-node');
      }
    });
    
    // Store selected node ID
    this.selectedNodeId = nodeId;
    
    // Call the callback
    this.onNodeSelect?.(node);
  }

  private clearSelection() {
    if (!this.container) return;

    this.container.querySelectorAll('.selected-node').forEach(el => {
      el.classList.remove('selected-node');
    });
    
    this.selectedNodeId = null;
    this.onNodeSelect?.(null);
  }

  private restoreSelection() {
    if (!this.selectedNodeId || !this.container) return;

    const nodeElements = this.container.querySelectorAll('.node');
    nodeElements.forEach((nodeElement) => {
      let elementId = nodeElement.id;
      if (!elementId && nodeElement.parentElement) {
        elementId = nodeElement.parentElement.id;
      }
      
      const elementIdMatch = elementId?.match(/flowchart-([A-Z])/);
      const extractedElementId = elementIdMatch ? elementIdMatch[1] : elementId;
      
      if (extractedElementId === this.selectedNodeId) {
        nodeElement.classList.add('selected-node');
      }
    });
  }

  private removeEventListeners() {
    if (!this.container) return;

    // Remove all click listeners by cloning and replacing elements
    const nodeElements = this.container.querySelectorAll('.node');
    nodeElements.forEach((nodeElement) => {
      const newElement = nodeElement.cloneNode(true) as Element;
      nodeElement.parentNode?.replaceChild(newElement, nodeElement);
    });
  }

  updateGraphData(graphData: Graph) {
    this.graphData = graphData;
    if (this.container) {
      this.setupEventListeners();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.container = null;
    this.graphData = null;
    this.onNodeSelect = null;
    this.selectedNodeId = null;
  }
}

export const nodeSelectionManager = new NodeSelectionManager(); 