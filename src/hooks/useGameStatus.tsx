import { useContext, useEffect, useState } from 'react';

import {
  fetchRealTimeScoreList,
  fetchRealTimeSettings,
  randomTetromino,
  Row,
  Tetromino,
  getTetrominoNamed
} from 'helpers';
import { GameSettingsContext } from '../contexts/GameSettingsContext';
import { GameStateActionType } from '../enums/GameStateActionTypes';
import { GameStateContext } from '../contexts/GameStateContext';
import { getTetrominoAvailability } from '../pages/settings/Settings';

const LEVEL_INCREASE_COUNT = 2;
const POINTS_TABLE: number[] = [0, 40, 100, 300, 1200];

const initialTetrominosList: Tetromino[] = [
  randomTetromino([], 0, 0),
  randomTetromino([], 1, 0)
];

export const useGameStatus = (
  rowsCleared: Row[]
): [
  number,
  boolean,
  Tetromino[],
  (isTrial?: boolean) => void,
  (isTrial?: boolean) => void,
  (isTrial?: boolean) => void
] => {
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const { gameSettings, settingsDispatch } = useContext(GameSettingsContext);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [tetrominos, setTetrominos] = useState(initialTetrominosList);

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
    findHighestScore();
  }, [gameState.scoreList]);

  useEffect(() => {
    if (rowsCleared) {
      const newScore = gameState.storableScore.score + calculateScore();
      const newRows = gameState.storableScore.rows + rowsCleared.length;
      let newLevel = gameState.storableScore.level;

      if (newScore >= highScore) {
        setHighScore(newScore);
        setNewHighScore(true);
      }

      if (newRows >= gameState.storableScore.level * LEVEL_INCREASE_COUNT) {
        newLevel = 1 + Math.ceil(newRows / LEVEL_INCREASE_COUNT);
      }

      gameDispatch({
        type: GameStateActionType.UpdateScore,
        payload: { level: newLevel, rows: newRows, score: newScore }
      });
    }
  }, [rowsCleared]);

  const findHighestScore = (): void => {
    let highest = 0;
    gameState.scoreList.forEach((scoreEntry) => {
      if (scoreEntry.score > highest) {
        highest = scoreEntry.score;
      }
    });
    setHighScore(highest);
  };

  const resetGame = (isTrial = false): void => {
    resetTetrominos(isTrial);
    setNewHighScore(false);
    gameDispatch({ type: GameStateActionType.GameStarted });
  };

  const resetTetrominos = (isTrial = false): void => {
    if (isTrial) {
      const tetrominos: Tetromino[] = [
        getTetrominoNamed(gameSettings.trialTetrominos[0])
      ];

      if (gameSettings.trialTetrominos.length > 0) {
        tetrominos.push(getTetrominoNamed(gameSettings.trialTetrominos[1]));
      }

      setTetrominos(tetrominos);
      return;
    }

    setTetrominos([
      randomTetromino(getTetrominoAvailability(gameSettings), 0, 0),
      randomTetromino(getTetrominoAvailability(gameSettings), 1, 0)
    ]);
  };

  const generateNextTetromino = (isTrial = false): void => {
    incrementTetrominoCount();

    if (isTrial) {
      setTetrominos([
        tetrominos[1],
        getTetrominoNamed(
          gameSettings.trialTetrominos[gameState.storableScore.tetrominoCount]
        )
      ]);
      return;
    }

    setTetrominos([
      tetrominos[1],
      randomTetromino(
        getTetrominoAvailability(gameSettings),
        gameState.storableScore.tetrominoCount,
        gameState.storableScore.rows
      )
    ]);
  };

  const incrementTetrominoCount = (): void => {
    gameDispatch({ type: GameStateActionType.TetrominoAdded });
  };

  const calculateScore = (): number => {
    const points =
      POINTS_TABLE[rowsCleared.length] * gameState.storableScore.level;
    const rowPoints = rowsCleared.map((row) => {
      return (
        row.cells.reduce((p: number, cell) => {
          return p + cell.color;
        }, 0) * gameState.storableScore.level
      );
    });
    return points + rowPoints.reduce((a, b) => a + b, 0);
  };

  return [
    highScore,
    newHighScore,
    tetrominos,
    resetGame,
    resetTetrominos,
    generateNextTetromino
  ];
};
