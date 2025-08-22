import React, { useState } from 'react';

interface ConstructiveOperationsProps {
  onAddAllConstructive: () => void;
  onAddGroupConstructive: (groupId: string) => void;
}

const ConstructiveOperations: React.FC<ConstructiveOperationsProps> = ({ onAddAllConstructive, onAddGroupConstructive }) => {
  const [groupNode, setGroupNode] = useState('');

  return (
    <div className="constructive-row">
      <button 
        onClick={onAddAllConstructive}
        className="btn btn-constructive"
      >
        🌐 Add All Nodes
      </button>
      
      <div className="input-group">
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
          className="btn btn-constructive"
        >
          📦 Add Group
        </button>
      </div>
    </div>
  );
};

export default ConstructiveOperations; 