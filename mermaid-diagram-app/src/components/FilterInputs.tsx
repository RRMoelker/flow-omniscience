import React, { useState } from 'react';
import { OperationMeta } from '../data/types';
import InputWindow, { InputSection } from './InputWindow';

interface FilterInputsProps {
  operations: OperationMeta[];
  onRemoveOperation: (operationId: string) => void;
  onAddAllConstructive: () => void;
  onAddGroupConstructive: (groupId: string) => void;
  onAddExampleSource: () => void;
  onAddRemoteSource: () => void;
}

const FilterInputs: React.FC<FilterInputsProps> = ({
  operations,
  onRemoveOperation,
  onAddAllConstructive,
  onAddGroupConstructive,
  onAddExampleSource,
  onAddRemoteSource
}) => {
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [passThroughNode, setPassThroughNode] = useState('');
  const [groupNode, setGroupNode] = useState('');

  const clearAllOperations = () => {
    setStartNode('');
    setEndNode('');
    setPassThroughNode('');
    setGroupNode('');
  };

  return (
    <InputWindow>
      <InputSection title="Active Operations" className="operations-section">
        <div className="operations-header">
          <button 
            onClick={clearAllOperations}
            className="clear-all-btn"
            disabled={operations.length === 0}
          >
            Clear All
          </button>
        </div>

        {operations.length === 0 ? (
          <div className="no-operations">
            <p>No operations applied</p>
          </div>
        ) : (
          <div className="active-operations">
            <div className="operations-list">
              {operations.map(operation => (
                <div key={operation.id} className="operation-tag">
                  <span className="operation-label">{operation.label}</span>
                  <button 
                    onClick={() => onRemoveOperation(operation.id)}
                    className="remove-operation-btn"
                    title="Remove operation"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </InputSection>

      <InputSection title="Source Operations" className="source-section">
        <div className="source-row">
          <button 
            onClick={onAddExampleSource}
            className="add-source-btn"
          >
            📊 Example Source
          </button>
          
          <button 
            onClick={onAddRemoteSource}
            className="add-source-btn"
          >
            🌐 Remote Source
          </button>
        </div>
      </InputSection>

      <InputSection title="Constructive Operations" className="constructive-section">
        <div className="constructive-row">
          <button 
            onClick={onAddAllConstructive}
            className="add-constructive-btn"
          >
            🌐 Add All Nodes
          </button>
          
          <div className="constructive-input-group">
            <label htmlFor="groupNode" className="sr-only">Group:</label>
            <input 
              type="text" 
              id="groupNode" 
              value={groupNode}
              onChange={(e) => setGroupNode(e.target.value)}
              placeholder="Enter group name" 
            />
            <button 
              onClick={() => {
                if (groupNode.trim()) {
                  onAddGroupConstructive(groupNode.trim());
                  setGroupNode('');
                }
              }}
              disabled={!groupNode.trim()}
              className="add-constructive-btn"
            >
              📦 Add Group
            </button>
          </div>
        </div>
      </InputSection>

      <InputSection title="Filter Operations" className="filter-section">
        <div className="filter-row">
          <div className="filter-input-group">
            <label htmlFor="startNode" className="sr-only">Start Node:</label>
            <input 
              type="text" 
              id="startNode" 
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              placeholder="Enter start node ID" 
            />
            <button 
              onClick={() => {
                if (startNode.trim()) {
                  setStartNode('');
                }
              }}
              disabled={!startNode.trim()}
              className="add-filter-btn"
            >
              ▶️ Add Start
            </button>
          </div>

          <div className="filter-input-group">
            <label htmlFor="endNode" className="sr-only">End Node:</label>
            <input 
              type="text" 
              id="endNode" 
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
              placeholder="Enter end node ID" 
            />
            <button 
              onClick={() => {
                if (endNode.trim()) {
                  setEndNode('');
                }
              }}
              disabled={!endNode.trim()}
              className="add-filter-btn"
            >
              ⏹️ Add End
            </button>
          </div>

          <div className="filter-input-group">
            <label htmlFor="passThroughNode" className="sr-only">Pass-Through Node:</label>
            <input 
              type="text" 
              id="passThroughNode" 
              value={passThroughNode}
              onChange={(e) => setPassThroughNode(e.target.value)}
              placeholder="Enter pass-through node ID" 
            />
            <button 
              onClick={() => {
                if (passThroughNode.trim()) {
                  setPassThroughNode('');
                }
              }}
              disabled={!passThroughNode.trim()}
              className="add-filter-btn"
            >
              🔀 Add Pass-Through
            </button>
          </div>
        </div>
      </InputSection>
    </InputWindow>
  );
};

export default FilterInputs; 