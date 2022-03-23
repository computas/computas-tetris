import { useContext, useEffect, useState } from 'react';

import { fetchRealTimeScoreList, randomTetromino, Tetromino } from 'helpers';
import { Score } from 'models';
import { GameStateContext } from '../contexts/GameStateContext';

const LEVEL_INCREASE_COUNT = 2;
const SIMPLE_TETROMINOS_LIMIT = 10;
const pointsTable: number[] = [0, 40, 100, 300, 1200];
const initialTetrominosList: Tetromino[] = [
  randomTetromino(true),
  randomTetromino(true)
];

const initialStorableScore: Score = {
  duration: 0,
  email: '',
  level: 0,
  name: '',
  rows: 0,
  score: 0,
  tetrominos: 0
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
  const [tetrominoCount, setTetrominoCount] = useState(0);

  useEffect(() => {
    const unsubscribe = fetchRealTimeScoreList(gameDispatch);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    findHighestScore();
  }, [gameState.scoreList]);

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
        level: newLevel,
        rows: newRows,
        score: newScore,
        tetrominos: tetrominoCount
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
    setTetrominoCount(0);
  };

  const resetTetrominos = (): void => {
    setTetrominos([randomTetromino(true), randomTetromino(true)]);
  };

  const generateNextTetromino = (): void => {
    setTetrominoCount(tetrominoCount + 1);
    setTetrominos([
      tetrominos[1],
      randomTetromino(tetrominoCount < SIMPLE_TETROMINOS_LIMIT)
    ]);
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
