import { map } from '@firebase/util';
import React, { useState, useEffect } from 'react';

import { ReactComponent as Trial1 } from '../../svg/Trial-1.svg';
import { ReactComponent as Trial2 } from '../../svg/Trial-2.svg';
import { ReactComponent as Trial3 } from '../../svg/Trial-3.svg';
import { ReactComponent as Trial4 } from '../../svg/Trial-4.svg';

import css from './TrialScreen.module.scss';

interface TrialScreenProps {
  trial: boolean;
  trialStage: number;
  progressTrial: () => void;
  play: () => void;
}

const TrialScreen = (props: TrialScreenProps) => {
  const { trial, trialStage, progressTrial, play } = props;

  if (!trial || trialStage == 3) {
    document.querySelector('section')?.focus();
    return null;
  }

  const renderFigure = (trialStage: number) => {
    switch (trialStage) {
      case 2:
        return <Trial2 className={css.Figures} />;
      case 4:
        return <Trial3 className={css.Figures} />;
      case 5:
        return <Trial4 className={css.Figures} />;
    }
  };

  return trialStage == 1 ? (
    <>
      <div className={css.TrialScreen}>
        <div className={css.TrialPromptDescription}>
          Vil dere ta en prøverunde, eller starte spillet?
        </div>
        <div className={css.PlayButton}>
          <button onClick={() => play()}>
            <span className={css.PlayButtonText}>START SPILLET!</span>
          </button>
        </div>
        <div className={css.PlayButton}>
          <button onClick={() => progressTrial()}>
            <span className={css.PlayButtonText}>VI VILL TESTE FØRST</span>
          </button>
        </div>
        <div className={css.FiguresBox}>
          <Trial1 className={css.Figures} />
        </div>
      </div>
    </>
  ) : (
    <>
      <div className={css.TrialScreen} onClick={() => progressTrial()}>
        <div className={css.TrialPromptDescription}>
          {trialStage < 4
            ? 'Klikk for å prøve dere på spillet mens den som styrer kan se!'
            : 'Håper dere er klare, for nå starter spillet!'}
        </div>
        <div className={css.FiguresBox}>{renderFigure(trialStage)}</div>
      </div>
    </>
  );
};

export default TrialScreen;
