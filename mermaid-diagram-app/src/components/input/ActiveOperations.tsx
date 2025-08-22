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
      <div className="active-operations-list-bar">
        <div className="operations-list">
          {operations.length === 0 ? (
            <div className="no-operations">
              <p>No operations applied</p>
            </div>
          ) : (
            operations.map((op) => (
              <span
                key={op.id}
                className={`operation-tag ${op.type}`}
                title={op.label}
              >
                <span className="operation-label">{op.label}</span>
                <button
                  className="remove-operation-btn"
                  onClick={() => onRemoveOperation(op.id)}
                  title="Remove operation"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        {operations.length > 0 && (
          <button className="btn btn-removal clear-all-btn" onClick={onClearAll}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveOperations; 