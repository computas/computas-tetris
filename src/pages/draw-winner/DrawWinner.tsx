import React, { ReactElement, useContext, useEffect, useState } from 'react';

import css from './DrawWinner.module.scss';
import Button, { ButtonSize } from '../../components/button/Button';
import { fetchRealTimeScoreList, fetchRealTimeSettings } from '../../helpers';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import { ReactComponent as RainbowPizza } from '../../svg/Rainbow-Pizza.svg';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';

enum DrawState {
  Initialized,
  Drawing,
  Done
}

interface Winner {
  name: string;
  email: string;
  email2: string;
}

const initialWinner: Winner = {
  name: '',
  email: '',
  email2: ''
};
const initialWinnerState: Winner[] = [];

const DrawWinner = (): ReactElement => {
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const { gameSettings, settingsDispatch } = useContext(GameSettingsContext);
  const [available, setAvailable] = useState([0]);
  const [drawState, setDrawState] = useState(DrawState.Initialized);
  const [winner, setWinner] = useState(initialWinner);
  const [winners, setWinners] = useState(initialWinnerState);

  useEffect(() => {
    const unsubscribeSettings = fetchRealTimeSettings(settingsDispatch);
    const unsubscribeScoreList = fetchRealTimeScoreList(gameDispatch);

    return () => {
      gameDispatch({ type: GameStateActionType.ResetScoreList });
      unsubscribeScoreList();
      unsubscribeSettings();
    };
  }, []);

  useEffect(() => {
    if (gameState.scoreList.length > 0) {
      const people = gameState.scoreList.map((_, index) => index);
      people.shift();
      setAvailable(people);
    }
  }, [gameState.scoreList]);

  const startDrawWinner = (): void => {
    setDrawState(DrawState.Drawing);
    setTimeout(() => {
      const winner = drawWinner();
      setWinner(winner);
      setWinners([...winners, winner]);
      showWinner();
    }, 2000);
  };

  const drawWinner = (): Winner => {
    const winnerIndex = Math.floor(Math.random() * (available.length - 1));
    available.splice(winnerIndex, 1);
    setAvailable(available);

    const winnerEntry = gameState.scoreList[available[winnerIndex]];
    return {
      name: winnerEntry.name,
      email: winnerEntry.email,
      email2: winnerEntry.email2 ?? ''
    };
  };

  const canDraw = (): boolean => {
    return (
      drawState !== DrawState.Drawing &&
      winners.length < gameSettings.numberOfWinners
    );
  };

  const showWinner = (): void => {
    setDrawState(DrawState.Done);
  };

  if (gameState.scoreList.length === 0) {
    return <></>;
  }

  return (
    <div className={css.DrawWinner}>
      <h1>Trekning</h1>
      <p>
        Det er {gameState.scoreList.length} registrerte spill som er med i
        trekningen.
      </p>
      <div className={css.Columned}>
        <div></div>
        <div className={drawState === DrawState.Drawing ? css.Drawing : ''}>
          <RainbowPizza />
        </div>
        <div>
          <h2>
            🥇
            <br />
            {gameState.scoreList[0].score} poeng
          </h2>
          <ul className={css.Winners}>
            <li>
              <b>{gameState.scoreList[0].name}</b>
            </li>
          </ul>
          {winners.length > 0 && (
            <>
              <h3>Vinnere</h3>
              <ul className={css.Winners}>
                {winners.map((winner, index) => (
                  <li key={index}>{winner.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {canDraw() && (
        <div className={css.Buttons}>
          <Button
            label={'Trekk en vinner'}
            size={ButtonSize.XL}
            onClick={startDrawWinner}
          />
          <br />
          <br />
          {gameSettings.numberOfWinners - winners.length} igjen
        </div>
      )}
      {drawState === DrawState.Done && (
        <div className={css.Winner}>
          <h2>{winner.name}</h2>
        </div>
      )}
    </div>
  );
};

export default DrawWinner;
