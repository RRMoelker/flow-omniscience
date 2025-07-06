import React, { useState } from 'react';
import { OperationMeta } from '../data/types';

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
  const [showProjects, setShowProjects] = useState(true);
  const [showSystem, setShowSystem] = useState(true);

  const clearAllOperations = () => {
    // Clear the input fields
    setStartNode('');
    setEndNode('');
    setPassThroughNode('');
    setGroupNode('');
  };

  return (
    <div className="filter-inputs">
      <div className="show-section">
        <h3>Show:</h3>
        <div className="show-options">
          <div className="show-option">
            <input 
              type="checkbox" 
              id="showProjects" 
              disabled={true}
              checked={showProjects}
              onChange={(e) => setShowProjects(e.target.checked)}
            />
            <label htmlFor="showProjects">Show Projects</label>
          </div>
          <div className="show-option">
            <input 
              type="checkbox" 
              id="showSystem" 
              disabled={true}
              checked={showSystem}
              onChange={(e) => setShowSystem(e.target.checked)}
            />
            <label htmlFor="showSystem">Show System</label>
          </div>
        </div>
      </div>
      
      <div className="filter-header">
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

        {/* Source Operations */}
        <div className="source-section">
          <h3>Source Operations:</h3>
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
        </div>

        {/* Constructive Operations */}
        <div className="constructive-section">
          <h3>Constructive Operations:</h3>
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
        </div>
        
        <button 
          onClick={clearAllOperations}
          className="clear-filters-btn"
          disabled={operations.length === 0}
        >
          Clear
        </button>
      </div>

      <div className="active-operations">
        <h3>Active Operations:</h3>
        <div className="operations-list">
          {operations.length === 0 ? (
            <div className="no-operations">
              <p>No operations applied</p>
            </div>
          ) : (
            <>
              {/* Show operations sorted by priority */}
              {operations
                .sort((a, b) => a.priority - b.priority)
                .map(operation => (
                  <div key={operation.id} className="operation-tag">
                    <span className="operation-icon">
                      {operation.priority === 100 ? '🛠️' : '🔍'}
                    </span>
                    <span className="operation-label">{operation.label}</span>
                    <button 
                      onClick={() => onRemoveOperation(operation.id)}
                      className="remove-operation-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterInputs; 