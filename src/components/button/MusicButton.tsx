import React, { ReactElement, useContext } from 'react';

import css from './Button.module.scss';
import Button, { ButtonSize, ButtonVariant } from './Button';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';
import { GameSettingsStateActionType } from '../../enums/GameSettingsStateActionTypes';
import { ReactComponent as MusicOff } from '../../svg/volume-off.svg';
import { ReactComponent as MusicOn } from '../../svg/volume-on.svg';

const MusicButton = (): ReactElement => {
  const { gameSettings, settingsDispatch } = useContext(GameSettingsContext);

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
        {gameSettings.playMusic ? <MusicOn /> : <MusicOff />}
      </Button>
    </div>
  );
};

export default MusicButton;
