import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Highscores from './pages/highscores';
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
    <GameStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/highscores" element={<Highscores />} />
        </Routes>
      </BrowserRouter>
    </GameStateProvider>
  </React.StrictMode>
);

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

getAnalytics(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
