import React, { useState, useRef } from 'react';
import './styles/App.css';
import DiagramRenderer from './components/DiagramRenderer';
import CameraController from './components/CameraController';
import NodeInfoPanel from './components/NodeInfoPanel';
import { 
  InputWindow, 
  InputSection, 
  SourceOperations, 
  ConstructiveOperations, 
  FilterOperations, 
  ActiveOperations 
} from './components/input';

import { OperationMeta } from './data/types';
import { createStartFilter, createEndFilter, createPassThroughFilter, createGroupCollapseTransformation, createAllConstructive, createAddGroupConstructive, createExampleSource, createRemoteSource, applyOperations } from './data/operations/operationsManager';
import { createEmptyGraph } from './data/graph/emptyGraph';

function App() {
  const [graphData] = useState(createEmptyGraph());
  const [operations, setOperations] = useState<OperationMeta[]>([]);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Apply operations to get the processed graph
  const processedGraph = applyOperations(graphData, operations);

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
      const newOperation = createAddGroupConstructive(groupId);
      setOperations(prev => {
        const sourceCount = prev.filter(op => op.priority === 0).length;
        return [...prev.slice(0, sourceCount), newOperation, ...prev.slice(sourceCount)];
      });
    }
  };

  const handleAddExampleSource = () => {
    const existingOperation = operations.find(op => op.id === 'example-source');
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== 'example-source'));
    } else {
      // Add new operation at the beginning (priority 0)
      const newOperation = createExampleSource();
      setOperations(prev => [newOperation, ...prev]);
    }
  };

  const handleAddRemoteSource = () => {
    const existingOperation = operations.find(op => op.id === 'remote-source');
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== 'remote-source'));
    } else {
      // Add new operation at the beginning (priority 0)
      const newOperation = createRemoteSource();
      setOperations(prev => [newOperation, ...prev]);
    }
  };

  const removeOperation = (operationId: string) => {
    setOperations(prev => prev.filter(operation => operation.id !== operationId));
  };



  return (
    <div className="App">
      <header className="App-header sr-only">
        <h1>Mermaid Diagram App</h1>
      </header>
      
      <div className="app-container">
        <div className="content-wrapper">
          <InputWindow>
            <InputSection title="Source Operations" className="source-section">
              <SourceOperations 
                onAddExampleSource={handleAddExampleSource}
                onAddRemoteSource={handleAddRemoteSource}
              />
            </InputSection>
            
            <InputSection title="Constructive Operations" className="constructive-section">
              <ConstructiveOperations 
                onAddAllConstructive={handleAddAllConstructive}
                onAddGroupConstructive={handleAddGroupConstructive}
              />
            </InputSection>
            
            <InputSection title="Filter Operations" className="filter-section">
              <FilterOperations />
            </InputSection>
          </InputWindow>
          
          <ActiveOperations 
            operations={operations}
            onRemoveOperation={removeOperation}
            onClearAll={() => setOperations([])}
          />
          
          <div className="graph-container">
            <div className="mermaid-diagram-wrapper">
              <CameraController 
                containerRef={diagramRef}
              />
              <DiagramRenderer
                ref={diagramRef}
                graphData={processedGraph}
                onSetStartNode={handleSetStartNode}
                onSetEndNode={handleSetEndNode}
                onSetPassThroughNode={handleSetPassThroughNode}
                onGroupCollapseNode={handleGroupCollapseNode}
              />
            </div>
            <NodeInfoPanel selectedNode={null} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
