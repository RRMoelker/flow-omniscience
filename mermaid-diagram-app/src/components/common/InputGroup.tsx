import React from 'react';

interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`input-group-row ${className}`.trim()}>
      {children}
    </div>
  );
};

export default InputGroup; 