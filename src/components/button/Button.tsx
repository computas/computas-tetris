import classnames from 'classnames';
import React, { ReactElement } from 'react';

import css from './Button.module.scss';

export enum ButtonSize {
  Normal = 'normal',
  Large = 'large',
  XL = 'xlarge'
}

export enum ButtonVariant {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary'
}

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = (props: ButtonProps): ReactElement => {
  const { label, onClick, size, variant } = props;

  const cssFromSize = () => {
    if (size === ButtonSize.Large) {
      return css.large;
    } else if (size == ButtonSize.XL) {
      return css.xlarge;
    }
    return css.normal;
  };

  const cssFromVariant = () => {
    switch (variant) {
      case ButtonVariant.Primary:
        return css.primary;

      case ButtonVariant.Secondary:
        return css.secondary;
    }

    return css.default;
  };

  const callback = (): void => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={classnames(css.Button, cssFromSize(), cssFromVariant())}
      onClick={callback}
      type={'button'}
    >
      <span>{label}</span>
    </button>
  );
};

export default Button;
