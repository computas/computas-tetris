import React from 'react';
import Lottie from 'lottie-react';

import animationData from '../../lotties/hiro-hiding.json';
import css from './StartScreen.module.scss';

interface StartScreenProps {
  startScreen: boolean;
}

const StartScreen = (props: StartScreenProps) => {
  const { startScreen } = props;

  if (!startScreen) {
    return null;
  }

  document.querySelector('section')?.focus();

  return (
    <div className={css.StartScreen}>
      <h1 className={css.StartScreenHeader}>Velkommen!</h1>
      <div className={css.desktop}>
        <p>1: Bruk piltastene sidelenges for å bevege tetrominoen</p>
        <p>2: Bruk piltast opp for å rotere tetrominoen</p>
        <p>3. Bruk Space eller piltast ned for å slippe tetrominoen</p>
        <p>4: Trykk Space for å starte spillet</p>
      </div>
      <div className={css.touchDevice}>
        <p>1: Swipe venstre/høyre for å bevege tetrominoen</p>
        <p>2: Tap for å rotere tetrominoen</p>
        <p>3. Swipe ned for å slippe tetrominoen</p>
        <p>4: Tap for å starte spillet</p>
      </div>
      <p>5: Lykke til!</p>
      <Lottie
        animationData={animationData}
        autoPlay
        loop
        className={css.LottieStartScreenStyle}
      />
    </div>
  );
};

export default StartScreen;
