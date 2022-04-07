import React, { createContext, useReducer } from 'react';

import { GameSettingsStateActionType } from '../enums/GameSettingsStateActionTypes';

export interface GameSettingsState {
  increaseSpeedFactor: number;
  increaseSpeedOnEvery: number;
  initialSpeed: number;
  minimumSpeed: number;
  playMusic: boolean;
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
  playMusic: false
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
