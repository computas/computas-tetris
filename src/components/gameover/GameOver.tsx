import React, { useContext, useEffect, useState } from 'react';

import css from './GameOver.module.scss';
import ScorePage from './scorepage/ScorePage';
import { GameStateContext } from '../../contexts/GameStateContext';
import { saveScore } from '../../helpers';

interface GameOverProps {
  gameOver: boolean;
  restart: () => void;
}

const GAME_OVER_DISPLAY_DURATION = 2000;

const GameOver = (props: GameOverProps) => {
  const { gameOver, restart } = props;
  const { gameState } = useContext(GameStateContext);
  const [showScores, setShowScores] = useState(false);
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

  const participate = (): void => {
    saveScore(gameState.storableScore).then(() => {
      //alert('Dere er nå med i konkurransen!');
      restart();
    });
  };

  const skip = (): void => {
    setShowScores(true);
  };

  if (!gameOver) {
    return null;
  }

  return showScores ? (
    <div className={css.GameOver}>
      <ScorePage
        rank={`${currentRank} av ${gameState.scoreList.length + 1}`}
        participate={participate}
        restart={restart}
      />
    </div>
  ) : (
    <div className={css.GameOver} onClick={skip}>
      <span className={css.GameOverText}>GAME OVER</span>
    </div>
  );
};

export default GameOver;
