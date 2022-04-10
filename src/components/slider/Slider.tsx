import React, { ReactElement, useEffect, useState } from 'react';

import css from './Slider.module.scss';

interface SliderProps {
  help?: string;
  label: string;
  max: number;
  min: number;
  name: string;
  onChange?: (value: number, name: string) => void;
  value: number;
}

const Slider = (props: SliderProps): ReactElement => {
  const { help, label, max, min, name, onChange, value } = props;
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    setCurrentValue(value);
  }, []);

  useEffect(() => {
    if (value === currentValue) {
      return;
    }

    setCurrentValue(value);
  }, [value]);

  const handleSliderChange = (value: number): void => {
    setCurrentValue(value);
  };

  const onRelease = (): void => {
    if (!onChange) {
      return;
    }
    onChange(currentValue, name);
  };

  return (
    <div className={css.Slider}>
      <label>
        <span>{label}</span>
        <em>{help}</em>
      </label>
      <input
        type={'range'}
        min={min}
        max={max}
        value={currentValue}
        onChange={(event) => handleSliderChange(Number(event.target.value))}
        onTouchEnd={onRelease}
        onMouseUp={onRelease}
      />
      <span>{currentValue}</span>
    </div>
  );
};

export default Slider;
