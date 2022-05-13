import React, { ReactElement, useEffect, useState } from 'react';

import css from './Slider.module.scss';

interface SliderProps {
  help?: string;
  label: string;
  max: number;
  min: number;
  name: string;
  onChange?: (value: number, name: string) => void;
  step?: number;
  value: number;
}

const Slider = ({
  help,
  label,
  max,
  min,
  name,
  onChange,
  step = 1,
  value
}: SliderProps): ReactElement => {
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
        step={step}
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
