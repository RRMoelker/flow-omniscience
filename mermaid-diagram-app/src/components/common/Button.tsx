import React from 'react';

type ButtonVariant = 'primary' | 'source' | 'add' | 'filter' | 'remove' | 'transform';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  withCross?: boolean;
}

const variantToClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  //
  source: 'btn-source',
  add: 'btn-add',
  filter: 'btn-filter',
  remove: 'btn-remove',
  transform: 'btn-transform'
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', withCross = false, className = '', children, ...rest }) => {
  const classes = ['btn', variantToClass[variant]];
  if (withCross) classes.push('btn-with-cross');
  if (className) classes.push(className);

  return (
    <button className={classes.join(' ')} {...rest}>
      {children}
    </button>
  );
};

export default Button; 