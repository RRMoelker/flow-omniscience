import React from 'react';
import { Node } from '../data/types';

interface NodeInfoPanelProps {
  selectedNode: Node | null;
  onSetStartNode: (nodeId: string) => void;
  onSetEndNode: (nodeId: string) => void;
  onSetPassThroughNode: (nodeId: string) => void;
  groups: { id: string; type: string }[];
  onGroupCollapseNode: (groupId: string) => void;
  onRemoveNode: (nodeId: string) => void;
}

const NodeInfoPanel: React.FC<NodeInfoPanelProps> = ({ selectedNode, onSetStartNode, onSetEndNode, onSetPassThroughNode, groups, onGroupCollapseNode, onRemoveNode }) => {
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
      <h3 className="detail-header">Node Info</h3>
      <div className="node-details">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{selectedNode.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{selectedNode.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Groups:</span>
          <span className="detail-value">
            {selectedNode.groups && selectedNode.groups.length > 0 ? (
              <ul className="group-list">
                {selectedNode.groups.map(groupId => {
                  const group = groups.find(g => g.id === groupId);
                  return (
                    <li key={groupId} className="group-list-item">
                      <span className="group-name">{group ? group.id : groupId}</span>
                      <button
                        className="btn btn-outline-primary btn-xs group-btn"
                        onClick={() => onGroupCollapseNode(groupId)}
                        title={`Collapse group: ${group ? group.id : groupId}`}
                      >
                        🗂️ Collapse
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="no-groups">None</span>
            )}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{selectedNode.type}</span>
        </div>
        <div className="node-filters-section">
          <div className="node-filters-header">Node Filters</div>
          <div className="node-filters-row">
            <button className="btn btn-warning" onClick={() => onSetStartNode(selectedNode.id)}>
              ▶️ Start
            </button>
            <button className="btn btn-warning" onClick={() => onSetEndNode(selectedNode.id)}>
              ⏹️ End
            </button>
            <button className="btn btn-warning" onClick={() => onSetPassThroughNode(selectedNode.id)}>
              🔀 Pass-Through
            </button>
            <button className="btn btn-danger" onClick={() => onRemoveNode(selectedNode.id)}>
             🗑️ Remove Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInfoPanel; 