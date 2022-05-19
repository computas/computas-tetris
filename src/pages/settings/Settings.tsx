import React, { ReactElement, useContext, useEffect } from 'react';

import css from './Settings.module.scss';
import Checkbox from '../../components/checkbox/Checkbox';
import Slider from '../../components/slider/Slider';
import TetrominoAvailability from './TetrominoAvailability';
import { fetchRealTimeSettings, saveSettings } from '../../helpers';
import {
  GameSettingsContext,
  GameSettingsState
} from 'contexts/GameSettingsContext';
import TetrominoListSelector from './TetrominoListSelector';

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
      NumberOfWinners: gameSettings.numberOfWinners,
      ShowNext: gameSettings.showNext,
      SwipeSensitivity: gameSettings.swipeSensitivity,
      SwipeSingleBlock: gameSettings.swipeSingleBlock,
      Tetrominos: gameSettings.tetrominos,
      ToplistLength: gameSettings.toplistLength,
      TrialTetrominos: gameSettings.trialTetrominos
    };
  };

  const handleChangeTrialTetrominos = (): void => {
    saveSettings(getGlobalSettings(), {});
  };

  const handleCheckboxChange = (checked: boolean, name: string): void => {
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
        <label>Vanskelighet</label>
        <p></p>
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
        <label>Sveiping</label>
        <p>Her kan man justere hvordan kontrollen på brikkene oppleves</p>
        <Slider
          label={'Følsomhet'}
          max={2.0}
          min={0.1}
          name={'SwipeSensitivity'}
          scale={100}
          step={0.1}
          unit={'%'}
          value={gameSettings.swipeSensitivity}
          onChange={handleSliderChange}
        />
      </div>

      <div className={css.row}>
        <div className={css.columned}>
          <span>En kolonne per sveip</span>
          <Checkbox
            checked={gameSettings.swipeSingleBlock}
            name={'SwipeSingleBlock'}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>

      <hr />

      <div className={css.row}>
        <label>Brikker</label>
        <p>
          Her kan man justere rekkefølgen brikker introduseres i spillet.
          <br />
          Dersom antall brikker eller linjer er satt til noe annet enn null, vil
          det som slår til først trigge introduksjon av den brikken.
        </p>
        {getTetrominoAvailability(gameSettings).map((tetromino) => (
          <TetrominoAvailability
            key={tetromino.id}
            onChange={handleAvailabilityChange}
            tetromino={tetromino}
          />
        ))}
      </div>
      <div className={css.row}>
        <div className={css.columned}>
          <span>Vis neste brikke</span>
          <Checkbox
            checked={gameSettings.showNext}
            name={'ShowNext'}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>

      <hr />

      <div className={css.row}>
        <label>Prøverunde</label>
        <p></p>
      </div>
      <div className={css.row}>
        <div className={css.columned}>
          <span>Brikker</span>
          <TetrominoListSelector
            tetrominos={gameSettings.trialTetrominos}
            onChange={handleChangeTrialTetrominos}
          />
        </div>
      </div>

      <hr />

      <div className={css.row}>
        <label>Annet</label>
        <p></p>
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
        <Slider
          label={'Antall vinnere'}
          help={'Som trekkes'}
          min={0}
          max={10}
          name={'NumberOfWinners'}
          value={gameSettings.numberOfWinners}
          onChange={handleSliderChange}
        />
      </div>
    </div>
  );
};

export default Settings;
