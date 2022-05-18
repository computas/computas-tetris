import React, { ReactElement, useContext, useEffect } from 'react';

import css from './DrawWinner.module.scss';
import { DrawWinnerActionType } from '../../enums/DrawWinnerActionType';
import { DrawWinnersContext } from '../../contexts/DrawWinnersContext';
import {
  fetchRealTimeScoreList,
  fetchRealTimeSettings,
  fetchWinners,
  saveWinner
} from '../../helpers';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import { ReactComponent as RainbowPizza } from '../../svg/Rainbow-Pizza.svg';

const SPIN_TIME = 2000;
const highscorePrizes = ['🥇', '🥈', '🥉'];

const DrawWinner = (): ReactElement => {
  const { drawWinner, drawWinnerDispatch } = useContext(DrawWinnersContext);
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const { gameSettings, settingsDispatch } = useContext(GameSettingsContext);

  useEffect(() => {
    const unsubscribeSettings = fetchRealTimeSettings(settingsDispatch);
    const unsubscribeScoreList = fetchRealTimeScoreList(gameDispatch);
    const unsubscribeWinners = fetchWinners(drawWinnerDispatch);

    return () => {
      gameDispatch({ type: GameStateActionType.ResetScoreList });
      unsubscribeScoreList();
      unsubscribeSettings();
      unsubscribeWinners();
    };
  }, []);

  useEffect(() => {
    drawWinnerDispatch({
      type: DrawWinnerActionType.Scores,
      payload: {
        scoreList: gameState.scoreList
      }
    });
  }, [gameState.scoreList]);

  useEffect(() => {
    if (drawWinner.winner !== undefined) {
      saveWinner(drawWinner.winner);
    }
  }, [drawWinner.winner]);

  const startDrawWinner = (): void => {
    if (!canDraw()) {
      return;
    }

    drawWinnerDispatch({
      type: DrawWinnerActionType.Draw
    });

    setTimeout(() => {
      drawWinnerDispatch({
        type: DrawWinnerActionType.Done,
        payload: {
          scoreWinners: gameSettings.numberOfScoreWinners
        }
      });
    }, SPIN_TIME);
  };

  const canDraw = (): boolean => {
    return !drawWinner.isDrawing && drawsRemaining() > 0;
  };

  const drawsRemaining = (): number => {
    return (
      Math.min(
        gameSettings.numberOfWinners,
        gameState.scoreList.length - gameSettings.numberOfScoreWinners
      ) - drawWinner.winners.length
    );
  };

  const renderHighscoreWinners = (): ReactElement => {
    const winnersList: ReactElement[] = [];
    for (let i = 0; i < gameSettings.numberOfScoreWinners; i++) {
      winnersList.push(
        <li key={'win-' + i}>
          <span>{highscorePrizes[i]}</span>
          <b>{gameState.scoreList[i].name}</b>
          <span>{gameState.scoreList[i].score} poeng</span>
        </li>
      );
    }
    return <ul className={css.HighscoreWinners}>{winnersList}</ul>;
  };

  if (gameState.scoreList.length === 0) {
    return <></>;
  }

  return (
    <div className={css.DrawWinner}>
      <div className={css.Columned}>
        <div className={css.SpinWheel}>
          <h1>Trekning</h1>
          <p>
            Det er {gameState.scoreList.length} registrerte spill som er med i
            trekningen.
          </p>

          <div className={drawWinner.isDrawing ? css.Drawing : ''}>
            <RainbowPizza onClick={startDrawWinner} />
          </div>
          {canDraw() && (
            <div className={css.Buttons}>
              Spinn hjulet - {drawsRemaining()} igjen
            </div>
          )}
          {drawWinner.drawn && (
            <div className={css.Winner}>
              <h2>{drawWinner.winner?.name ?? ''}</h2>
            </div>
          )}
        </div>
        <div className={css.Winners}>
          {gameSettings.numberOfScoreWinners > 0 && (
            <div>
              <h2>Vinnere med flest poeng</h2>
              {renderHighscoreWinners()}
            </div>
          )}
          {drawWinner.winners.length > 0 && (
            <>
              <h2>Vinnere fra trekningen</h2>
              <ul>
                {drawWinner.winners.map((winner, index) => (
                  <li key={index}>{winner.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawWinner;
