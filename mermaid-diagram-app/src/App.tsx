import React, { useState, useRef } from 'react';
import './styles/App.css';
import DiagramRenderer from './components/DiagramRenderer';
import FilterInputs from './components/FilterInputs';
import CameraController from './components/CameraController';
import { sampleGraphData } from './data/graphData';
import { OperationMeta } from './data/types';
import { createStartFilter, createEndFilter, createPassThroughFilter, createGroupCollapseTransformation, createAllConstructive, createAddGroupConstructive, createExampleSource, createRemoteSource, applyOperations } from './data/operations/operationsManager';

function App() {
  const [graphData] = useState(sampleGraphData);
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
      // Add new operation
      const newOperation = createAllConstructive();
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleAddGroupConstructive = (groupId: string) => {
    const existingOperation = operations.find(op => op.id === `add-group-constructive-${groupId}`);
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== `add-group-constructive-${groupId}`));
    } else {
      // Add new operation
      const newOperation = createAddGroupConstructive(groupId);
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleAddExampleSource = () => {
    const existingOperation = operations.find(op => op.id === 'example-source');
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== 'example-source'));
    } else {
      // Add new operation
      const newOperation = createExampleSource();
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const handleAddRemoteSource = () => {
    const existingOperation = operations.find(op => op.id === 'remote-source');
    if (existingOperation) {
      // Remove existing operation
      setOperations(prev => prev.filter(op => op.id !== 'remote-source'));
    } else {
      // Add new operation
      const newOperation = createRemoteSource();
      setOperations(prev => [...prev, newOperation]);
    }
  };

  const removeOperation = (operationId: string) => {
    setOperations(prev => prev.filter(operation => operation.id !== operationId));
  };

  const handleTransformChange = (transform: string) => {
    if (diagramRef.current) {
      const svg = diagramRef.current.querySelector('svg');
      if (svg) {
        svg.style.transform = transform;
        svg.style.transformOrigin = 'center';
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header sr-only">
        <h1>Mermaid Diagram App</h1>
      </header>
      
      <div className="app-container">
        <div className="content-wrapper">
          <FilterInputs 
            operations={operations}
            onRemoveOperation={removeOperation}
            onAddAllConstructive={handleAddAllConstructive}
            onAddGroupConstructive={handleAddGroupConstructive}
            onAddExampleSource={handleAddExampleSource}
            onAddRemoteSource={handleAddRemoteSource}
          />
          
          <div className="mermaid-diagram-wrapper">
            <CameraController 
              containerRef={diagramRef}
              onTransformChange={handleTransformChange}
            />
            <DiagramRenderer
              ref={diagramRef}
              graphData={processedGraph}
              operations={operations}
              onSetStartNode={handleSetStartNode}
              onSetEndNode={handleSetEndNode}
              onSetPassThroughNode={handleSetPassThroughNode}
              onGroupCollapseNode={handleGroupCollapseNode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
