import React, { createContext, useReducer } from 'react';

import { GameSettingsStateActionType } from '../enums/GameSettingsStateActionTypes';

export interface GameSettingsState {
  increaseSpeedFactor: number;
  increaseSpeedOnEvery: number;
  initialSpeed: number;
  minimumSpeed: number;
  playMusic: boolean;
  showNext: boolean;
  swipeSensitivity: number;
  swipeSingleBlock: boolean;
  tetrominos: any;
  timestamp: number;
  toplistLength: number;
  trialTetrominos: string[];
}

interface GameSettingsStateAction {
  type: GameSettingsStateActionType;
  payload?: any;
}

interface contextValue {
  gameSettings: GameSettingsState;
  settingsDispatch: any;
}

const initialGameSettingsState: GameSettingsState = {
  increaseSpeedFactor: 10,
  increaseSpeedOnEvery: 1,
  initialSpeed: 500,
  minimumSpeed: 50,
  playMusic: false,
  showNext: true,
  swipeSensitivity: 1.0,
  swipeSingleBlock: false,
  tetrominos: {},
  timestamp: new Date().getTime(),
  toplistLength: 0,
  trialTetrominos: []
};

const initialContextValue: contextValue = {
  gameSettings: initialGameSettingsState,
  settingsDispatch: null
};

const changeTrialTetromino = (
  tetrominos: string[],
  index: number
): string[] => {
  const trialTetrominos: string[] = [...tetrominos];
  const ids = 'IJLOSTZ';
  const tetrominoIndex = ids.indexOf(tetrominos[index]);
  const newTetromino =
    tetrominoIndex + 1 <= ids.length - 1 ? tetrominoIndex + 1 : 0;
  trialTetrominos[index] = ids[newTetromino];

  return trialTetrominos;
};

const deleteTrialTetromino = (
  tetrominos: string[],
  index: number
): string[] => {
  tetrominos.splice(index, 1);
  return tetrominos;
};

const stateReducer = (
  state: GameSettingsState,
  action: GameSettingsStateAction
): GameSettingsState => {
  const { payload } = action;

  switch (action.type) {
    case GameSettingsStateActionType.Fetched:
      return {
        ...state,
        ...payload
      };

    case GameSettingsStateActionType.ToggleMusic:
      return {
        ...state,
        playMusic: !state.playMusic
      };

    case GameSettingsStateActionType.AddTrialTetromino:
      return {
        ...state,
        trialTetrominos: [...state.trialTetrominos, 'I']
      };

    case GameSettingsStateActionType.ChangeTrialTetromino:
      return {
        ...state,
        trialTetrominos: changeTrialTetromino(
          state.trialTetrominos,
          payload.index
        )
      };

    case GameSettingsStateActionType.DeleteTrialTetromino:
      return {
        ...state,
        trialTetrominos: deleteTrialTetromino(
          [...state.trialTetrominos],
          payload.index
        )
      };

    default:
      console.log(
        'No action handler for',
        GameSettingsStateActionType[action.type]
      );
  }

  return state;
};

const GameSettingsContext = createContext(initialContextValue);

const GameSettingsProvider = (props: any) => {
  const { children } = props;
  const [gameSettings, settingsDispatch] = useReducer(
    stateReducer,
    initialGameSettingsState
  );
  const value = { gameSettings, settingsDispatch };

  return (
    <GameSettingsContext.Provider value={value}>
      {children}
    </GameSettingsContext.Provider>
  );
};

export { GameSettingsContext, GameSettingsProvider };
