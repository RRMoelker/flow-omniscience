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

import { OperationMeta, Node as GraphNode, GroupType, Graph } from './types';
import { createEmptyGraph } from './data/graph/emptyGraph';
import startFilter from './data/operations/filter/startFilter';
import endFilter from './data/operations/filter/endFilter';
import passThroughFilter from './data/operations/filter/passThroughFilter';
import groupCollapseTransform from './data/operations/transform/groupCollapseTransform';
import allNodesAdd from './data/operations/add/allNodesAdd';
import groupAdd from './data/operations/add/groupAdd';
import exampleSource1 from './data/operations/source/exampleSource1';
import exampleSource2 from './data/operations/source/exampleSource2';
import externalSource from './data/operations/source/externalSource';
import nodeRemove from './data/operations/remove/nodeRemove';
import connectedFilter from './data/operations/filter/connectedFilter';
import growInAdd from './data/operations/add/growInAdd';
import growOutAdd from './data/operations/add/growOutAdd';
import filterGroup from './data/operations/filter/filterGroup';
import removeGroup from './data/operations/remove/removeGroup';
import { applyOperations } from './data/operations/operationsManager';

function App() {
  // Helper to rehydrate operations from plain objects
  function rehydrateOperation(op: any): OperationMeta | null {
    // Try to match by id prefix
    if (op.id.startsWith('start-filter-')) return startFilter(op.id.replace('start-filter-', ''));
    if (op.id.startsWith('end-filter-')) return endFilter(op.id.replace('end-filter-', ''));
    if (op.id.startsWith('pass-through-filter-')) return passThroughFilter(op.id.replace('pass-through-filter-', ''));
    if (op.id.startsWith('group-collapse-')) return groupCollapseTransform(op.id.replace('group-collapse-', ''));
    if (op.id === 'all-nodes') return allNodesAdd();
    if (op.id.startsWith('add-group-')) return groupAdd(op.id.replace('add-group-', ''));
    if (op.id === 'example-source') return exampleSource1();
    if (op.id === 'complex-example-source') return exampleSource2();
    if (op.id === 'external-source') return externalSource();
    if (op.id.startsWith('remove-node-')) return nodeRemove(op.id.replace('remove-node-', ''));
    if (op.id.startsWith('filter-connected-')) return connectedFilter(op.id.replace('filter-connected-', ''));
    if (op.id.startsWith('grow-in-')) return growInAdd(op.id.replace('grow-in-', ''));
    if (op.id.startsWith('grow-out-')) return growOutAdd(op.id.replace('grow-out-', ''));
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
  const [processedGraph, setProcessedGraph] = useState<Graph>(createEmptyGraph());
  const [baseGraph, setBaseGraph] = useState<Graph>(createEmptyGraph());
  const diagramRef = useRef<HTMLDivElement>(null);

  // Persist operations to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem('operations', JSON.stringify(operations));
  }, [operations]);

  // Apply operations when they change
  useEffect(() => {
    const processOperations = async () => {
      try {
        const [processed, base] = await applyOperations(emptyGraph, operations);
        setProcessedGraph(processed);
        setBaseGraph(base);
      } catch (error) {
        console.error('Error applying operations:', error);
        setProcessedGraph(createEmptyGraph());
        setBaseGraph(createEmptyGraph());
      }
    };

    if (operations.length > 0) {
      processOperations();
    } else {
      setProcessedGraph(createEmptyGraph());
      setBaseGraph(createEmptyGraph());
    }
  }, [operations, emptyGraph]);

  const handleSetStartNode = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `start-filter-${nodeId}`);
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== `start-filter-${nodeId}`));
    } else {
      // Add new operation
      const newOperation = startFilter(nodeId);
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
      const newOperation = endFilter(nodeId);
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
      const newOperation = passThroughFilter(nodeId);
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
      const newOperation = groupCollapseTransform(groupId);
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
      const newOperation = allNodesAdd();
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
      const newOperation = exampleSource1();
      setOperations(prev => [newOperation, ...prev]);
    }
  };

  const handleAddExampleSource2 = () => {
    const existingOperation = operations.find(op => op.id === 'complex-example-source');
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== 'complex-example-source'));
    } else {
      const filtered = operations.filter(op => op.priority !== 0);
      const newOperation = exampleSource2();
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
      const newOperation = externalSource();
      setOperations(prev => [newOperation, ...prev]);
    }
  };

  const handleRemoveNode = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `remove-node-${nodeId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `remove-node-${nodeId}`));
    } else {
      const newOperation = nodeRemove(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleFilterConnected = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `filter-connected-${nodeId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `filter-connected-${nodeId}`));
    } else {
      const newOperation = connectedFilter(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleGrowIn = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `grow-in-${nodeId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `grow-in-${nodeId}`));
    } else {
      const newOperation = growInAdd(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleGrowOut = (nodeId: string) => {
    const existingOperation = operations.find(op => op.id === `grow-out-${nodeId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `grow-out-${nodeId}`));
    } else {
      const newOperation = growOutAdd(nodeId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleAddGroup = (groupId: string) => {
    const existingOperation = operations.find(op => op.id === `add-group-${groupId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `add-group-${groupId}`));
    } else {
      const newOperation = groupAdd(groupId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleFilterGroup = (groupId: string) => {
    const existingOperation = operations.find(op => op.id === `filter-group-${groupId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `filter-group-${groupId}`));
    } else {
      const newOperation = filterGroup(groupId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleRemoveGroup = (groupId: string) => {
    const existingOperation = operations.find(op => op.id === `remove-group-${groupId}`);
    if (existingOperation) {
      setOperations(prev => prev.filter(op => op.id !== `remove-group-${groupId}`));
    } else {
      const newOperation = removeGroup(groupId);
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
            onAddGroup={handleAddGroup}
            onFilterGroup={handleFilterGroup}
            onRemoveGroup={handleRemoveGroup}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
