import React from 'react';
import { OperationMeta } from '../../types';

interface ActiveOperationsProps {
  operations: OperationMeta[];
  onRemoveOperation: (operationId: string) => void;
  onClearAll: () => void;
}

const ActiveOperations: React.FC<ActiveOperationsProps> = ({ operations, onRemoveOperation, onClearAll }) => {
  return (
    <div className="active-operations-window">
      <div className="active-operations-header sr-only">
        <h3>Active Operations</h3>
      </div>

      {operations.length === 0 ? (
        <div className="no-operations">
          <p>No operations applied</p>
        </div>
      ) : (
        <div className="active-operations">
          <div className="operations-container">
            <div className="operations-list">
              {operations.map(operation => (
                  <div key={operation.id} className="operation-tag">
                    <span className="operation-label">{operation.label}</span>
                    <button 
                      onClick={() => onRemoveOperation(operation.id)}
                      className="remove-operation-btn"
                      title="Remove operation"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
            <button 
              onClick={onClearAll}
              className="clear-all-btn"
              disabled={operations.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveOperations; 