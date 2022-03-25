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

  return (
    <div className={css.StartScreen}>
      <h1 className={css.StartSreenHeader}>Velkommen!</h1>
      <p className={css.StartScreenInformation}>
        1: Bruk piltastene for å bevege tetrominoen.
      </p>
      <p className={css.StartScreenInformation}>
        2: Trykk Spill eller space for å starte spillet.
      </p>
      <p className={css.StartScreenInformation}>3: Lykke til!</p>
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
