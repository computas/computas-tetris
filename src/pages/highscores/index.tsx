import React, { ReactElement, useContext, useEffect } from 'react';

import css from './Highscores.module.scss';
import { fetchRealTimeScoreList } from '../../helpers';
import { GameStateContext } from '../../contexts/GameStateContext';
import { GameStateActionType } from '../../enums/GameStateActionTypes';

const Highscores = (): ReactElement => {
  const { gameState, gameDispatch } = useContext(GameStateContext);

  useEffect(() => {
    gameDispatch({
      type: GameStateActionType.ResetScoreList
    });

    const unsubscribe = fetchRealTimeScoreList(gameDispatch);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={css.Highscores}>
      <h1>Topp 20</h1>
      <p>{gameState.scoreList.length} spill registrert</p>

      <ol>
        {gameState.scoreList.slice(0, 20).map((score, index) => (
          <li key={index}>{score.score}</li>
        ))}
      </ol>
    </div>
  );
};

export default Highscores;
