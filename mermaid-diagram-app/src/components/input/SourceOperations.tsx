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
      <div className="input-group">
        <button 
          onClick={onAddExampleSource}
          className="btn btn-info"
        >
          📊 Add Example
        </button>
      </div>
      
      <div className="input-group">
        <button 
          onClick={onAddRemoteSource}
          className="btn btn-info"
        >
          🌐 Add External
        </button>
      </div>
    </div>
  );
};

export default SourceOperations; 