import React, { ReactElement, useContext, useEffect, useState } from 'react';

import css from './DrawWinner.module.scss';
import Button, { ButtonSize } from '../../components/button/Button';
import { fetchRealTimeScoreList } from '../../helpers';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import { ReactComponent as RainbowPizza } from '../../svg/Rainbow-Pizza.svg';

enum DrawState {
  Initialized,
  Drawing,
  Done
}

const DrawWinner = (): ReactElement => {
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const [drawState, setDrawState] = useState(DrawState.Initialized);
  const [todaysWinner, setTodaysWinner] = useState({
    name: '',
    email: '',
    email2: ''
  });

  useEffect(() => {
    const unsubscribeScoreList = fetchRealTimeScoreList(gameDispatch);

    return () => {
      gameDispatch({ type: GameStateActionType.ResetScoreList });
      unsubscribeScoreList();
    };
  }, []);

  const drawWinner = (): void => {
    setDrawState(DrawState.Drawing);
    setTimeout(() => {
      showWinner();
    }, 2000);
    const winnerIndex =
      1 + Math.floor(Math.random() * (gameState.scoreList.length - 2));
    const winner = gameState.scoreList[winnerIndex];
    setTodaysWinner({
      name: winner.name,
      email: winner.email,
      email2: winner.email2 ?? ''
    });
  };

  const showWinner = (): void => {
    setDrawState(DrawState.Done);
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
      {drawState === DrawState.Initialized && (
        <div className={css.Buttons}>
          <Button
            label={'Trekk dagens vinner'}
            size={ButtonSize.XL}
            onClick={drawWinner}
          />
        </div>
      )}
      {drawState === DrawState.Drawing && (
        <div className={css.Drawing}>
          <RainbowPizza />
        </div>
      )}
      {drawState === DrawState.Done && (
        <div className={css.Winner}>
          Dagens vinner
          <h2>{todaysWinner.name}</h2>
          <span>{todaysWinner.email}</span>
          <span>{todaysWinner.email2}</span>
        </div>
      )}
    </div>
  );
};

export default DrawWinner;
