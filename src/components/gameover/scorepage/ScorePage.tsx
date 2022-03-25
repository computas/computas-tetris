import React, { useEffect, useState } from 'react';

import { ReactComponent as ComputasLogo } from '../../../svg/computas.svg';
import { ReactComponent as Block0 } from '../../../svg/Block.svg';
import { ReactComponent as Block1 } from '../../../svg/Block-1.svg';
import { ReactComponent as Block2 } from '../../../svg/Block-2.svg';
import { ReactComponent as Block3 } from '../../../svg/Block-3.svg';
import { ReactComponent as Block4 } from '../../../svg/Block-4.svg';
import { ReactComponent as Block5 } from '../../../svg/Block-6.svg';
import { ReactComponent as Block6 } from '../../../svg/Block-8.svg';
import css from './ScorePage.module.scss';
import Button, { ButtonSize, ButtonVariant } from '../../button/Button';
import TextField from '../../textfield/TextField';

interface ScorePageProps {
  score: number;
  rank: string;
  participate: (name: string, email: string, subscribe: boolean) => void;
  restart: () => void;
}

const ScorePage = (props: ScorePageProps) => {
  const { participate, rank, restart, score } = props;
  const [showHigh, setShowHigh] = useState(true);
  const [prevScore, setPrevScore] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(false);

  useEffect(() => {
    setName('');
    setEmail('');
    setSubscribe(false);
  }, []);

  useEffect(() => {
    if (score === prevScore) {
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
    setPrevScore(score);
  }, [score, rank]);

  const handleTextInput = (fieldId: string, value: string): void => {
    if (fieldId === 'name') {
      setName(value);
    } else if (fieldId === 'email') {
      setEmail(value);
    }
  };

  const toggleSubscribe = (): void => {
    setSubscribe(!subscribe);
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
        <div className={css.Column}>
          <ComputasLogo
            style={{
              width: '15rem',
              height: '15rem',
              padding: '3rem'
            }}
          />
          <div className={css.ScorePageScore}>
            <span>
              Poengsum: <br />
              {score}
            </span>
          </div>
          <div className={css.ScorePageRank}>
            <span>Plassering: {rank}</span>
          </div>
          <div className={css.ScorePageDescription}>Vinn premie!</div>
          <div className={css.form}>
            <TextField
              label={'Kallenavn'}
              placeholder={'Kallenavn'}
              onChange={(value) => handleTextInput('name', value)}
              value={name}
            />
            <TextField
              label={'E-post'}
              placeholder={'E-post'}
              onChange={(value) => handleTextInput('email', value)}
              value={email}
            />
            <p>
              Vi sender e-post til vinneren av konkurransen når premien kan
              hentes
            </p>
            <p>
              <input
                type={'checkbox'}
                defaultChecked={subscribe}
                onClick={toggleSubscribe}
              />{' '}
              Jeg ønsker å melde meg på Computas´ nyhetsbrev
            </p>

            <div className={css.centered}>
              <Button
                label={'VI VIL VINNE!'}
                onClick={() => participate(name, email, subscribe)}
                size={ButtonSize.Large}
                variant={ButtonVariant.Primary}
              />
              <br />
              <br />
              <Button
                label={'GLEM OSS'}
                variant={ButtonVariant.Secondary}
                onClick={restart}
              />
            </div>
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
