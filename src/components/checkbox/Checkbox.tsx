import React, { ReactElement, useEffect, useState } from 'react';

import css from './Checkbox.module.scss';
import { ReactComponent as CheckboxChecked } from '../../svg/checkbox-true.svg';
import { ReactComponent as CheckboxUnchecked } from '../../svg/checkbox-false.svg';

interface CheckboxProps {
  checked: boolean;
  name: string;
  onChange?: (checked: boolean, name: string) => void;
}

const Checkbox = (props: CheckboxProps): ReactElement => {
  const { checked, name, onChange } = props;
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
    <div className={css.Checkbox}>
      <div className={css.Input}>
        <input
          type={'checkbox'}
          checked={currentValue}
          onChange={handleChange}
        />
        <span className={css.ShowState}>
          {currentValue ? <CheckboxChecked /> : <CheckboxUnchecked />}
        </span>
      </div>
    </div>
  );
};

export default Checkbox;
