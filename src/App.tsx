import React from 'react';

import Tetris from 'components/tetris/Tetris';
import { GameStatusProvider } from 'contexts/GameStatusContext';

export default function App() {
  return (
    <div>
      <main>
        <GameStatusProvider>
          <Tetris />
        </GameStatusProvider>
      </main>
    </div>
  );
}
