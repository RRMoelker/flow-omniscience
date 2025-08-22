import React from 'react';
import Button from '../common/Button';
import SearchInput, { SearchResult } from '../common/SearchInput';

interface ConstructiveOperationsProps {
  onAddAllConstructive: () => void;
  onAddGroupConstructive: (groupId: string) => void;
  nodes: { id: string; name: string }[];
  groups: { id: string; type: string }[];
  maxResults?: number;
}

const ConstructiveOperations: React.FC<ConstructiveOperationsProps> = ({ 
  onAddAllConstructive, 
  nodes, 
  groups, 
  maxResults = 20 
}) => {
  const handleResultClick = (result: SearchResult) => {
    // TODO: Implement action when search result is clicked
    console.log('Search result clicked:', result);
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