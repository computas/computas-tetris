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
import { GameContextActionType } from '../enums/GameContextActionTypes';

export const fetchRealTimeScoreList = (dispatch: any): any => {
  const collRef = collection(firestore, 'Scores');
  return onSnapshot(query(collRef), (snapshot) => {
    const changeList: DocumentData[] = [];
    snapshot.docChanges().forEach((entry) => {
      changeList.push(entry);
    });

    dispatch({
      type: GameContextActionType.ScoreListChanged,
      payload: { changes: changeList }
    });
  });
};

export const saveScore = async (score: Score) => {
  const t = new Date();
  const newDuration = t.getTime() - score.duration;

  const collRef = collection(firestore, 'Scores');
  const status = await addDoc(collRef, {
    ...score,
    created: Timestamp.now(),
    duration: newDuration
  });
  console.log('SAVED', status);
};

export const getScoreFromEntry = (doc: DocumentData): Score => {
  const entry = doc.data();
  return {
    id: doc.id,
    created: entry.created,
    duration: entry.duration,
    email: entry.level,
    level: entry.level,
    name: entry.name,
    rows: entry.rows,
    score: entry.score,
    tetrominos: entry.tetrominos
  };
};
