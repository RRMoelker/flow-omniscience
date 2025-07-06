import React, { useState } from 'react';

interface FilterOperationsProps {
  // This component will handle its own state for now
}

const FilterOperations: React.FC<FilterOperationsProps> = () => {
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [passThroughNode, setPassThroughNode] = useState('');

  return (
    <div className="filter-row">
      <div className="input-group">
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
          className="btn btn-warning"
        >
          ▶️ Add Start
        </button>
      </div>

      <div className="input-group">
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
          className="btn btn-warning"
        >
          ⏹️ Add End
        </button>
      </div>

      <div className="input-group">
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
          className="btn btn-warning"
        >
          🔀 Add Pass-Through
        </button>
      </div>
    </div>
  );
};

export default FilterOperations; 