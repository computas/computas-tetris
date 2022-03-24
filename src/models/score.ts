import firebase from 'firebase/compat';

import Timestamp = firebase.firestore.Timestamp;

export interface Score {
  id?: string;
  created?: Timestamp;
  email: string;
  duration: number;
  level: number;
  name: string;
  rows: number;
  score: number;
  subscribe: boolean;
  tetrominos: number;
}
