import React, { ReactElement, useContext, useEffect, useState } from 'react';

import css from './DrawWinner.module.scss';
import { fetchRealTimeScoreList } from '../../helpers';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import Button, { ButtonSize } from '../../components/button/Button';

const DrawWinner = (): ReactElement => {
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const [todaysWinner, setTodaysWinner] = useState({ name: '', email: '' });

  useEffect(() => {
    const unsubscribeScoreList = fetchRealTimeScoreList(gameDispatch);

    return () => {
      gameDispatch({ type: GameStateActionType.ResetScoreList });
      unsubscribeScoreList();
    };
  }, []);

  const drawWinner = (): void => {
    const winnerIndex = Math.floor(
      Math.random() * (gameState.scoreList.length - 1)
    );
    const winner = gameState.scoreList[winnerIndex];
    setTodaysWinner({ name: winner.name, email: winner.email });
  };

  if (gameState.scoreList.length === 0) {
    return <></>;
  }

  return (
    <div className={css.DrawWinner}>
      <h1>Trekk en vinner</h1>
      <p>
        Det er {gameState.scoreList.length} registrerte spill som er med i
        trekningen.
      </p>
      {todaysWinner.name === '' && (
        <div className={css.Buttons}>
          <Button
            label={'Trekk dagens vinner'}
            size={ButtonSize.XL}
            onClick={drawWinner}
          />
        </div>
      )}
      {todaysWinner.name !== '' && (
        <div className={css.Winner}>
          Dagens vinner
          <h2>{todaysWinner.name}</h2>
          <span>{todaysWinner.email}</span>
        </div>
      )}
    </div>
  );
};

export default DrawWinner;
