import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  query
} from 'firebase/firestore';

import { firestore } from '../index';
import { Score } from 'models';

export const fetchRealTimeScoreList = (callback: (scores: Score[]) => void) => {
  const scoreList: Score[] = [];
  const collRef = collection(firestore, 'Scores');
  onSnapshot(query(collRef), (snapshot) => {
    snapshot.docChanges().forEach((entry) => {
      scoreList.push(getScoreFromEntry(entry.doc.data()));
    });
    scoreList.sort((a: Score, b: Score) => b.score - a.score);

    console.log('UPDATED SCORELIST', scoreList);
    callback(scoreList);
  });
};

export const saveScore = async (score: Score) => {
  const t = new Date();
  const newDuration = t.getTime() - score.duration;

  const collRef = collection(firestore, 'Scores');
  const status = await addDoc(collRef, { ...score, duration: newDuration });
  console.log('SAVED', status);
};

const getScoreFromEntry = (entry: DocumentData): Score => {
  return {
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
