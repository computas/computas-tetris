import React, { ReactElement, useContext, useEffect } from 'react';

import css from './Settings.module.scss';
import RadioButton from '../../components/radiobutton/RadioButton';
import Slider from '../../components/slider/Slider';
import { fetchRealTimeSettings, saveSettings } from '../../helpers';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';

export interface GlobalSettings {
  IncreaseSpeedFactor: number;
  IncreaseSpeedOnEvery: number;
  InitialSpeed: number;
  MinimumSpeed: number;
  PlayMusic: boolean;
  ToplistLength: number;
  TrialTetrominoLength: number;
}

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
      PlayMusic: gameSettings.playMusic,
      ToplistLength: gameSettings.toplistLength,
      TrialTetrominoLength: gameSettings.trialTetrominoCount
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

  return (
    <div className={css.Settings}>
      <header>
        <h1>Innstillinger</h1>
      </header>
      <p>
        Endringer i innstillinger oppdaterer spillet i sanntid, så vær forsiktig
        med å gjøre store endringer
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
          name={'TrialTetrominoCount'}
          value={gameSettings.trialTetrominoCount}
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
          checked={gameSettings.playMusic}
          label={'Spill musikk'}
          name={'PlayMusic'}
          onChange={handleRadioButtonChange}
        />
      </div>
    </div>
  );
};

export default Settings;
