import React from 'react';
import Button from '../common/Button';
import SearchInput, { SearchResult } from '../common/SearchInput';
import nodeAdd from '../../data/operations/add/nodeAdd';
import groupAdd from '../../data/operations/add/groupAdd';

interface ConstructiveOperationsProps {
  onAddAllConstructive: () => void;
  onAddGroupConstructive: (groupId: string) => void;
  onAddOperation: (operation: any) => void;
  nodes: { id: string; name: string }[];
  groups: { id: string; type: string }[];
  maxResults?: number;
}

const ConstructiveOperations: React.FC<ConstructiveOperationsProps> = ({ 
  onAddAllConstructive, 
  onAddGroupConstructive,
  onAddOperation,
  nodes, 
  groups, 
  maxResults = 20 
}) => {
  const handleResultClick = (result: SearchResult) => {
    if (result.kind === 'n') {
      // Add node operation
      const operation = nodeAdd(result.id);
      onAddOperation(operation);
    } else if (result.kind === 'g') {
      // Add group operation
      const operation = groupAdd(result.id);
      onAddOperation(operation);
    }
  };

  return (
    <div className="constructive-row">
      <Button onClick={onAddAllConstructive} variant="add">All Nodes</Button>
      
      <SearchInput
        id="constructiveSearch"
        hideLabel
        placeholder="Search nodes and groups"
        maxResults={maxResults}
        nodes={nodes}
        groups={groups}
        onResultClick={handleResultClick}
      />
    </div>
  );
};

export default ConstructiveOperations; 