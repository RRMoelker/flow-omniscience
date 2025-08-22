import React, { useState, useRef, useEffect, useMemo } from 'react';
import DiagramRenderer from './components/DiagramRenderer';
import CameraController from './components/CameraController';
import NodeInfoPanel from './components/NodeInfoPanel';
import { 
  InputSection, 
  SourceOperations, 
  ConstructiveOperations, 
  ActiveOperations, 
  DisplayPanel 
} from './components/input';

import { OperationMeta, Node as GraphNode, GroupType } from './types';
import { createStartFilter, createEndFilter, createPassThroughFilter, createGroupCollapseTransformation, createAllConstructive, createExampleSource1, createExampleSource2, createExternalSource, applyOperations, createRemoveNodeTransformation, createFilterConnected, createGrowInTransformation, createGrowOutTransformation } from './data/operations/operationsManager';
import { createEmptyGraph } from './data/graph/emptyGraph';
import groupAdd from './data/operations/add/groupAdd';

function App() {
  // Helper to rehydrate operations from plain objects
  function rehydrateOperation(op: any): OperationMeta | null {
    // Try to match by id prefix
    if (op.id.startsWith('start-filter-')) return createStartFilter(op.id.replace('start-filter-', ''));
    if (op.id.startsWith('end-filter-')) return createEndFilter(op.id.replace('end-filter-', ''));
    if (op.id.startsWith('pass-through-filter-')) return createPassThroughFilter(op.id.replace('pass-through-filter-', ''));
    if (op.id.startsWith('group-collapse-')) return createGroupCollapseTransformation(op.id.replace('group-collapse-', ''));
    if (op.id === 'all-constructive') return createAllConstructive();
    if (op.id.startsWith('add-group-')) return groupAdd(op.id.replace('add-group-', ''));
    if (op.id === 'example-source') return createExampleSource1();
    if (op.id === 'complex-example-source') return createExampleSource2();
    if (op.id === 'external-source') return createExternalSource();
    if (op.id.startsWith('remove-node-')) return createRemoveNodeTransformation(op.id.replace('remove-node-', ''));
    if (op.id.startsWith('filter-connected-')) return createFilterConnected(op.id.replace('filter-connected-', ''));
    if (op.id.startsWith('grow-in-')) return createGrowInTransformation(op.id.replace('grow-in-', ''));
    if (op.id.startsWith('grow-out-')) return createGrowOutTransformation(op.id.replace('grow-out-', ''));
    return null;
  }

  const [emptyGraph] = useState(createEmptyGraph());
  // Load operations from sessionStorage if available
  const [operations, setOperations] = useState<OperationMeta[]>(() => {
    const stored = sessionStorage.getItem('operations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed)
          ? parsed.map(rehydrateOperation).filter(Boolean) as OperationMeta[]
          : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [groupType, setGroupType] = useState<GroupType>('project');
  const diagramRef = useRef<HTMLDivElement>(null);

  // Persist operations to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem('operations', JSON.stringify(operations));
  }, [operations]);

  // Apply operations to get the processed graph
  const [baseGraph, processedGraph] = useMemo(() => {
    return applyOperations(emptyGraph, operations);
  }, [emptyGraph, operations]);

  const handleSetStartNode = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `start-filter-${nodeId}`);
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== `start-filter-${nodeId}`));
    } else {
      // Add new operation
      const newOperation = createStartFilter(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleSetEndNode = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `end-filter-${nodeId}`);
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== `end-filter-${nodeId}`));
    } else {
      // Add new operation
      const newOperation = createEndFilter(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleSetPassThroughNode = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `pass-through-filter-${nodeId}`);
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== `pass-through-filter-${nodeId}`));
    } else {
      // Add new operation
      const newOperation = createPassThroughFilter(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleGroupCollapseNode = (groupId: string) => {
    const existingOperation = operations.find(op => op.id === `group-collapse-${groupId}`);
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== `group-collapse-${groupId}`));
    } else {
      // Add new operation
      const newOperation = createGroupCollapseTransformation(groupId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleAddAllConstructive = () => {
    const existingOperation = operations.find(op => op.id === 'all-constructive');
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== 'all-constructive'));
    } else {
      // Add new operation after sources but before transforms
      const newOperation = createAllConstructive();
      setOperations(prev => {
        const sourceCount = prev.filter(op => op.priority === 0).length;
        return [...prev.slice(0, sourceCount), newOperation, ...prev.slice(sourceCount)];
      });
    }
  };

  const handleAddGroupConstructive = (groupId: string) => {
    const existingOperation = operations.find(op => op.id === `add-group-constructive-${groupId}`);
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== `add-group-constructive-${groupId}`));
    } else {
      // Add new operation after sources but before transforms
      const newOperation = groupAdd(groupId);
      setOperations(prev => {
        const sourceCount = prev.filter(op => op.priority === 0).length;
        return [...prev.slice(0, sourceCount), newOperation, ...prev.slice(sourceCount)];
      });
    }
  };

  const handleAddOperation = (operation: any) => {
    // Add new operation after sources but before transforms
    setOperations(prev => {
      const sourceCount = prev.filter(op => op.priority === 0).length;
      return [...prev.slice(0, sourceCount), operation, ...prev.slice(sourceCount)];
    });
  };

  const handleAddExampleSource1 = () => {
    const existingOperation = operations.find(op => op.id === 'example-source');
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== 'example-source'));
    } else {
      const newOperation = createExampleSource1();
      setOperations(prev => [newOperation, ...prev]);
    }
  };

  const handleAddExampleSource2 = () => {
    const existingOperation = operations.find(op => op.id === 'complex-example-source');
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== 'complex-example-source'));
    } else {
      const filtered = operations.filter(op => op.priority !== 0);
      const newOperation = createExampleSource2();
      setOperations([newOperation, ...filtered]);
    }
  };

  const handleAddExternalSource = () => {
    const existingOperation = operations.find(op => op.id === 'external-source');
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== 'external-source'));
    } else {
      // Add new operation at the beginning (priority 0)
      const newOperation = createExternalSource();
      setOperations(prev => [newOperation, ...prev]);
    }
  };

  const handleRemoveNode = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `remove-node-${nodeId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `remove-node-${nodeId}`));
    } else {
      const newOperation = createRemoveNodeTransformation(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleFilterConnected = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `filter-connected-${nodeId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `filter-connected-${nodeId}`));
    } else {
      const newOperation = createFilterConnected(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleGrowIn = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `grow-in-${nodeId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `grow-in-${nodeId}`));
    } else {
      const newOperation = createGrowInTransformation(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleGrowOut = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `grow-out-${nodeId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `grow-out-${nodeId}`));
    } else {
      const newOperation = createGrowOutTransformation(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const removeOperation = (operationId: string) => {
    setOperations(prev => prev.filter(operation => operation.id !== operationId));
  };

  // Add a handler for node selection
  const handleNodeSelect = (nodeId: string) => {
    const node = processedGraph.nodes.find(n => n.id === nodeId) || null;
    setSelectedNode(node);
  };


  return (
    <div className="App">
      <header className="App-header sr-only">
        <h1 className="sr-only">Mermaid Diagram App</h1>
      </header>
      
      <div className="app-container">
        <div className="operations-bar">
          <InputSection title="Source Operations" className="source-section">
            <SourceOperations 
              onAddExampleSource={handleAddExampleSource1}
              onAddComplexExampleSource={handleAddExampleSource2}
              onAddExternalSource={handleAddExternalSource}
            />
          </InputSection>
          <InputSection title="Constructive Operations" className="constructive-section">
            <ConstructiveOperations 
              onAddAllConstructive={handleAddAllConstructive}
              onAddGroupConstructive={handleAddGroupConstructive}
              onAddOperation={handleAddOperation}
              nodes={baseGraph.nodes}
              groups={baseGraph.groups}
            />
          </InputSection>
          <InputSection title="Display" className="display-section">
            <DisplayPanel groupType={groupType} onGroupTypeChange={setGroupType} />
          </InputSection>
          <InputSection title="Filter Operations" className="filter-section">
            {/* FilterOperations removed */}
            {/* No children for this section now */}
            <></>
          </InputSection>
        </div>
        <div className="active-operations-bar">
          <ActiveOperations 
            operations={operations}
            onRemoveOperation={removeOperation}
            onClearAll={() => setOperations([])}
          />
        </div>
        <div className="main-content">
          <div className="mermaid-diagram-wrapper">
            <CameraController 
              containerRef={diagramRef}
            />
            <DiagramRenderer
              ref={diagramRef}
              graphData={processedGraph}
              groupType={groupType}
              onSetStartNode={handleSetStartNode}
              onSetEndNode={handleSetEndNode}
              onSetPassThroughNode={handleSetPassThroughNode}
              onGroupCollapseNode={handleGroupCollapseNode}
              onNodeSelect={handleNodeSelect}
            />
          </div>
          <NodeInfoPanel 
            className="node-info-panel"
            selectedNode={selectedNode}
            onSetStartNode={handleSetStartNode as (nodeId: string) => void}
            onSetEndNode={handleSetEndNode as (nodeId: string) => void}
            onSetPassThroughNode={handleSetPassThroughNode as (nodeId: string) => void}
            groups={processedGraph.groups}
            onGroupCollapseNode={handleGroupCollapseNode}
            onRemoveNode={handleRemoveNode}
            onFilterConnected={handleFilterConnected}
            onGrowIn={handleGrowIn}
            onGrowOut={handleGrowOut}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
