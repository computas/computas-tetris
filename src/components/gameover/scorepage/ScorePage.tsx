import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';

import css from './ScorePage.module.scss';
import Button, { ButtonSize, ButtonVariant } from '../../button/Button';
import Checkbox from '../../checkbox/Checkbox';
import MusicButton from '../../button/MusicButton';
import TextField from '../../textfield/TextField';
import { GameStateActionType } from '../../../enums/GameStateActionTypes';
import { GameStateContext } from '../../../contexts/GameStateContext';
import { ReactComponent as ComputasLogo } from '../../../svg/computas.svg';
import { ReactComponent as Block0 } from '../../../svg/Block.svg';
import { ReactComponent as Block1 } from '../../../svg/Block-1.svg';
import { ReactComponent as Block2 } from '../../../svg/Block-2.svg';
import { ReactComponent as Block3 } from '../../../svg/Block-3.svg';
import { ReactComponent as Block4 } from '../../../svg/Block-4.svg';
import { ReactComponent as Block5 } from '../../../svg/Block-6.svg';
import { ReactComponent as Block6 } from '../../../svg/Block-8.svg';

interface ScorePageProps {
  rank: string;
  participate: () => void;
  restart: () => void;
}

const ScorePage = (props: ScorePageProps) => {
  const { participate, rank, restart } = props;
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const [showHigh, setShowHigh] = useState(true);
  const [prevScore, setPrevScore] = useState(0);
  const [wantToParticipate, setWantToParticipate] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState({ email: '', email2: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsSaving(false);
    gameDispatch({ type: GameStateActionType.PlayMusic });
  }, []);

  useEffect(() => {
    if (gameState.storableScore.score === prevScore) {
      setShowHigh(false);
      return;
    }

    if (rank.split(' ')[0] === '1') {
      setShowHigh(true);
      setTimeout(() => {
        setShowHigh(false);
      }, 5000);
    } else {
      setShowHigh(false);
    }

    setPrevScore(gameState.storableScore.score);
  }, [gameState.storableScore.score, rank]);

  const handleTextInput = (
    fieldId: string,
    value: string,
    options?: any
  ): void => {
    const updatedStorableScore = {
      ...gameState.storableScore
    };

    if (fieldId === 'name') {
      updatedStorableScore.name = value.trim();
    } else if (fieldId === 'email') {
      updatedStorableScore.email = value.trim();
    } else if (fieldId === 'email2') {
      updatedStorableScore.email2 = value.trim();
    }

    if (fieldId.startsWith('email')) {
      validateEmailInput({
        field: fieldId,
        value: value.trim(),
        message: 'Dette feltet må inneholde en gyldig e-postadresse',
        allowEmpty: options?.allowEmpty ?? false
      });
    }

    gameDispatch({
      type: GameStateActionType.UpdateScoreWithDetails,
      payload: updatedStorableScore
    });
  };

  const isValidEmail = (email: string): boolean => {
    const pattern = new RegExp(
      /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    return pattern.test(email.trim());
  };

  const validateTextInput = (value: string, message: string): boolean => {
    if (!value.trim()) {
      setNameError(message);
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateEmailInput = (options: {
    field: string;
    value: string;
    message: string;
    allowEmpty?: boolean;
  }): boolean => {
    const error = {
      ...emailError
    };

    if (options.field === 'email') {
      error.email = '';
    }
    if (options.field === 'email2') {
      error.email2 = '';
    }

    if (options.allowEmpty && options.value.trim() === '') {
      setEmailError(error);
      return true;
    } else if (!isValidEmail(options.value)) {
      if (options.field === 'email') {
        error.email = options.message;
      }
      if (options.field === 'email2') {
        error.email2 = options.message;
      }
      setEmailError(error);
      return false;
    }

    setEmailError(error);
    return true;
  };

  const validateUnique = (message: string): boolean => {
    const uniqueCombo =
      gameState.storableScore.email + gameState.storableScore.email2 ?? '';
    const storedEmails = getEmails(gameState.storableScore.name);
    const emailCombos: string[] = [];
    if (storedEmails.length > 0) {
      emailCombos.push(
        storedEmails[0].toLowerCase() + storedEmails[1].toLowerCase()
      );
      emailCombos.push(
        storedEmails[1].toLowerCase() + storedEmails[0].toLowerCase()
      );

      if (emailCombos.indexOf(uniqueCombo) === -1) {
        setNameError(message);
        return false;
      }
    }

    setNameError('');
    return true;
  };

  const validateAndParticipate = (): void => {
    if (!wantToParticipate) {
      setWantToParticipate(true);
      return;
    }

    if (
      validateTextInput(
        gameState.storableScore.name,
        'Dette feltet kan ikke være tomt'
      ) &&
      validateEmailInput({
        field: 'email',
        value: gameState.storableScore.email,
        message: 'Dette feltet må inneholde en gyldig e-postadresse'
      }) &&
      validateEmailInput({
        field: 'email2',
        value: gameState.storableScore.email2 ?? '',
        message: 'Dette feltet må inneholde en gyldig e-postadresse',
        allowEmpty: true
      }) &&
      validateUnique('Kallenavnet er allerede i bruk')
    ) {
      setIsSaving(true);
      participate();
    } else {
      setIsSaving(false);
    }
  };

  const getEmails = (name: string): string[] => {
    const emails: string[] = [];
    for (const entry of gameState.scoreList) {
      if (entry.name.toLowerCase() === name.toLowerCase()) {
        emails.push(entry.email);
        if (entry.email2 !== undefined) {
          emails.push(entry.email2);
        }
        return emails;
      }
    }
    return [];
  };

  const toggleSubscribe = (value: boolean, field: string): void => {
    const updatedStorableScore = {
      ...gameState.storableScore
    };

    if (field === 'subscribe') {
      updatedStorableScore.subscribe = !updatedStorableScore.subscribe;
    }
    if (field === 'subscribe2') {
      updatedStorableScore.subscribe2 = !updatedStorableScore.subscribe2;
    }

    gameDispatch({
      type: GameStateActionType.UpdateScoreWithDetails,
      payload: updatedStorableScore
    });
  };

  return (
    <>
      <div className={css.ScorePage}>
        <div className={css.Column}>
          <div className={css.Tetromino}>
            <Block4 />
          </div>
          <div className={css.Tetromino}>
            <Block0 />
          </div>
          <div className={css.Tetromino}>
            <Block5 />
          </div>
          <div className={css.Tetromino}>
            <Block1 />
          </div>
        </div>
        <div className={css.FormColumn}>
          <ComputasLogo
            style={{
              width: '21.3rem',
              height: '21.3rem',
              padding: '2rem',
              justifySelf: 'center'
            }}
          />
          {!wantToParticipate ? (
            <div>
              <div className={css.ScorePageScore}>
                <span>
                  Poengsum: <br />
                  {gameState.storableScore.score}
                </span>
              </div>
              <div className={css.ScorePageRank}>
                <span>Plassering: {rank}</span>
              </div>
              <h2 className={css.ScorePageText}>
                Bli med i<br /> konkurransen og
                <br /> vinn premie!
              </h2>
            </div>
          ) : (
            <>
              <div className={css.form}>
                <div className={css.ScorePageDescription}>Vinn premie!</div>
                <TextField
                  errorMessage={nameError}
                  label={'Lagnavn'}
                  placeholder={'Lagnavn'}
                  onBlur={(value: string) =>
                    validateTextInput(value, 'Dette feltet kan ikke være tomt')
                  }
                  onChange={(value) => handleTextInput('name', value)}
                  value={gameState.storableScore.name}
                />
                <div className={css.formRowColumned}>
                  <TextField
                    errorMessage={emailError.email}
                    fieldType={'email'}
                    id={'email'}
                    label={'E-post - spiller 1'}
                    onChange={(value) => handleTextInput('email', value)}
                    placeholder={'E-post'}
                    value={gameState.storableScore.email}
                  />

                  <label
                    className={classNames(
                      css.aligned,
                      isValidEmail(gameState.storableScore.email ?? '')
                        ? undefined
                        : css.disabled
                    )}
                  >
                    <Checkbox
                      checked={gameState.storableScore.subscribe}
                      name={'subscribe'}
                      onChange={toggleSubscribe}
                    />
                    Jeg ønsker å melde meg på Computas´ nyhetsbrev
                  </label>
                </div>

                <div className={css.formRowColumned}>
                  <TextField
                    errorMessage={emailError.email2}
                    fieldType={'email'}
                    id={'email2'}
                    label={'E-post - spiller 2'}
                    onChange={(value) =>
                      handleTextInput('email2', value, { allowEmpty: true })
                    }
                    placeholder={'E-post'}
                    value={gameState.storableScore.email2 ?? ''}
                  />

                  <label
                    className={classNames(
                      css.aligned,
                      isValidEmail(gameState.storableScore.email2 ?? '')
                        ? undefined
                        : css.disabled
                    )}
                  >
                    <Checkbox
                      checked={gameState.storableScore.subscribe2 ?? false}
                      name={'subscribe2'}
                      onChange={toggleSubscribe}
                    />
                    Jeg ønsker å melde meg på Computas´ nyhetsbrev
                  </label>
                </div>

                <p>
                  Vi sender e-post til vinnerne av konkurransen når premien kan
                  hentes
                </p>
              </div>
            </>
          )}

          <div className={css.form}>
            <div className={css.centered}>
              <Button
                disabled={isSaving}
                label={'VI VIL VINNE!'}
                onClick={validateAndParticipate}
                size={ButtonSize.XL}
                variant={ButtonVariant.Primary}
              />
              <Button
                disabled={isSaving}
                label={'GLEM OSS'}
                size={ButtonSize.Large}
                variant={ButtonVariant.Secondary}
                onClick={restart}
              />
            </div>
            <MusicButton />
          </div>
          <div className={css.Tetromino}>
            <Block6 />
          </div>
        </div>
        <div className={css.Column}>
          <div className={css.Tetromino}>
            <Block3 />
          </div>
          <div className={css.Tetromino}>
            <Block5 />
          </div>
          <div className={css.Tetromino}>
            <Block0 />
          </div>
          <div className={css.Tetromino}>
            <Block2 />
          </div>
        </div>
      </div>
      {showHigh ? (
        <div className={css.TopScoreOverlay}>
          <div className={css.TopScoreOverlayBox}>
            <span className={css.TopScoreOverlayText}>
              NY BESTE PLASSERING!
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ScorePage;
