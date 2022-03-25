import React, { ReactElement, useContext, useEffect } from 'react';

import css from './Highscores.module.scss';
import Display from 'components/display/Display';
import { fetchRealTimeScoreList } from '../../helpers';
import { GameStateContext } from '../../contexts/GameStateContext';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { ReactComponent as TetrisHeader } from '../../svg/tetrisHeader.svg';

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
    <div className={css.container}>
      <TetrisHeader className={css.TetrisHeader} />
      <p className={css.GamesPlayed}>
        {gameState.scoreList.length} spill registrert
      </p>
      <ol className={css.ScoreBoardList}>
        {gameState.scoreList.slice(0, 20).map((score, index) => (
          <li key={index}>
            <Display
              content={score.score}
              style={{
                fontSize: '25px',
                display: 'grid',
                alignContent: 'center'
              }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Highscores;
