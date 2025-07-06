import React from 'react';
import { Node } from '../data/types';

interface NodeInfoPanelProps {
  selectedNode: Node | null;
}

const NodeInfoPanel: React.FC<NodeInfoPanelProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div className="node-info-panel">
        <h3>Node Info</h3>
        <p className="no-selection">No node selected</p>
      </div>
    );
  }

  return (
    <div className="node-info-panel">
      <h3>Node Info</h3>
      <div className="node-details">
        <div className="detail-row">
          <strong>ID:</strong> <span>{selectedNode.id}</span>
        </div>
        <div className="detail-row">
          <strong>Name:</strong> <span>{selectedNode.name}</span>
        </div>
        {selectedNode.group && (
          <div className="detail-row">
            <strong>Group:</strong> <span>{selectedNode.group}</span>
          </div>
        )}
        <div className="detail-row">
          <strong>Type:</strong> <span>{selectedNode.type}</span>
        </div>
      </div>
    </div>
  );
};

export default NodeInfoPanel; 