import React, { useState } from 'react';
import Button from '../common/Button';
import TextInput from '../common/TextInput';
import InputGroup from '../common/InputGroup';

interface ConstructiveOperationsProps {
  onAddAllConstructive: () => void;
  onAddGroupConstructive: (groupId: string) => void;
}

const ConstructiveOperations: React.FC<ConstructiveOperationsProps> = ({ onAddAllConstructive }) => {
  const [value, setValue] = useState('');

  return (
    <div className="constructive-row">
      <Button onClick={onAddAllConstructive} variant="add">All Nodes</Button>

      <InputGroup>
        <TextInput
          id="genericInput"
          label="Add"
          hideLabel
          placeholder="Enter value"
          value={value}
          onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        />
        <Button variant="add">
          Add
        </Button>
      </InputGroup>
    </div>
  );
};

export default ConstructiveOperations; 