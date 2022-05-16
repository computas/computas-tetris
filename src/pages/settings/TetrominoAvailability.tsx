import React, { ReactElement } from 'react';

import css from './Settings.module.scss';
import RenderTetromino from './RenderTetromino';
import Slider from '../../components/slider/Slider';
import { TetrominoSetting } from './Settings';

interface TetrominoAvailabilityProps {
  tetromino: TetrominoSetting;
  onChange: (tetromino: TetrominoSetting) => void;
}

const TetrominoAvailability = (
  props: TetrominoAvailabilityProps
): ReactElement => {
  const { onChange, tetromino } = props;

  const sliderChanged = (value: number, name: string): void => {
    const updatedTetromino = {
      ...tetromino,
      [name]: value
    };
    onChange(updatedTetromino);
  };

  return (
    <div
      style={{
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: '670px 200px',
        marginBottom: '1rem'
      }}
    >
      <div>
        <Slider
          label={'Etter antall brikker'}
          min={0}
          max={100}
          name={'count'}
          onChange={sliderChanged}
          value={tetromino.count}
        />
        <Slider
          label={'Etter linjer fjernet'}
          min={0}
          max={100}
          name={'lines'}
          onChange={sliderChanged}
          value={tetromino.lines}
        />
      </div>
      <div className={css.block}>
        <RenderTetromino id={tetromino.id} />
      </div>
    </div>
  );
};

export default TetrominoAvailability;
