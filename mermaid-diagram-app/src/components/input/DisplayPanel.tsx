import React from 'react';
import { GROUP_TYPES, GroupType } from '../../data/types';

interface DisplayPanelProps {
  groupType: GroupType;
  onGroupTypeChange: (type: GroupType) => void;
}

const DisplayPanel: React.FC<DisplayPanelProps> = ({ groupType, onGroupTypeChange }) => {
  return (
    <div className="display-panel">
      <label htmlFor="group-type-select" style={{ fontWeight: 600, marginRight: 8 }}>Group Type:</label>
      <select
        id="group-type-select"
        value={groupType}
        onChange={e => onGroupTypeChange(e.target.value as GroupType)}
        style={{ padding: '4px 8px', fontSize: 15 }}
      >
        {GROUP_TYPES.map(type => (
          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
        ))}
      </select>
    </div>
  );
};

export default DisplayPanel; 