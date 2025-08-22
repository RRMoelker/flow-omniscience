import React from 'react';
import { OperationMeta } from '../../types';
import Button from '../common/Button';

interface ActiveOperationsProps {
  operations: OperationMeta[];
  onRemoveOperation: (operationId: string) => void;
  onClearAll: () => void;
}

const ActiveOperations: React.FC<ActiveOperationsProps> = ({ operations, onRemoveOperation, onClearAll }) => {
  const opTypeToVariant = (type: OperationMeta['type']): 'primary' | 'source' | 'constructive' | 'filter' | 'removal' => {
    if (type === 'source') return 'source';
    if (type === 'constructive') return 'constructive';
    if (type === 'filter') return 'filter';
    // Map transforms to primary theme color
    return 'primary';
  };

  return (
    <div className="active-operations-window">
      <div className="active-operations-list-bar">
        <div className="operations-list">
          {operations.length === 0 ? (
            <div className="no-operations">
              <p>No operations applied</p>
            </div>
          ) : (
            operations.map((op) => (
              <Button
                key={op.id}
                variant={opTypeToVariant(op.type)}
                withCross
                title={op.label}
                onClick={() => onRemoveOperation(op.id)}
              >
                {op.label}
              </Button>
            ))
          )}
        </div>
        {operations.length > 0 && (
          <Button variant="removal" className="clear-all-btn" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActiveOperations; 