import React from 'react';

interface SourceOperationsProps {
  onAddExampleSource: () => void;
  onAddComplexExampleSource: () => void;
  onAddExternalSource: () => void;
}

const SourceOperations: React.FC<SourceOperationsProps> = ({
  onAddExampleSource,
  onAddComplexExampleSource,
  onAddExternalSource
}) => {
  return (
    <div className="source-row">
      <div className="input-group source-btn-group">
        <button 
          onClick={onAddExampleSource}
          className="btn btn-info source-btn"
        >
          Ex1
        </button>
        <button 
          onClick={onAddComplexExampleSource}
          className="btn btn-info source-btn"
        >
          Ex2
        </button>
        <button 
          onClick={onAddExternalSource}
          className="btn btn-info source-btn"
        >
          🌐 External
        </button>
      </div>
    </div>
  );
};

export default SourceOperations; 