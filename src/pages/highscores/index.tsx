import React, { ReactElement, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import css from './Highscores.module.scss';
import Button, { ButtonVariant } from '../../components/button/Button';
import Display from 'components/display/Display';
import { fetchRealTimeScoreList, fetchRealTimeSettings } from '../../helpers';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import { ReactComponent as TetrisHeader } from '../../svg/toplistHeader.svg';

const Highscores = (): ReactElement => {
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const { gameSettings, settingsDispatch } = useContext(GameSettingsContext);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeSettings = fetchRealTimeSettings(settingsDispatch);
    const unsubscribeScoreList = fetchRealTimeScoreList(gameDispatch);

    return () => {
      gameDispatch({ type: GameStateActionType.ResetScoreList });
      unsubscribeScoreList();
      unsubscribeSettings();
    };
  }, []);

  const registeredGames = (): string => {
    return gameState.scoreList.length > 0
      ? gameState.scoreList.length + ' spill registrert'
      : '';
  };

  return (
    <div className={css.container}>
      <TetrisHeader className={css.TetrisHeader} />
      <ol className={css.ScoreBoardList}>
        {gameState.scoreList
          .slice(0, gameSettings.toplistLength)
          .map((score, index) => (
            <li key={index}>
              <Display content={[score.name, score.score.toString()]} />
            </li>
          ))}
      </ol>
      <div>
        <p className={css.GamesPlayed}>{registeredGames()}</p>
        <Button
          label={'TILBAKE'}
          variant={ButtonVariant.Secondary}
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default Highscores;
