import { useContext, useEffect, useState } from 'react';

import {
  fetchRealTimeScoreList,
  randomTetromino,
  Row,
  Tetromino
} from 'helpers';
import { GameStateActionType } from '../enums/GameStateActionTypes';
import { GameStateContext } from '../contexts/GameStateContext';
import { Score } from 'models';

const LEVEL_INCREASE_COUNT = 2;
const SIMPLE_TETROMINOS_LIMIT = 10;
const POINTS_TABLE: number[] = [0, 40, 100, 300, 1200];

const initialTetrominosList: Tetromino[] = [
  randomTetromino(true),
  randomTetromino(true)
];

const initialStorableScore: Score = {
  duration: 0,
  email: '',
  level: 1,
  name: '',
  rows: 0,
  score: 0,
  subscribe: false,
  tetrominoCount: 1
};

export const useGameStatus = (
  rowsCleared: Row[]
): [
  number,
  number,
  number,
  number,
  boolean,
  Score,
  Tetromino[],
  () => void,
  () => void,
  () => void
] => {
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [newHighScore, setNewHighScore] = useState(false);
  const [rows, setRows] = useState(0);
  const [score, setScore] = useState(0);
  const [storableScore, setSetstorableScore] = useState(initialStorableScore);
  const [tetrominos, setTetrominos] = useState(initialTetrominosList);

  useEffect(() => {
    const unsubscribe = fetchRealTimeScoreList(gameDispatch);

    return () => {
      gameDispatch({ type: GameStateActionType.ResetScoreList });
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    findHighestScore();
  }, [gameState.scoreList]);

  useEffect(() => {
    if (rowsCleared) {
      const newScore = score + calculateScore();
      const newRows = rows + rowsCleared.length;
      let newLevel = level;

      setRows(newRows);
      setScore(newScore);

      if (newScore >= highScore) {
        setHighScore(newScore);
        setNewHighScore(true);
      }

      if (newRows >= level * LEVEL_INCREASE_COUNT) {
        newLevel = 1 + Math.ceil(newRows / LEVEL_INCREASE_COUNT);
        setLevel(newLevel);
      }

      setSetstorableScore({
        ...storableScore,
        level: newLevel,
        rows: newRows,
        score: newScore
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

  const resetGame = (): void => {
    const t = new Date();
    setSetstorableScore({ ...initialStorableScore, duration: t.getTime() });
    setScore(0);
    setNewHighScore(false);
    setRows(0);
    setLevel(1);
  };

  const resetTetrominos = (): void => {
    setTetrominos([randomTetromino(true), randomTetromino(true)]);
  };

  const generateNextTetromino = (): void => {
    incrementTetrominoCount();
    setTetrominos([
      tetrominos[1],
      randomTetromino(storableScore.tetrominoCount <= SIMPLE_TETROMINOS_LIMIT)
    ]);
  };

  const incrementTetrominoCount = (): void => {
    setSetstorableScore({
      ...storableScore,
      tetrominoCount: storableScore.tetrominoCount + 1
    });
  };

  const calculateScore = (): number => {
    const points = POINTS_TABLE[rowsCleared.length] * level;
    const rowPoints = rowsCleared.map((row) => {
      return (
        row.cells.reduce((p: number, cell) => {
          return p + cell.color;
        }, 0) * level
      );
    });
    return points + rowPoints.reduce((a, b) => a + b, 0);
  };

  return [
    score,
    highScore,
    rows,
    level,
    newHighScore,
    storableScore,
    tetrominos,
    resetGame,
    resetTetrominos,
    generateNextTetromino
  ];
};
