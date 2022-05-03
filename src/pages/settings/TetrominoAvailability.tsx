import React, { ReactElement } from 'react';
import { TetrominoSetting } from './Settings';

import { ReactComponent as Block0 } from '../../svg/Block.svg';
import { ReactComponent as Block1 } from '../../svg/Block-1.svg';
import { ReactComponent as Block2 } from '../../svg/Block-2.svg';
import { ReactComponent as Block3 } from '../../svg/Block-3.svg';
import { ReactComponent as Block4 } from '../../svg/Block-4.svg';
import { ReactComponent as Block5 } from '../../svg/Block-6.svg';
import { ReactComponent as Block6 } from '../../svg/Block-8.svg';
import Slider from '../../components/slider/Slider';

interface TetrominoAvailabilityProps {
  tetromino: TetrominoSetting;
  onChange: (tetromino: TetrominoSetting) => void;
}

const RenderBlock = (props: { id: string }): ReactElement => {
  const { id } = props;

  switch (id) {
    case 'I':
      return <Block0 height={40} />;
    case 'J':
      return <Block2 width={20} height={40} />;
    case 'L':
      return <Block1 width={20} height={40} />;
    case 'O':
      return <Block5 width={20} height={40} />;
    case 'S':
      return <Block4 width={28} height={40} />;
    case 'T':
      return <Block6 width={28} height={40} />;
    case 'Z':
      return <Block3 width={28} height={40} />;
  }

  return <Block0 />;
};

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
        gridTemplateColumns: '600px 200px',
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
      <div
        style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}
      >
        <RenderBlock id={tetromino.id} />
      </div>
    </div>
  );
};

export default TetrominoAvailability;
