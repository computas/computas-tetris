import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import css from './Settings.module.scss';
import RenderTetromino from './RenderTetromino';
import Button, {
  ButtonSize,
  ButtonVariant
} from '../../components/button/Button';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';
import { GameSettingsStateActionType } from '../../enums/GameSettingsStateActionTypes';

interface TetrominoSelectorProps {
  onChange?: () => void;
  tetrominos: string[];
}

const TetrominoListSelector = ({
  onChange,
  tetrominos
}: TetrominoSelectorProps): ReactElement => {
  const { gameSettings, settingsDispatch } = useContext(GameSettingsContext);
  const [hasChanged, setHasChanged] = useState(false);
  const timerRef = useRef<any>();

  useEffect(() => {
    if (onChange && hasChanged && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = undefined;
        setHasChanged(false);
        onChange();
      }, 1000);
    }
  }, [gameSettings.trialTetrominos, hasChanged]);

  const addNewTetromino = (): void => {
    stopCurrentRequest();
    setHasChanged(true);
    settingsDispatch({
      type: GameSettingsStateActionType.AddTrialTetromino
    });
  };

  const changeTetromino = (index: number): void => {
    stopCurrentRequest();
    setHasChanged(true);
    settingsDispatch({
      type: GameSettingsStateActionType.ChangeTrialTetromino,
      payload: {
        index
      }
    });
  };

  const deleteTetromino = (index: number): void => {
    stopCurrentRequest();
    setHasChanged(true);
    settingsDispatch({
      type: GameSettingsStateActionType.DeleteTrialTetromino,
      payload: {
        index
      }
    });
  };

  const stopCurrentRequest = (): void => {
    clearInterval(timerRef.current);
    timerRef.current = undefined;
  };

  return (
    <div>
      <ul className={css.grid}>
        {tetrominos.map((id, index) => (
          <li
            className={css.block}
            key={'tls' + index}
            onClick={() => changeTetromino(index)}
            onDoubleClick={() => deleteTetromino(index)}
          >
            <RenderTetromino id={id} />
          </li>
        ))}
        <li style={{ alignItems: 'center' }}>
          <Button
            label={'+'}
            onClick={addNewTetromino}
            variant={ButtonVariant.Dark}
            size={ButtonSize.Round}
          />
        </li>
      </ul>
    </div>
  );
};

export default TetrominoListSelector;
