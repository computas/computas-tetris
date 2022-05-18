import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

import './index.css';
import App from './App';
import DrawWinner from './pages/draw-winner/DrawWinner';
import ExportEmails from './pages/export-emails/ExportEmails';
import Highscores from './pages/highscores/Highscores';
import reportWebVitals from './reportWebVitals';
import Settings from './pages/settings/Settings';
import SignOut from './pages/signout/SignOut';
import { GameSettingsProvider } from './contexts/GameSettingsContext';
import { GameStateProvider } from './contexts/GameStateContext';

const rootContainer = document.getElementById('root');
const root = createRoot(rootContainer as HTMLElement);
const firebaseConfig = {
  apiKey: 'AIzaSyA0gvBuEPaccE2sW5ybIANcmPomKbDkkmA',
  authDomain: 'compis-tetris.firebaseapp.com',
  databaseURL:
    'https://compis-tetris-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'compis-tetris',
  storageBucket: 'compis-tetris.appspot.com',
  messagingSenderId: '920428522809',
  appId: '1:920428522809:web:6d7a26faa8208657a1cce8',
  measurementId: 'G-XJJ3HG47TQ'
};

root.render(
  <React.StrictMode>
    <GameSettingsProvider>
      <GameStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/highscores" element={<Highscores />} />
            <Route path="/export-emails" element={<ExportEmails />} />
            <Route path="/draw-winner" element={<DrawWinner />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signout" element={<SignOut />} />
          </Routes>
        </BrowserRouter>
      </GameStateProvider>
    </GameSettingsProvider>
  </React.StrictMode>
);

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);

getAnalytics(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
