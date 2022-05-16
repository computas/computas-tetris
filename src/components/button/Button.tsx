import classnames from 'classnames';
import React, { ReactElement } from 'react';

import css from './Button.module.scss';

export enum ButtonSize {
  Normal = 'normal',
  Large = 'large',
  XL = 'xlarge',
  Round = 'round'
}

export enum ButtonVariant {
  Default,
  Primary,
  Secondary,
  White,
  Dark,
  Clear
}

interface ButtonProps {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactElement;
}

const Button = (props: ButtonProps): ReactElement => {
  const { children, disabled, label, onClick, size, variant } = props;

  const cssFromSize = () => {
    switch (size) {
      case ButtonSize.Large:
        return css.large;

      case ButtonSize.Round:
        return css.round;

      case ButtonSize.XL:
        return css.xlarge;

      default:
        return css.normal;
    }
  };

  const cssFromVariant = () => {
    switch (variant) {
      case ButtonVariant.Primary:
        return css.primary;

      case ButtonVariant.Secondary:
        return css.secondary;

      case ButtonVariant.White:
        return css.white;

      case ButtonVariant.Dark:
        return css.dark;

      case ButtonVariant.Clear:
        return css.clear;
    }

    return css.default;
  };

  const callback = (event: any): void => {
    if (onClick) {
      event.stopPropagation();
      onClick();
    }
  };

  return (
    <button
      className={classnames(css.Button, cssFromSize(), cssFromVariant())}
      disabled={disabled}
      onClick={(event) => callback(event)}
      type={'button'}
    >
      <span>{label}</span>
      {children}
    </button>
  );
};

export default Button;
