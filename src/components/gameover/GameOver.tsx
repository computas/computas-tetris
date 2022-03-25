import React, { useContext, useEffect, useState } from 'react';

import css from './GameOver.module.scss';
import ScorePage from './scorepage/ScorePage';
import { GameStateContext } from '../../contexts/GameStateContext';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
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
      setCurrentRank(
        gameState.scoreList.findIndex((item) => item.score <= score) + 1
      );

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

  const participate = (name: string, email: string, subscribe: boolean) => {
    if (name.trim() === '') {
      console.log('Name must be filled in');
      return;
    }

    if (email.trim() === '') {
      console.log('E-mail must be filled in');
      return;
    }

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
        rank={`${currentRank} av ${gameState.scoreList.length}`}
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
