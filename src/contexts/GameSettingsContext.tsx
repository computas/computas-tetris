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
  toplistLength: number;
  trialTetrominoLength: number;
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
  toplistLength: 0,
  trialTetrominoLength: 5,
  trialTetrominos: ['I', 'I', 'I']
};

const initialContextValue: contextValue = {
  gameSettings: initialGameSettingsState,
  settingsDispatch: null
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
