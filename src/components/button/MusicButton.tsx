import React, { ReactElement, useContext } from 'react';

import css from './Button.module.scss';
import Button, { ButtonSize, ButtonVariant } from './Button';
import { ReactComponent as MusicOn } from '../../svg/volume.svg';
import { GameSettingsStateActionType } from '../../enums/GameSettingsStateActionTypes';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';

const MusicButton = (): ReactElement => {
  const { settingsDispatch } = useContext(GameSettingsContext);

  const toggleMusic = (): void => {
    settingsDispatch({ type: GameSettingsStateActionType.ToggleMusic });
  };

  return (
    <div className={css.MusicButton}>
      <Button
        label={''}
        size={ButtonSize.Round}
        variant={ButtonVariant.Clear}
        onClick={toggleMusic}
      >
        <MusicOn />
      </Button>
    </div>
  );
};

export default MusicButton;
