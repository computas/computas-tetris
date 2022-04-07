import React, { useContext, useEffect, useState } from 'react';

import css from './GameOver.module.scss';
import ScorePage from './scorepage/ScorePage';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import { saveScore } from '../../helpers';

interface GameOverProps {
  gameOver: boolean;
  score: number;
  restart: () => void;
}

const GAME_OVER_DISPLAY_DURATION = 2000;

const GameOver = (props: GameOverProps) => {
  const { gameOver, score, restart } = props;
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const [showScores, setShowScores] = useState(false);
  const [currentRank, setCurrentRank] = useState(1);

  useEffect(() => {
    if (gameOver) {
      const rank = findRank(score);
      setCurrentRank(rank);
      setShowScores(false);
      setTimeout(() => {
        setShowScores(true);
      }, GAME_OVER_DISPLAY_DURATION);
    }
  }, [gameOver]);

  useEffect(() => {
    if (
      gameState.storableScore.name !== '' &&
      gameState.storableScore.email !== ''
    ) {
      saveScore(gameState.storableScore).then(() => {
        restart();
      });
    }
  }, [gameState.storableScore]);

  const findRank = (score: number): number => {
    let rank = gameState.scoreList.findIndex((item) => item.score <= score) + 1;
    if (rank === 0) {
      if (gameState.scoreList.length === 0) {
        rank += 1;
      } else {
        rank = gameState.scoreList.length + 1;
      }
    }
    console.log('rank', rank, 'score', score);
    rank += 0;
    return rank;
  };

  const participate = (name: string, email: string, subscribe: boolean) => {
    gameDispatch({
      type: GameStateActionType.UpdateScoreWithDetails,
      payload: {
        name,
        email,
        subscribe
      }
    });
  };

  if (!gameOver) {
    return null;
  }

  return showScores ? (
    <div className={css.GameOver}>
      <ScorePage
        score={score}
        rank={`${currentRank} av ${gameState.scoreList.length + 1}`}
        participate={participate}
        restart={restart}
      />
    </div>
  ) : (
    <div className={css.GameOver}>
      <span>GAME OVER</span>
    </div>
  );
};

export default GameOver;
