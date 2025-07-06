import React from 'react';

interface SourceOperationsProps {
  onAddExampleSource: () => void;
  onAddRemoteSource: () => void;
}

const SourceOperations: React.FC<SourceOperationsProps> = ({
  onAddExampleSource,
  onAddRemoteSource
}) => {
  return (
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
  );
};

export default SourceOperations; 