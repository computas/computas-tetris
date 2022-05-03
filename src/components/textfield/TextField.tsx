import classNames from 'classnames';
import React, { ReactElement } from 'react';

import css from './TextField.module.scss';

interface TextFieldProps {
  errorMessage?: string;
  fieldType?: string;
  id?: string;
  label: string;
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  value: string;
}

const TextField = (props: TextFieldProps): ReactElement => {
  const {
    errorMessage,
    fieldType,
    id,
    label,
    onBlur,
    onChange,
    placeholder,
    value
  } = props;

  const getFieldType = (): string => {
    return fieldType ? fieldType : 'text';
  };

  const handleBlur = (event: any): void => {
    if (!onBlur) {
      return;
    }

    onBlur(event.target.value);
  };

  const handleInput = (event: any): void => {
    if (!onChange) {
      return;
    }

    onChange(event.target.value);
  };

  return (
    <div className={classNames(css.TextField, errorMessage ? css.error : null)}>
      <label>{label}</label>
      <input
        defaultValue={value}
        onBlur={handleBlur}
        onInput={handleInput}
        name={id}
        placeholder={placeholder ?? ''}
        type={getFieldType()}
      />
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  );
};

export default TextField;
