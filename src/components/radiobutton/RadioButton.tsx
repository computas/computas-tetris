import React, { ReactElement, useEffect, useState } from 'react';

import css from './RadioButton.module.scss';

interface RadioButtonProps {
  checked: boolean;
  help?: string;
  label: string;
  name: string;
  onChange?: (checked: boolean, name: string) => void;
}

const RadioButton = (props: RadioButtonProps): ReactElement => {
  const { checked, help, label, name, onChange } = props;
  const [currentValue, setCurrentValue] = useState(false);

  useEffect(() => {
    setCurrentValue(checked);
  }, []);

  useEffect(() => {
    if (checked === currentValue) {
      return;
    }

    setCurrentValue(checked);
  }, [checked]);

  const handleChange = (): void => {
    setCurrentValue(!currentValue);
    if (!onChange) {
      return;
    }

    onChange(!currentValue, name);
  };

  return (
    <div className={css.RadioButton}>
      <label>
        <span>{label}</span>
        <em>{help}</em>
      </label>
      <input type={'checkbox'} checked={currentValue} onChange={handleChange} />
    </div>
  );
};

export default RadioButton;
