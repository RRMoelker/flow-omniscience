import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  hideLabel?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ id, label, hideLabel = false, className = '', ...rest }) => {
  return (
    <div className={`text-input ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className={hideLabel ? 'sr-only' : ''}>{label}</label>
      )}
      <input id={id} type="text" {...rest} />
    </div>
  );
};

export default TextInput; 