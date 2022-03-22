import { useEffect, useState } from 'react';

import { fetchHighScores, randomTetromino, Tetromino } from '../helpers';
import { Score } from '../models';

const LEVEL_INCREASE_COUNT = 2;
const pointsTable: number[] = [0, 40, 100, 300, 1200];
const initialTetrominosList: Tetromino[] = [
  randomTetromino(),
  randomTetromino()
];

const initialStorableScore: Score = {
  duration: 0,
  level: 0,
  name: '',
  rows: 0,
  score: 0,
  tetrominos: 0
};

const initialHighScore = (): number => {
  const tempHighScore = localStorage.getItem('highScores');
  if (!tempHighScore) {
    return 0;
  }

  const scores = JSON.parse(tempHighScore);
  try {
    return scores[0].score ?? 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const useGameStatus = (
  rowsCleared: number
): [
  number,
  number,
  number,
  number,
  boolean,
  Score,
  Tetromino[],
  () => void,
  () => void
] => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(initialHighScore());
  const [newHighScore, setNewHighScore] = useState(false);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);
  const [storableScore, setSetstorableScore] = useState(initialStorableScore);
  const [tetrominos, setTetrominos] = useState(initialTetrominosList);

  useEffect(() => {
    fetchHighScores();
  }, []);

  useEffect(() => {
    if (rowsCleared) {
      const newScore = score + pointsTable[rowsCleared] * level;
      const newRows = rows + rowsCleared;
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
        score: newScore,
        rows: newRows,
        level: newLevel
      });
    }
  }, [rowsCleared]);

  const resetGame = (): void => {
    setSetstorableScore(initialStorableScore);
    setScore(0);
    setNewHighScore(false);
    setRows(0);
    setLevel(1);
  };

  const generateNextTetromino = (): void => {
    // TODO: increase tertomino count
    setTetrominos([tetrominos[1], randomTetromino()]);
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
    generateNextTetromino
  ];
};
