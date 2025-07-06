import React from 'react';

interface InputWindowProps {
  children: React.ReactNode;
}

interface InputSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const InputSection: React.FC<InputSectionProps> = ({ title, children, className = '' }) => (
  <div className={`input-section ${className}`}>
    <h3>{title}</h3>
    <div className="input-content">
      {children}
    </div>
  </div>
);

const InputWindow: React.FC<InputWindowProps> = ({ children }) => {
  return (
    <div className="input-window">
      <div className="input-window-content">
        {children}
      </div>
    </div>
  );
};

export default InputWindow;
export { InputSection }; 