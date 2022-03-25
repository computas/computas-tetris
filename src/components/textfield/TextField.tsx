import React, { ReactElement } from 'react';

import css from './TextField.module.scss';

interface TextFieldProps {
  label: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  value: string;
}

const TextField = (props: TextFieldProps): ReactElement => {
  const { label, onChange, placeholder, value } = props;

  const handleInput = (event: any): void => {
    if (!onChange) {
      return;
    }

    onChange(event.target.value);
  };

  return (
    <div className={css.TextField}>
      <label>{label}</label>
      <input
        type={'text'}
        placeholder={placeholder ?? ''}
        onInput={handleInput}
      />
    </div>
  );
};

export default TextField;
