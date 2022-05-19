import React, { createContext, useEffect, useReducer } from 'react';

import { DrawWinnerActionType } from '../enums/DrawWinnerActionType';
import { Score, Winner } from '../models';

interface DrawWinnersState {
  drawn: boolean;
  fetched: boolean;
  isDrawing: boolean;
  isReady: boolean;
  scoreList: Score[];
  winner?: Winner;
  winners: Winner[];
}

interface DrawWinnerAction {
  type: DrawWinnerActionType;
  payload?: any;
}

interface contextValue {
  drawWinner: DrawWinnersState;
  drawWinnerDispatch: any;
}

const initialDrawWinnersState: DrawWinnersState = {
  drawn: false,
  fetched: false,
  isDrawing: false,
  isReady: false,
  scoreList: [],
  winners: []
};

const initialValue: contextValue = {
  drawWinner: initialDrawWinnersState,
  drawWinnerDispatch: null
};

const assessWinners = (
  state: DrawWinnersState,
  winners: Winner[]
): Winner[] => {
  return [...state.winners, ...winners];
};

const drawOne = (
  winners: Winner[],
  scoreList: Score[],
  scoreWinners = 1
): Winner | undefined => {
  if (!scoreList.length) {
    return;
  }

  const possibleWinners = getPossibleWinners(winners, scoreList, scoreWinners);
  if (!possibleWinners.length) {
    return;
  }

  const winnerIndex = Math.floor(Math.random() * (possibleWinners.length - 1));
  const winnerEntry = scoreList[possibleWinners[winnerIndex]];

  return {
    name: winnerEntry.name,
    email: winnerEntry.email,
    email2: winnerEntry.email2 ?? ''
  };
};

const getPossibleWinners = (
  winners: Winner[],
  scoreList: Score[],
  scoreWinners = 1
): number[] => {
  const possibles: number[] = [];
  const available = scoreList.map((_: Score, index: number) => index);

  // Remove score list winners
  available.splice(0, scoreWinners);

  // Remove already drawn winners
  available.forEach((index) => {
    const score = scoreList[index];
    const won = winners.find(
      (winner) =>
        winner.name === score.name ||
        winner.email + winner.email2 === score.email + score.email2
    );
    if (!won) {
      possibles.push(index);
    }
  });

  return possibles;
};

const drawWinnerReducer = (
  state: DrawWinnersState,
  action: DrawWinnerAction
): DrawWinnersState => {
  const { payload } = action;

  switch (action.type) {
    case DrawWinnerActionType.Done:
      return {
        ...state,
        drawn: true,
        isDrawing: false,
        winner: drawOne(state.winners, state.scoreList, payload.scoreWinners)
      };

    case DrawWinnerActionType.Draw:
      return {
        ...state,
        drawn: false,
        isDrawing: true,
        winner: undefined
      };

    case DrawWinnerActionType.Init:
      return initialDrawWinnersState;

    case DrawWinnerActionType.Loaded:
      return {
        ...state,
        fetched: true,
        winners: assessWinners(state, payload.winners)
      };

    case DrawWinnerActionType.Scores:
      return {
        ...state,
        scoreList: [...payload.scoreList]
      };

    default:
      console.log('No handler for action', DrawWinnerActionType[action.type]);
  }

  return state;
};

const DrawWinnersContext = createContext(initialValue);

const DrawWinnersProvider = ({ children }: any) => {
  const [drawWinner, drawWinnerDispatch] = useReducer(
    drawWinnerReducer,
    initialDrawWinnersState
  );
  const value = { drawWinner, drawWinnerDispatch };

  useEffect(() => {
    drawWinnerDispatch({
      type: DrawWinnerActionType.Init
    });
  }, []);

  return (
    <DrawWinnersContext.Provider value={value}>
      {children}
    </DrawWinnersContext.Provider>
  );
};

export { DrawWinnersContext, DrawWinnersProvider };
