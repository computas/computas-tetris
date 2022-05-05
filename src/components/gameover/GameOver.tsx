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
  const [showEntered, setShowEntered] = useState(false);
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

  // useEffect(() => {
  //   console.log('entered');
  // }, [showEntered]);

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
      }, 2000);
    });
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
      {showEntered && (
        <div className={css.Entered}>
          <span className={css.OverlayText}>
            Dere er nå med i konkurransen!
          </span>
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
