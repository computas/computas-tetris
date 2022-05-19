import {
  addDoc,
  collection,
  doc,
  DocumentData,
  onSnapshot,
  query,
  Timestamp,
  updateDoc
} from 'firebase/firestore';

import { DrawWinnerActionType } from '../enums/DrawWinnerActionType';
import { firestore } from '../index';
import { GameSettingsState } from '../contexts/GameSettingsContext';
import { GameSettingsStateActionType } from '../enums/GameSettingsStateActionTypes';
import { GameStateActionType } from '../enums/GameStateActionTypes';
import { GlobalSettings, Score, Winner } from 'models';

const initialGameSettings: GameSettingsState = {
  increaseSpeedFactor: 10,
  increaseSpeedOnEvery: 1,
  initialSpeed: 500,
  minimumSpeed: 30,
  numberOfScoreWinners: 1,
  numberOfWinners: 1,
  playMusic: false,
  showNext: true,
  swipeSensitivity: 1.0,
  swipeSingleBlock: false,
  tetrominos: {},
  timestamp: new Date().getTime(),
  toplistLength: 0,
  trialTetrominos: ['I', 'I', 'I', 'L', 'L']
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
      const fetchedSettings = entry.doc.data() as GlobalSettings;
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
      settings.numberOfScoreWinners =
        fetchedSettings.NumberOfScoreWinners ?? settings.numberOfScoreWinners;
      settings.numberOfWinners =
        fetchedSettings.NumberOfWinners ?? settings.numberOfWinners;
      settings.playMusic = false;
      settings.showNext = fetchedSettings.ShowNext ?? settings.showNext;
      settings.swipeSensitivity = fetchedSettings.SwipeSensitivity ?? 1.0;
      settings.swipeSingleBlock = fetchedSettings.SwipeSingleBlock ?? false;
      settings.toplistLength =
        fetchedSettings.ToplistLength ?? settings.toplistLength;
      settings.tetrominos = fetchedSettings.Tetrominos ?? { none: 'available' };
      settings.trialTetrominos = fetchedSettings.TrialTetrominos ?? [
        'I',
        'J',
        'T'
      ];
    });

    dispatch({
      type: GameSettingsStateActionType.Fetched,
      payload: settings
    });
  });
};

export const fetchWinners = (dispatch: any): any => {
  const collRef = collection(firestore, 'Winners');
  return onSnapshot(query(collRef), (snapshot) => {
    const winners: Winner[] = [];
    snapshot.docChanges().forEach((entry) => {
      const winner = entry.doc.data() as Winner;
      winners.push(winner);
    });

    dispatch({
      type: DrawWinnerActionType.Loaded,
      payload: {
        winners
      }
    });
  });
};

export const saveSettings = async (
  settings: GlobalSettings,
  updatedSettings: any
) => {
  const globalSettings: GlobalSettings = {
    ...settings,
    ...updatedSettings
  };

  const docRef = doc(firestore, 'Settings', 'global');
  await updateDoc(docRef, {
    ...globalSettings
  });
};

export const saveScore = async (score: Score) => {
  const collRef = collection(firestore, 'Scores');
  await addDoc(collRef, {
    ...score,
    created: Timestamp.now()
  });
};

export const saveWinner = async (winner: Winner) => {
  const collRef = collection(firestore, 'Winners');
  await addDoc(collRef, {
    ...winner,
    created: Timestamp.now()
  });
};

export const getScoreFromEntry = (doc: DocumentData): Score => {
  const entry = doc.data();
  return {
    id: doc.id,
    created: entry.created,
    duration: entry.duration,
    email: entry.email,
    email2: entry.email2 ?? '',
    level: entry.level,
    name: entry.name,
    rows: entry.rows,
    score: entry.score,
    subscribe: entry.subscribe ?? false,
    subscribe2: entry.subscribe2 ?? false,
    tetrominoCount: entry.tetrominos
  };
};
