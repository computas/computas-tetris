import React, { createContext, useEffect, useReducer } from 'react';
import { DocumentData } from 'firebase/firestore';

import { GameStateActionType } from '../enums/GameStateActionTypes';
import { getScoreFromEntry } from '../helpers';
import { Score } from '../models';

interface GameState {
  music: boolean;
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
  email2: '',
  level: 1,
  name: '',
  rows: 0,
  score: 0,
  subscribe: false,
  subscribe2: false,
  tetrominoCount: 1
};

const initialGameState: GameState = {
  music: true,
  scoreList: [],
  storableScore: initialStorableScore
};

const initialValue: contextValue = {
  gameState: initialGameState,
  gameDispatch: null
};

const stateReducer = (state: GameState, action: GameStateAction): GameState => {
  const { payload } = action;

  switch (action.type) {
    case GameStateActionType.PlayMusic:
      return {
        ...state,
        music: true
      };

    case GameStateActionType.ResetScoreList:
      return {
        ...initialGameState
      };

    case GameStateActionType.ScoreListChanged:
      return {
        ...state,
        scoreList: updatedScoreList(payload.changes, state)
      };

    case GameStateActionType.GameStarted:
      return {
        ...state,
        storableScore: initialStorableScore
      };

    case GameStateActionType.GameOver:
      return {
        ...state,
        storableScore: {
          ...state.storableScore,
          duration: getDurationSince(state.storableScore.duration)
        }
      };

    case GameStateActionType.StopMusic:
      return {
        ...state,
        music: false
      };

    case GameStateActionType.TetrominoAdded:
      return {
        ...state,
        storableScore: {
          ...state.storableScore,
          tetrominoCount: state.storableScore.tetrominoCount + 1
        }
      };

    case GameStateActionType.UpdateScore:
      return {
        ...state,
        storableScore: {
          ...state.storableScore,
          level: payload.level,
          rows: payload.rows,
          score: payload.score
        }
      };

    case GameStateActionType.UpdateScoreWithDetails:
      return {
        ...state,
        storableScore: {
          ...state.storableScore,
          name: payload.name,
          email: payload.email,
          email2: payload.email2 ?? '',
          subscribe: payload.subscribe,
          subscribe2: payload.subscribe2 ?? false
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
