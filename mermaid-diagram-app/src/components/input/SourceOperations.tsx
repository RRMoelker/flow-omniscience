import React from 'react';
import Button from '../common/Button';

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
        <Button onClick={onAddExampleSource} variant="source" className="source-btn">
          Ex1
        </Button>
        <Button onClick={onAddComplexExampleSource} variant="source" className="source-btn">
          Ex2
        </Button>
        <Button onClick={onAddExternalSource} variant="source" className="source-btn">
          🌐 Ext
        </Button>
      </div>
    </div>
  );
};

export default SourceOperations; 