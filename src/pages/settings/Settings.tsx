import React, { ReactElement, useContext, useEffect } from 'react';

import css from './Settings.module.scss';
import RadioButton from '../../components/radiobutton/RadioButton';
import Slider from '../../components/slider/Slider';
import TetrominoAvailability from './TetrominoAvailability';
import { fetchRealTimeSettings, saveSettings } from '../../helpers';
import {
  GameSettingsContext,
  GameSettingsState
} from '../../contexts/GameSettingsContext';

export interface GlobalSettings {
  IncreaseSpeedFactor: number;
  IncreaseSpeedOnEvery: number;
  InitialSpeed: number;
  MinimumSpeed: number;
  ShowNext: boolean;
  Tetrominos: JSON;
  ToplistLength: number;
  TrialTetrominoLength: number;
}

export interface TetrominoSetting {
  count: number;
  id: string;
  lines: number;
}

export const getTetrominoAvailability = (
  settings: GameSettingsState
): TetrominoSetting[] => {
  const availability: TetrominoSetting[] = [];

  for (const id in settings.tetrominos) {
    const tetrominoSetting: TetrominoSetting = {
      count: settings.tetrominos[id].count,
      id,
      lines: settings.tetrominos[id].lines
    };
    availability.push(tetrominoSetting);
  }
  availability.sort((a, b) => {
    return a.id < b.id ? -1 : 1;
  });
  return availability;
};

const Settings = (): ReactElement | null => {
  const { gameSettings, settingsDispatch } = useContext(GameSettingsContext);

  useEffect(() => {
    const unsubscribeSettings = fetchRealTimeSettings(settingsDispatch);

    return () => {
      unsubscribeSettings();
    };
  }, []);

  const getGlobalSettings = () => {
    return {
      IncreaseSpeedFactor: gameSettings.increaseSpeedFactor,
      IncreaseSpeedOnEvery: gameSettings.increaseSpeedOnEvery,
      InitialSpeed: gameSettings.initialSpeed,
      MinimumSpeed: gameSettings.minimumSpeed,
      ShowNext: gameSettings.showNext,
      Tetrominos: gameSettings.tetrominos,
      ToplistLength: gameSettings.toplistLength,
      TrialTetrominoLength: gameSettings.trialTetrominoLength
    };
  };

  const handleRadioButtonChange = (checked: boolean, name: string): void => {
    const updatedSettings: any = {};
    updatedSettings[name] = checked;
    saveSettings(getGlobalSettings(), updatedSettings);
  };

  const handleSliderChange = (value: number, name: string): void => {
    const updatedSettings: any = {};
    updatedSettings[name] = value;
    saveSettings(getGlobalSettings(), updatedSettings);
  };

  const handleAvailabilityChange = (tetromino: TetrominoSetting): void => {
    const updatedSettings = getGlobalSettings();
    updatedSettings.Tetrominos = {
      ...updatedSettings.Tetrominos,
      [tetromino.id]: {
        count: tetromino.count,
        lines: tetromino.lines
      }
    };
    saveSettings(getGlobalSettings(), updatedSettings);
  };

  return (
    <div className={css.Settings}>
      <header>
        <h1>Innstillinger</h1>
      </header>
      <p className={css.warning}>
        Endringer i innstillinger oppdaterer spillet i sanntid, så vær forsiktig
        med å gjøre store endringer.
      </p>

      <div className={css.row}>
        <Slider
          help={'Lavere er raskere'}
          label={'Starthastighet'}
          min={200}
          max={1000}
          name={'InitialSpeed'}
          value={gameSettings.initialSpeed}
          onChange={handleSliderChange}
        />
      </div>

      <div className={css.row}>
        <Slider
          help={'Lavere er raskere'}
          label={'Maks hastighet'}
          min={10}
          max={1000}
          name={'MinimumSpeed'}
          value={gameSettings.minimumSpeed}
          onChange={handleSliderChange}
        />
      </div>

      <div className={css.row}>
        <Slider
          help={'For hver n`te brikke'}
          label={'Hastighetsøkning'}
          min={1}
          max={20}
          name={'IncreaseSpeedOnEvery'}
          value={gameSettings.increaseSpeedOnEvery}
          onChange={handleSliderChange}
        />
      </div>

      <div className={css.row}>
        <Slider
          help={'I millisekunder'}
          label={'Hastighetsøkning'}
          min={1}
          max={100}
          name={'IncreaseSpeedFactor'}
          value={gameSettings.increaseSpeedFactor}
          onChange={handleSliderChange}
        />
      </div>

      <hr />

      <div className={css.row}>
        <Slider
          label={'Antall brikker i prøverunden'}
          min={1}
          max={20}
          name={'TrialTetrominoLength'}
          value={gameSettings.trialTetrominoLength}
          onChange={handleSliderChange}
        />
      </div>

      <div className={css.row}>
        <Slider
          label={'Antall på Topplisten'}
          min={1}
          max={100}
          name={'ToplistLength'}
          value={gameSettings.toplistLength}
          onChange={handleSliderChange}
        />
      </div>

      <div className={css.row}>
        <RadioButton
          checked={gameSettings.showNext}
          label={'Vis neste brikke'}
          name={'ShowNext'}
          onChange={handleRadioButtonChange}
        />
      </div>

      <hr />

      <div className={css.row}>
        <label>Tetromino-tilgjengeligjøring </label>
        <p>
          Her kan man justere hvordan brikker introduseres i spillet. <br />
          Dersom antall brikker eller linjer er satt til noe annet enn null, vil
          det som slår først til trigge introduksjon av den brikken.
        </p>
        {getTetrominoAvailability(gameSettings).map((tetromino) => (
          <TetrominoAvailability
            key={tetromino.id}
            onChange={handleAvailabilityChange}
            tetromino={tetromino}
          />
        ))}
      </div>
    </div>
  );
};

export default Settings;
