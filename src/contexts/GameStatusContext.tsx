import React, { createContext, useEffect, useReducer } from 'react';
import { DocumentData } from 'firebase/firestore';

import { GameContextActionType } from '../enums/GameContextActionTypes';
import { getScoreFromEntry } from '../helpers';
import { Score } from '../models';

interface GameContextState {
  scoreList: Score[];
}

interface GameContextAction {
  type: GameContextActionType;
  payload?: any;
}

const initialGameContextState: GameContextState = {
  scoreList: []
};

const stateReducer = (state: GameContextState, action: GameContextAction) => {
  switch (action.type) {
    case GameContextActionType.ScoreListChanged:
      return {
        ...state,
        scoreList: updatedScoreList(action.payload.changes, state)
      };
  }
};

const updatedScoreList = (
  entries: DocumentData[],
  state: GameContextState
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
  gameState: GameContextState;
  gameDispatch: any;
}

const initialValue: contextValue = {
  gameState: initialGameContextState,
  gameDispatch: null
};

const GameStatusContext = createContext(initialValue);

const GameStatusProvider = (props: any) => {
  const { children } = props;
  const [gameState, gameDispatch] = useReducer(
    stateReducer,
    initialGameContextState
  );
  const value = { gameState, gameDispatch };

  useEffect(() => {
    //gameDispatch({
    //  type: GameContextActionType.Reset
    //});
    console.log('GAME STATUS INIT', gameState.scoreList);
  }, []);

  return (
    <GameStatusContext.Provider value={value}>
      {children}
    </GameStatusContext.Provider>
  );
};

export { GameStatusContext, GameStatusProvider };
