import React from 'react';

import { ReactComponent as Trial1 } from '../../svg/Trial-1.svg';
import { ReactComponent as Trial2 } from '../../svg/Trial-2.svg';
import { ReactComponent as Trial3 } from '../../svg/Trial-3.svg';
import { ReactComponent as Trial4 } from '../../svg/Trial-4.svg';
import Button, { ButtonSize, ButtonVariant } from '../button/Button';
import css from './TrialScreen.module.scss';

interface TrialScreenProps {
  trial: boolean;
  trialStage: number;
  progressTrial: () => void;
  play: () => void;
}

export const TRIAL_PLAY = 3;
export const TRIAL_END = 5;

const TrialScreen = (props: TrialScreenProps) => {
  const { trial, trialStage, progressTrial, play } = props;

  if (!trial || trialStage === TRIAL_PLAY) {
    document.querySelector('section')?.focus();
    return null;
  }

  const getDescriptionText = (trialStage: number) => {
    return trialStage == 2
      ? 'Klikk for å prøve dere på spillet mens den som styrer kan se!'
      : 'Håper dere er klare, for nå starter spillet!';
  };

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

  const progressClick = () => {
    if (trialStage === 2) {
      progressTrial();
    }
  };

  return trialStage === 1 ? (
    <>
      <div className={css.TrialScreen}>
        <div className={css.TrialPromptDescription}>
          Vil dere ta en prøverunde, eller starte spillet?
        </div>
        <div className={css.Button}>
          <Button
            label={'SPILL OG VINN PREMIE!'}
            onClick={play}
            size={ButtonSize.XL}
            variant={ButtonVariant.Primary}
          />
        </div>
        <div className={css.Button}>
          <Button
            label={'VI VIL TESTE FØRST'}
            onClick={progressTrial}
            size={ButtonSize.XL}
            variant={ButtonVariant.Primary}
          />
        </div>
        <div className={css.FiguresBox}>
          <Trial1 className={css.Figures} />
        </div>
      </div>
    </>
  ) : (
    <>
      <div className={css.TrialScreen} onClick={progressClick}>
        <div className={css.TrialPromptDescription}>
          {getDescriptionText(trialStage)}
        </div>
        <div className={css.FiguresBox}>{renderFigure(trialStage)}</div>
      </div>
    </>
  );
};

export default TrialScreen;
