import React, { useState } from 'react';
import Lottie from 'lottie-react';

import { ReactComponent as TetrisHeader } from '../../svg/tetrisHeader.svg';
import { ReactComponent as StartFigure } from '../../svg/StartMenu.svg';

import animationData from '../../lotties/hiro-hiding.json';
import css from './StartScreen.module.scss';

interface StartScreenProps {
  startScreen: boolean;
  showHighScores: () => void;
  startTrial: () => void;
}

const StartScreen = (props: StartScreenProps) => {
  const { startScreen, showHighScores, startTrial } = props;

  if (!startScreen) {
    return null;
  }

  return (
    <>
      <div className={css.StartScreen}>
        <TetrisHeader className={css.StartScreenHeader} />
        <div className={css.PlayButton}>
          <button onClick={() => startTrial()}>
            <span className={css.PlayButtonText}>SPILL OG VINN PREMIE!</span>
          </button>
        </div>
        <div className={css.ToplistButton}>
          <button onClick={() => showHighScores()}>
            <span className={css.ToplistButtonText}>SE TOPPLISTEN</span>
          </button>
        </div>
        <div className={css.FiguresBox}>
          <StartFigure className={css.Figures} />
        </div>
      </div>
    </>
  );
};

export default StartScreen;
