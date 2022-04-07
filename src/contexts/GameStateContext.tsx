import React, { createContext, useEffect, useReducer } from 'react';
import { DocumentData } from 'firebase/firestore';

import { GameStateActionType } from '../enums/GameStateActionTypes';
import { getScoreFromEntry } from '../helpers';
import { Score } from '../models';

interface GameState {
  scoreList: Score[];
  storableScore: Score;
}

interface GameStateAction {
  type: GameStateActionType;
  payload?: any;
}

interface contextValue {
  gameState: GameState;
  gameDispatch: any;
}

const initialStorableScore: Score = {
  duration: 0,
  email: '',
  level: 0,
  name: '',
  rows: 0,
  score: 0,
  subscribe: false,
  tetrominoCount: 0
};

const initialGameState: GameState = {
  scoreList: [],
  storableScore: initialStorableScore
};

const initialValue: contextValue = {
  gameState: initialGameState,
  gameDispatch: null
};

const stateReducer = (state: GameState, action: GameStateAction): GameState => {
  switch (action.type) {
    case GameStateActionType.ResetScoreList:
      return {
        ...initialGameState
      };

    case GameStateActionType.ScoreListChanged:
      return {
        ...state,
        scoreList: updatedScoreList(action.payload.changes, state)
      };

    case GameStateActionType.ScoreReady:
      return {
        ...state,
        storableScore: {
          ...action.payload.storableScore,
          duration: getDurationSince(action.payload.storableScore.duration)
        }
      };

    case GameStateActionType.UpdateScoreWithDetails:
      return {
        ...state,
        storableScore: {
          ...state.storableScore,
          name: action.payload.name,
          email: action.payload.email,
          subscribe: action.payload.subscribe
        }
      };

    default:
      return state;
  }
};

const updatedScoreList = (
  entries: DocumentData[],
  state: GameState
): Score[] => {
  let newScoreList: Score[] = [...state.scoreList];

  entries.forEach((entry) => {
    if (entry.type === 'added') {
      newScoreList.push(getScoreFromEntry(entry.doc));
    }
    if (entry.type === 'removed') {
      newScoreList = state.scoreList.filter(
        (score) => score.id !== entry.doc.id
      );
    }
  });

  newScoreList.sort((a: Score, b: Score) => b.score - a.score);

  return newScoreList;
};

const getDurationSince = (start: number): number => {
  const t = new Date();
  return t.getTime() - start;
};

const GameStateContext = createContext(initialValue);

const GameStateProvider = (props: any) => {
  const { children } = props;
  const [gameState, gameDispatch] = useReducer(stateReducer, initialGameState);
  const value = { gameState, gameDispatch };

  useEffect(() => {
    gameDispatch({
      type: GameStateActionType.ResetScoreList
    });
  }, []);

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export { GameStateContext, GameStateProvider };
