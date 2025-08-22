import React, { useState } from 'react';
import Button from '../common/Button';

interface ConstructiveOperationsProps {
  onAddAllConstructive: () => void;
  onAddGroupConstructive: (groupId: string) => void;
}

const ConstructiveOperations: React.FC<ConstructiveOperationsProps> = ({ onAddAllConstructive, onAddGroupConstructive }) => {
  const [groupNode, setGroupNode] = useState('');

  return (
    <div className="constructive-row">
      <Button onClick={onAddAllConstructive} variant="constructive">
        🌐 Add All Nodes
      </Button>
      
      <div className="input-group">
        <label htmlFor="groupNode" className="sr-only">Group:</label>
        <input 
          type="text" 
          id="groupNode" 
          value={groupNode}
          onChange={(e) => setGroupNode(e.target.value)}
          placeholder="Enter group name" 
        />
        <Button
          onClick={() => {
            if (groupNode.trim()) {
              onAddGroupConstructive(groupNode.trim());
              setGroupNode('');
            }
          }}
          disabled={!groupNode.trim()}
          variant="constructive"
        >
          📦 Add Group
        </Button>
      </div>
    </div>
  );
};

export default ConstructiveOperations; 