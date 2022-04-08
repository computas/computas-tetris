import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  Timestamp,
  query
} from 'firebase/firestore';

import { firestore } from '../index';
import { GameSettingsState } from '../contexts/GameSettingsContext';
import { GameSettingsStateActionType } from '../enums/GameSettingsStateActionTypes';
import { GameStateActionType } from '../enums/GameStateActionTypes';
import { Score } from '../models';

const initialGameSettings: GameSettingsState = {
  increaseSpeedFactor: 10,
  increaseSpeedOnEvery: 1,
  initialSpeed: 500,
  minimumSpeed: 30,
  playMusic: false,
  toplistLength: 0,
  trialTetrominoCount: 5
};

export const fetchRealTimeScoreList = (dispatch: any): any => {
  const collRef = collection(firestore, 'Scores');
  return onSnapshot(query(collRef), (snapshot) => {
    const changeList: DocumentData[] = [];
    snapshot.docChanges().forEach((entry) => {
      changeList.push(entry);
    });

    dispatch({
      type: GameStateActionType.ScoreListChanged,
      payload: { changes: changeList }
    });
  });
};

export const fetchRealTimeSettings = (dispatch: any): any => {
  const collRef = collection(firestore, 'Settings');
  return onSnapshot(query(collRef), (snapshot) => {
    const settings: GameSettingsState = {
      ...initialGameSettings
    };

    snapshot.docChanges().forEach((entry) => {
      const fetchedSettings = entry.doc.data();
      settings.increaseSpeedFactor =
        fetchedSettings.IncreaseSpeedFactor ?? settings.increaseSpeedFactor;
      settings.increaseSpeedOnEvery = Math.max(
        fetchedSettings.IncreaseSpeedOnEvery ?? settings.increaseSpeedOnEvery,
        1
      );
      settings.initialSpeed =
        fetchedSettings.InitialSpeed ?? settings.initialSpeed;
      settings.minimumSpeed =
        fetchedSettings.MinimumSpeed ?? settings.minimumSpeed;
      settings.playMusic = fetchedSettings.PlayMusic ?? settings.playMusic;
      settings.toplistLength =
        fetchedSettings.ToplistLength ?? settings.toplistLength;
      settings.trialTetrominoCount =
        fetchedSettings.TrialTetrominoCount ?? settings.trialTetrominoCount;
    });

    dispatch({
      type: GameSettingsStateActionType.Fetched,
      payload: settings
    });
  });
};

export const saveScore = async (score: Score) => {
  const collRef = collection(firestore, 'Scores');
  const status = await addDoc(collRef, {
    ...score,
    created: Timestamp.now()
  });
  console.log('SAVED', status);
};

export const getScoreFromEntry = (doc: DocumentData): Score => {
  const entry = doc.data();
  return {
    id: doc.id,
    created: entry.created,
    duration: entry.duration,
    email: entry.email,
    level: entry.level,
    name: entry.name,
    rows: entry.rows,
    score: entry.score,
    subscribe: entry.subscribe ?? false,
    tetrominoCount: entry.tetrominos
  };
};
