import React, { createContext, useEffect, useReducer } from 'react';
import { DocumentData } from 'firebase/firestore';

import { getScoreFromEntry } from '../helpers';
import { Score } from '../models';
import { GameStateActionType } from '../enums/GameStateActionTypes';

interface GameState {
  scoreList: Score[];
}

interface GameStateAction {
  type: GameStateActionType;
  payload?: any;
}

const initialGameState: GameState = {
  scoreList: []
};

const stateReducer = (state: GameState, action: GameStateAction) => {
  console.log('state', action.type);
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

interface contextValue {
  gameState: GameState;
  gameDispatch: any;
}

const initialValue: contextValue = {
  gameState: initialGameState,
  gameDispatch: null
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
    console.log('insta');
  }, []);

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export { GameStateContext, GameStateProvider };
