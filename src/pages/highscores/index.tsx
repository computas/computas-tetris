import React, { ReactElement, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import css from './Highscores.module.scss';
import Display from 'components/display/Display';
import { fetchRealTimeScoreList } from '../../helpers';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import { ReactComponent as TetrisHeader } from '../../svg/toplistHeader.svg';
import Button, { ButtonVariant } from '../../components/button/Button';

const TOPLIST_LENGTH = 10;

const Highscores = (): ReactElement => {
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const navigate = useNavigate();

  useEffect(() => {
    gameDispatch({
      type: GameStateActionType.ResetScoreList
    });

    const unsubscribe = fetchRealTimeScoreList(gameDispatch);

    return () => {
      unsubscribe();
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
      <p className={css.GamesPlayed}>{registeredGames()}</p>
      <ol className={css.ScoreBoardList}>
        {gameState.scoreList.slice(0, TOPLIST_LENGTH).map((score, index) => (
          <li key={index}>
            <Display content={[score.name, score.score.toString()]} />
          </li>
        ))}
      </ol>
      <div>
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
