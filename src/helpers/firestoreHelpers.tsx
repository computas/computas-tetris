import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  Timestamp,
  query
} from 'firebase/firestore';

import { firestore } from '../index';
import { Score } from '../models';
import { GameStateActionType } from '../enums/GameStateActionTypes';

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
    tetrominos: entry.tetrominos
  };
};
