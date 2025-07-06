import React from 'react';

interface SourceOperationsProps {
  onAddExampleSource: () => void;
  onAddExternalSource: () => void;
}

const SourceOperations: React.FC<SourceOperationsProps> = ({
  onAddExampleSource,
  onAddExternalSource
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
          onClick={onAddExternalSource}
          className="btn btn-info"
        >
          🌐 Add External
        </button>
      </div>
    </div>
  );
};

export default SourceOperations; 