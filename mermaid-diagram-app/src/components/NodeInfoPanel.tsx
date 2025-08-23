import React from 'react';
import { Node } from '../types';
import Button from './common/Button';

interface NodeInfoPanelProps {
  selectedNode: Node | null;
  onSetStartNode: (nodeId: string) => void;
  onSetEndNode: (nodeId: string) => void;
  onSetPassThroughNode: (nodeId: string) => void;
  groups: { id: string; type: string }[];
  onGroupCollapseNode: (groupId: string) => void;
  onRemoveNode: (nodeId: string) => void;
  onFilterConnected: (nodeId: string) => void;
  onGrowIn: (nodeId: string) => void;
  onGrowOut: (nodeId: string) => void;
  onAddGroup: (groupId: string) => void;
  onFilterGroup: (groupId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  className?: string;
}

const NodeInfoPanel: React.FC<NodeInfoPanelProps> = ({ selectedNode, onSetStartNode, onSetEndNode, onSetPassThroughNode, groups, onGroupCollapseNode, onRemoveNode, onFilterConnected, onGrowIn, onGrowOut, onAddGroup, onFilterGroup, onRemoveGroup, className }) => {
  if (!selectedNode) {
    return (
      <div className="node-info-panel">
        <h3>Node Info</h3>
        <p className="no-selection">No node selected</p>
      </div>
    );
  }

  // Fallback: always enable if we can't check
  return (
    <div className={className ? className + ' node-info-panel' : 'node-info-panel'}>
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
                      <Button
                        className="group-btn"
                        onClick={() => onGroupCollapseNode(groupId)}
                        title={`Collapse group: ${group ? group.id : groupId}`}
                        variant="transform"
                      >
                        🗂️ Collapse
                      </Button>
                      <Button
                        className="group-btn"
                        onClick={() => onAddGroup(groupId)}
                        title={`Add group: ${group ? group.id : groupId}`}
                        variant="add"
                      >
                        ➕ Add
                      </Button>
                      <Button
                        className="group-btn"
                        onClick={() => onFilterGroup(groupId)}
                        title={`Filter group: ${group ? group.id : groupId}`}
                        variant="filter"
                      >
                        🔍 Filter
                      </Button>
                      <Button
                        className="group-btn"
                        onClick={() => onRemoveGroup(groupId)}
                        title={`Remove group: ${group ? group.id : groupId}`}
                        variant="remove"
                      >
                        🗑️ Remove
                      </Button>
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
            <Button variant="filter" onClick={() => onSetStartNode(selectedNode.id)}>▶️ Start</Button>
            <Button variant="filter" onClick={() => onSetEndNode(selectedNode.id)}>⏹️ End</Button>
            <Button variant="filter" onClick={() => onSetPassThroughNode(selectedNode.id)}>🔀 Pass-Through</Button>
            <Button variant="filter" onClick={() => onFilterConnected(selectedNode.id)}>🔗 Filter Connected</Button>
            <Button variant="add" onClick={() => onGrowIn(selectedNode.id)}>⬅️ Grow In</Button>
            <Button variant="add" onClick={() => onGrowOut(selectedNode.id)}>➡️ Grow Out</Button>
            <Button variant="remove" onClick={() => onRemoveNode(selectedNode.id)}>🗑️ Remove Node</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInfoPanel; 