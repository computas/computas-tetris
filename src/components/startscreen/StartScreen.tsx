import React from 'react';

import { ReactComponent as TetrisHeader } from '../../svg/tetrisHeader.svg';
import { ReactComponent as StartFigure } from '../../svg/StartMenu.svg';
import css from './StartScreen.module.scss';
import Button, { ButtonSize, ButtonVariant } from '../button/Button';

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

  document.querySelector('section')?.focus();

  return (
    <>
      <div className={css.StartScreen}>
        <TetrisHeader className={css.StartScreenHeader} />
        <div className={css.Button}>
          <Button
            label={'SPILL OG VINN PREMIE!'}
            onClick={startTrial}
            size={ButtonSize.XL}
            variant={ButtonVariant.Primary}
          />
        </div>
        <div className={css.Button}>
          <Button
            label={'SE TOPPLISTEN'}
            onClick={showHighScores}
            size={ButtonSize.Large}
            variant={ButtonVariant.Secondary}
          />
        </div>
        <div className={css.FiguresBox}>
          <StartFigure className={css.Figures} />
        </div>
      </div>
    </>
  );
};

export default StartScreen;
