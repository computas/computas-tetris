import React, { useContext, useEffect, useState } from 'react';

import css from './GameOver.module.scss';
import ScorePage from './scorepage/ScorePage';
import { GameStateContext } from '../../contexts/GameStateContext';
import { saveScore } from '../../helpers';
import { ReactComponent as EnteredFigure } from '../../svg/Entered.svg';
import { ReactComponent as ForgottenFigure } from '../../svg/Forgotten.svg';

interface GameOverProps {
  gameOver: boolean;
  restart: () => void;
}

const GAME_OVER_DISPLAY_DURATION = 2000;

const GameOver = (props: GameOverProps) => {
  const { gameOver, restart } = props;
  const { gameState } = useContext(GameStateContext);
  const [showScores, setShowScores] = useState(false);
  const [showEntered, setShowEntered] = useState(false);
  const [showForget, setShowForget] = useState(false);
  const [currentRank, setCurrentRank] = useState(1);

  useEffect(() => {
    if (gameOver) {
      const rank = findRank(gameState.storableScore.score);
      setCurrentRank(rank);
      setShowScores(false);
      setTimeout(() => {
        setShowScores(true);
      }, GAME_OVER_DISPLAY_DURATION);
    }
  }, [gameOver]);

  const findRank = (score: number): number => {
    let rank = gameState.scoreList.findIndex((item) => item.score <= score) + 1;
    if (rank === 0) {
      if (gameState.scoreList.length === 0) {
        rank += 1;
      } else {
        rank = gameState.scoreList.length + 1;
      }
    }
    return rank;
  };

  const participate = () => {
    saveScore(gameState.storableScore).then(() => {
      setShowEntered(true);
      setTimeout(() => {
        setShowEntered(false);
        restart();
      }, 3000);
    });
  };

  const forget = () => {
    setShowForget(true);
    setTimeout(() => {
      setShowForget(false);
      restart();
    }, 3000);
  };

  if (!gameOver) {
    return null;
  }

  return showScores ? (
    <div className={css.GameOver}>
      <ScorePage
        rank={`${currentRank} av ${gameState.scoreList.length + 1}`}
        participate={participate}
        restart={forget}
      />
      {showEntered && (
        <div className={css.Entered}>
          <div className={css.EnteredText}>Lykke til i konkurransen!</div>
          <div className={css.FiguresBox}>
            <EnteredFigure className={css.Figures} />
          </div>
        </div>
      )}
      {showForget && (
        <div className={css.Entered}>
          <div className={css.EnteredText}>Da glemmer vi dere!</div>
          <div className={css.FiguresBox}>
            <ForgottenFigure className={css.Figures} />
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className={css.GameOver}>
      <span className={css.GameOverText}>GAME OVER</span>
    </div>
  );
};

export default GameOver;
