import React, { useContext, useEffect, useState } from 'react';
import Swipe, { SwipePosition } from 'react-easy-swipe';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import useSound from 'use-sound';

import css from './Tetris.module.scss';
import Display from 'components/display/Display';
import GameOver from 'components/gameover/GameOver';
import Next from 'components/next/Next';
import Stage from 'components/stage/Stage';
import StartScreen from 'components/startscreen/StartScreen';
import TrialScreen, {
  TRIAL_PLAY,
  TRIAL_END
} from 'components/trial/TrialScreen';
import {
  calculateLandingRow,
  canMove,
  createStage,
  detectCollision
} from 'helpers';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import { ReactComponent as ComputasLogo } from '../../svg/computas.svg';
import { ReactComponent as TetrisVertical } from '../../svg/tetrisVertical.svg';
import {
  useController,
  useGameStatus,
  useInterval,
  usePlayer,
  useStage
} from 'hooks';

export interface GameState {
  gameOver: boolean;
  startScreen: boolean;
  trial: boolean;
  trialStage: number;
  dropSpeed: number;
}

const initialGameState: GameState = {
  gameOver: false,
  startScreen: true,
  trial: false,
  trialStage: 0,
  dropSpeed: 1100
};

const LEFT = -1;
const RIGHT = 1;
const BLOCK_SIZE = 32;
const SPEED_FACTOR = 600;
const LEVEL_FACTOR = 35;
const SWIPE_DOWN_ANGLE = 3.0;
const SWIPE_DOWN_DIST_MIN = 80;
const TAP_MOVE_DIST_MAX = 8;
const TRIAL_BLOCKS = 5;

export default function Tetris() {
  const { gameDispatch } = useContext(GameStateContext);
  const [state, setState] = useState(initialGameState);
  const [touchStartPosition, setTouchStartPosition] = useState({
    x: 0,
    y: 0,
    timeStamp: 0
  });
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [player, updatePlayerPosition, rotatePlayer, applyNextTetromino] =
    usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player);
  const [
    score,
    highScore,
    rows,
    level,
    newHighScore,
    storableScore,
    tetrominos,
    resetGame,
    resetTetrominos,
    generateNextTetromino
  ] = useGameStatus(rowsCleared);
  const [dropSpeed, setDropSpeed] = useState(0);
  const [blocksPlayed, setBlocksPlayed] = useState(1);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [
    leftPressState,
    rightPressState,
    downPressState,
    rotatePressState,
    handleKeyPressed,
    handleKeyReleased,
    setMoveComplete
  ] = useController();

  const [playMoveBlockSound] = useSound('/assets/sfx/move.mp3');
  const [playDropDownSound] = useSound('/assets/sfx/swipe-down.mp3');
  const [playHitFloorSound] = useSound('/assets/sfx/hit-floor.mp3');
  const [playHitWallSound] = useSound('/assets/sfx/hit-wall.mp3');
  const [playMusic, { stop }] = useSound('/assets/sfx/music.mp3', {
    volume: 0.4
  });
  const [playRotateSound] = useSound('/assets/sfx/rotate.mp3', {
    volume: 0.4
  });
  const [playRemoveLineSound] = useSound('/assets/sfx/remove1.mp3');
  const [playYouLoseSound] = useSound('/assets/sfx/you-lose.mp3');
  const [playYouWinSound] = useSound('/assets/sfx/you-win.mp3');
  const navigate = useNavigate();

  const levelSpeed = (): number => {
    return Math.max(SPEED_FACTOR - level * LEVEL_FACTOR, LEVEL_FACTOR);
  };

  useEffect(() => {
    document.querySelector('section')?.focus();
  }, []);

  useEffect(() => {
    playMusic();

    return () => {
      stop();
    };
  }, [playMusic]);

  useEffect(() => {
    if (state.trial && blocksPlayed > TRIAL_BLOCKS) progressTrial();
  }, [blocksPlayed]);

  useEffect(() => {
    if (downPressState) {
      if (state.startScreen) {
        play();
        return;
      }
      moveMaxDown();
    }
  }, [downPressState]);

  useEffect(() => {
    if (rotatePressState) {
      playRotateSound();
      rotatePlayer(stage, 1);
    }
  }, [rotatePressState]);

  useEffect(() => {
    if (
      state.trial &&
      state.trialStage > TRIAL_PLAY &&
      state.trialStage <= TRIAL_END
    ) {
      setTimeout(() => {
        progressTrial();
      }, 2000);
    }
  }, [state.trialStage]);

  useEffect(() => {
    if (leftPressState) {
      movePlayer(LEFT);
      setMoveComplete();
    }
    if (rightPressState) {
      movePlayer(RIGHT);
      setMoveComplete();
    }
  }, [leftPressState, rightPressState]);

  useEffect(() => {
    if (state.startScreen) {
      return;
    }

    if (player.collided) {
      setBlocksPlayed(blocksPlayed + 1);
      if (player.position.y < 0) {
        gameOver();
      } else {
        playHitFloorSound();
        generateNextTetromino();
      }
    }
  }, [player.collided]);

  useEffect(() => {
    if (player.position.y + player.tetromino.shape.length > 0) {
      playMoveBlockSound();
    }
  }, [player.position.x]);

  useEffect(() => {
    applyNextTetromino(tetrominos[0]);
  }, [tetrominos]);

  useEffect(() => {
    setDropSpeed(levelSpeed);
  }, [level]);

  useEffect(() => {
    if (rowsCleared.length > 0) {
      playRemoveLineSound();
    }
  }, [rowsCleared]);

  useInterval(() => {
    if (!state.gameOver || !player.collided) {
      drop();
    }
  }, dropSpeed);

  const movePlayer = (dir: number): void => {
    if (state.gameOver) {
      return;
    }

    if (
      !canMove(player, {
        ...player.position,
        x: player.position.x + dir
      })
    ) {
      playHitWallSound();
      return;
    }

    if (
      detectCollision(player, stage, {
        ...player.position,
        x: player.position.x + dir
      })
    ) {
      return;
    }

    updatePlayerPosition(player.position.x + dir, player.position.y, false);
  };

  const tapped = (): void => {
    if (state.startScreen) {
      play();
      return;
    }

    if (state.gameOver) {
      return;
    }

    playRotateSound();
    rotatePlayer(stage, 1);
  };

  const moveMaxDown = (): void => {
    if (
      state.gameOver ||
      state.startScreen ||
      (state.trial && state.trialStage != TRIAL_PLAY)
    ) {
      return;
    }

    const row = calculateLandingRow(player, stage);
    updatePlayerPosition(player.position.x, row, true);
    playDropDownSound();
  };

  const drop = (): void => {
    if (
      state.gameOver ||
      state.startScreen ||
      (state.trial && state.trialStage != TRIAL_PLAY)
    ) {
      return;
    }

    const didCollide = detectCollision(player, stage, {
      ...player.position,
      y: player.position.y + 1
    });

    updatePlayerPosition(
      player.position.x,
      player.position.y + (didCollide ? 0 : 1),
      didCollide
    );
  };

  const play = (): void => {
    stop();
    generateNextTetromino();
    resetGame();
    setStage(createStage());
    setState({
      ...state,
      trial: false,
      trialStage: 0,
      gameOver: false,
      startScreen: false
    });
    setGamesPlayed(gamesPlayed + 1);
    setBlocksPlayed(1);

    document.querySelector('section')?.focus();
  };

  const gameOver = (): void => {
    setState({
      ...state,
      gameOver: true,
      startScreen: false
    });
    gameDispatch({
      type: GameStateActionType.ScoreReady,
      payload: {
        storableScore
      }
    });
    resetTetrominos();

    if (newHighScore) {
      playYouWinSound();
    } else {
      playYouLoseSound();
    }
  };

  const progressTrial = (): void => {
    setState({
      ...state,
      startScreen: false,
      gameOver: false,
      trial: true,
      trialStage: state.trialStage + 1
    });

    if (state.trialStage === 2) {
      stop();
    }

    if (state.trialStage == TRIAL_PLAY) {
      generateNextTetromino();
      resetGame();
      resetTetrominos();
      setStage(createStage());
    }

    if (state.trialStage >= 5) {
      play();
    }
  };

  const returnHome = (): void => {
    setState({
      ...state,
      gameOver: false,
      startScreen: true,
      trial: false
    });
    playMusic();
    resetGame();
    setStage(createStage());
    setGamesPlayed(0);
    setBlocksPlayed(1);
  };

  const swipeStart = (event: any): void => {
    const touch = event.changedTouches[0];
    setTouchPosition({ x: 0, y: 0 });
    setTouchStartPosition({
      x: touch.clientX,
      y: touch.clientY,
      timeStamp: event.timeStamp
    });
  };

  const swipeMove = (position: SwipePosition): void => {
    if (state.gameOver || state.startScreen) {
      return;
    }

    const delta = {
      x: touchPosition.x - position.x,
      y: touchPosition.y - position.y
    };

    if (Math.abs(delta.x) > BLOCK_SIZE) {
      setTouchPosition({ ...position });
      if (position.x > touchPosition.x) {
        movePlayer(RIGHT);
      }
      if (position.x < touchPosition.x) {
        movePlayer(LEFT);
      }
    }
  };

  const swipeEnd = (event: any): void => {
    const touch = event.changedTouches[0];
    const delta = {
      x: touch.clientX - touchStartPosition.x,
      y: touch.clientY - touchStartPosition.y,
      timeStamp: event.timeStamp - touchStartPosition.timeStamp,
      velocity:
        (touch.clientY - touchStartPosition.y) /
        (event.timeStamp - touchStartPosition.timeStamp + 1)
    };

    const axis = {
      x: Math.abs(delta.x),
      y: Math.abs(delta.y)
    };

    if (axis.x < TAP_MOVE_DIST_MAX && axis.y < TAP_MOVE_DIST_MAX) {
      tapped();
      return;
    }

    if (
      axis.y / (axis.x + 1) > SWIPE_DOWN_ANGLE &&
      axis.y > SWIPE_DOWN_DIST_MIN
    ) {
      moveMaxDown();
    }
  };

  const header = state.trial ? (
    <div className={css.TrialCounter}>
      {'Prøverunde - Brikke ' + blocksPlayed + ' av ' + TRIAL_BLOCKS}
    </div>
  ) : (
    <div className={css.alignTop}>
      <div>
        <Display
          content={'Rader: ' + rows}
          style={{ backgroundColor: '#29cff5' }}
        />
        <Display
          content={'Nivå: ' + level}
          style={{ backgroundColor: '#49bca1' }}
        />
      </div>
      <ComputasLogo className={css.ComputasLogo} />
      <div>
        <Display
          content={'Høyeste poeng: ' + highScore}
          style={{ backgroundColor: '#ff5f63' }}
        />
        <Display
          content={'Poeng: ' + score}
          style={{ backgroundColor: '#fed546' }}
        />
      </div>
    </div>
  );

  return (
    <>
      {header}
      <StartScreen
        startScreen={state.startScreen}
        showHighScores={() => {
          navigate('/highscores');
        }}
        startTrial={progressTrial}
      />
      <TrialScreen
        trial={state.trial}
        trialStage={state.trialStage}
        progressTrial={progressTrial}
        play={play}
      />
      <Swipe
        className={css.Tetris}
        onSwipeStart={swipeStart}
        onSwipeMove={swipeMove}
        onSwipeEnd={swipeEnd}
      >
        <section
          className={css.Board}
          onKeyDown={(event) => handleKeyPressed(event, state)}
          onKeyUp={(event) => handleKeyReleased(event, state)}
          tabIndex={0}
          onContextMenu={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          <section>
            <Stage stage={stage} />
            <GameOver
              gameOver={state.gameOver && gamesPlayed > 0}
              score={score}
              restart={returnHome}
            />
            <Next tetromino={tetrominos[1]} />
            <aside>
              <TetrisVertical className={css.VerticalTetrisLogo} />
            </aside>
          </section>
        </section>
      </Swipe>
    </>
  );
}
