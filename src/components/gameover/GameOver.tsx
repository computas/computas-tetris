import React, { useEffect, useState } from 'react';

import css from './GameOver.module.scss';
import ScorePage from './scorepage/ScorePage';
import { Score } from 'models';

interface GameOverProps {
  gameOver: boolean;
  score: number;
  scoreList: Score[];
  restart: () => void;
}

const GameOver = (props: GameOverProps) => {
  const { gameOver, score, scoreList, restart } = props;
  const [showScores, setShowScores] = useState(false);
  const [currentRank, setCurrentRank] = useState(1);

  const showHighScores = () => {
    restart();
  };

  useEffect(() => {
    if (gameOver) {
      setCurrentRank(scoreList.findIndex((item) => item.score <= score) + 1);

      setShowScores(false);
      setTimeout(() => {
        setShowScores(true);
      }, 2000);
    }
  }, [gameOver]);

  if (!gameOver) {
    return null;
  }

  return showScores ? (
    <div className={css.GameOver}>
      <ScorePage
        score={score}
        rank={`${currentRank}/${scoreList.length}`}
        showHighScores={showHighScores}
      />
    </div>
  ) : (
    <div className={css.GameOver}>
      <span>GAME OVER</span>
    </div>
  );
};

export default GameOver;
