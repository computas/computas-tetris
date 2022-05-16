import React, { useContext, useEffect, useRef, useState } from 'react';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import useSound from 'use-sound';

import css from './Tetris.module.scss';
import CountDownOverlay from '../countdown/CountDownOverlay';
import GameOver from 'components/gameover/GameOver';
import Header from '../header/Header';
import Next from 'components/next/Next';
import Stage from 'components/stage/Stage';
import StartScreen from 'components/startscreen/StartScreen';
import TrialScreen, {
  TRIAL_END,
  TRIAL_PLAY
} from 'components/trial/TrialScreen';
import {
  calculateLandingRow,
  canMove,
  createStage,
  detectCollision
} from 'helpers';
import { CollisionType } from '../../enums/CollisionTypes';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';
import { ReactComponent as TetrisVertical } from '../../svg/tetrisVertical.svg';
import {
  useController,
  useGameStatus,
  useInterval,
  usePlayer,
  useStage
} from 'hooks';

export interface GameState {
  countdown: number;
  dropSpeed: number;
  gameOver: boolean;
  startScreen: boolean;
  trial: boolean;
  trialStage: number;
}

const initialGameState: GameState = {
  countdown: 0,
  dropSpeed: 500,
  gameOver: false,
  startScreen: true,
  trial: false,
  trialStage: 0
};

let BLOCK_SIZE = 47;
const LEFT = -1;
const RIGHT = 1;
const SWIPE_DOWN_ANGLE = 3.0;
const SWIPE_DOWN_DIST_MIN = 80;
const TAP_MOVE_DIST_MAX = 8;
const COUNTDOWN_TIME = 3;

export default function Tetris() {
  const { gameState, gameDispatch } = useContext(GameStateContext);
  const { gameSettings } = useContext(GameSettingsContext);
  const [state, setState] = useState(initialGameState);
  const [touchStartPosition, setTouchStartPosition] = useState({
    x: 0,
    y: 0,
    timeStamp: 0
  });
  const [blockSwipes, setBlockSwipes] = useState(0);
  const [player, updatePlayerPosition, rotatePlayer, applyNextTetromino] =
    usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player);
  const [
    highScore,
    newHighScore,
    tetrominos,
    resetGame,
    resetTetrominos,
    generateNextTetromino
  ] = useGameStatus(rowsCleared);
  const [dropSpeed, setDropSpeed] = useState(0);
  const [blocksPlayed, setBlocksPlayed] = useState(1);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [isWallHit, setIsWallHit] = useState(false);
  const [
    leftPressState,
    rightPressState,
    downPressState,
    rotatePressState,
    handleKeyPressed,
    handleKeyReleased,
    setMoveComplete
  ] = useController();
  const swipeHandlers = useSwipeable({
    onSwipeStart: (e) => {
      swipeStart(e.event);
    },
    onSwiping: (e) => {
      swipeMove(e);
    },
    onSwiped: (e) => {
      swipeEnd(e.event);
    },
    onTap: () => {
      tapped();
    }
  });
  const myRef = useRef();

  const refPassThrough = (el: any) => {
    swipeHandlers.ref(el);
    myRef.current = el;
  };

  const [playMoveBlockSound] = useSound('/assets/sfx/move.mp3');
  const [playDropDownSound] = useSound('/assets/sfx/swipe-down.mp3');
  const [playHitFloorSound] = useSound('/assets/sfx/hit-floor.mp3');
  const [playHitWallSound] = useSound('/assets/sfx/hit-wall.mp3');
  const [playMusic, { stop }] = useSound('/assets/sfx/music.mp3', {
    volume: 0.4,
    interrupt: false
  });
  const [playRotateSound] = useSound('/assets/sfx/rotate.mp3', {
    volume: 0.4
  });
  const [playRemoveRowSound] = useSound('/assets/sfx/remove1.mp3');
  const [playYouLoseSound] = useSound('/assets/sfx/you-lose.mp3');
  const [playYouWinSound] = useSound('/assets/sfx/you-win.mp3');
  const navigate = useNavigate();

  const calculateSpeed = (): number => {
    const tetrominoFactor =
      Math.floor(
        (gameState.storableScore.tetrominoCount - 1) /
          gameSettings.increaseSpeedOnEvery
      ) * gameSettings.increaseSpeedFactor;
    return Math.max(
      gameSettings.initialSpeed - tetrominoFactor,
      gameSettings.minimumSpeed
    );
  };

  useEffect(() => {
    document.querySelector('section')?.focus();
  }, []);

  useEffect(() => {
    if (gameSettings.playMusic) {
      gameDispatch({ type: GameStateActionType.PlayMusic });
    } else {
      gameDispatch({ type: GameStateActionType.StopMusic });
    }

    return () => {
      stop();
    };
  }, [gameSettings.playMusic]);

  useEffect(() => {
    if (state.trial && blocksPlayed > gameSettings.trialTetrominos.length)
      progressTrial();
  }, [blocksPlayed]);

  useEffect(() => {
    if (downPressState) {
      if (state.startScreen || state.countdown) {
        return;
      }
      moveMaxDown();
    }
  }, [downPressState]);

  useEffect(() => {
    if (rotatePressState && !state.countdown) {
      playRotateSound();
      rotatePlayer(stage, 1);
    }
  }, [rotatePressState]);

  useEffect(() => {
    if (state.countdown > 0) {
      setTimeout(() => {
        if (state.countdown === 1) {
          generateNextTetromino(state.trial);
        }
        setState({
          ...state,
          countdown: state.countdown - 1
        });
      }, 1000);
    }

    const cell = document.querySelector('.Cell') as HTMLDivElement;
    BLOCK_SIZE = cell.offsetWidth;
  }, [state.countdown]);

  useEffect(() => {
    if (leftPressState && !state.countdown) {
      movePlayer(LEFT);
      setMoveComplete();
    }
    if (rightPressState && !state.countdown) {
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
        generateNextTetromino(state.trial);
      }
    }
  }, [player.collided]);

  useEffect(() => {
    if (player.position.y + player.tetromino.shape.length > 0) {
      playMoveBlockSound();
    }
  }, [player.position.x]);

  useEffect(() => {
    if (isWallHit) {
      playHitWallSound();
    }
  }, [isWallHit]);

  useEffect(() => {
    if (
      state.trial &&
      state.trialStage > TRIAL_PLAY &&
      state.trialStage <= TRIAL_END
    ) {
      setTimeout(() => {
        progressTrial();
      }, 1000);
    }
  }, [state.trialStage]);

  useEffect(() => {
    applyNextTetromino(tetrominos[0]);
  }, [tetrominos]);

  useEffect(() => {
    setDropSpeed(calculateSpeed);
  }, [gameState.storableScore.tetrominoCount, gameSettings]);

  useEffect(() => {
    if (rowsCleared.length > 0) {
      playRemoveRowSound();
    }
  }, [rowsCleared]);

  useEffect(() => {
    gameSettings.playMusic && gameState.music ? playMusic() : stop();
  }, [gameState.music, gameSettings.playMusic]);

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
      setIsWallHit(true);
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

    setIsWallHit(false);
    updatePlayerPosition(player.position.x + dir, player.position.y, false);
  };

  const tapped = (): void => {
    if (state.startScreen || state.gameOver || state.countdown > 0) {
      return;
    }

    playRotateSound();
    rotatePlayer(stage, 1);
  };

  const moveMaxDown = (): void => {
    if (
      state.gameOver ||
      state.startScreen ||
      (state.trial && state.trialStage !== TRIAL_PLAY)
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
      state.countdown > 0 ||
      (state.trial && state.trialStage !== TRIAL_PLAY)
    ) {
      return;
    }

    const didCollide = detectCollision(player, stage, {
      ...player.position,
      y: player.position.y + 1
    });

    updatePlayerPosition(
      player.position.x,
      player.position.y + (didCollide !== CollisionType.None ? 0 : 1),
      didCollide !== CollisionType.None
    );
  };

  const gameOver = (): void => {
    setState({
      ...state,
      gameOver: true,
      startScreen: false
    });
    gameDispatch({
      type: GameStateActionType.GameOver
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
      gameDispatch({ type: GameStateActionType.StopMusic });
    }

    if (state.trial && state.trialStage === 1) {
      resetGame(state.trial);
      setStage(createStage());
    }

    if (state.trialStage >= 5) {
      startCountdown();
    }
  };

  const startCountdown = (): void => {
    setState({
      ...state,
      trial: false,
      trialStage: 0,
      gameOver: false,
      startScreen: false,
      countdown: COUNTDOWN_TIME
    });
    resetGame();
    setBlocksPlayed(1);
    setStage(createStage());
    setGamesPlayed(gamesPlayed + 1);

    document.querySelector('section')?.focus();
  };

  const returnHome = (): void => {
    setState({
      ...state,
      gameOver: false,
      startScreen: true,
      trial: false,
      trialStage: 0
    });
    setStage(createStage());
    setGamesPlayed(0);
    setBlocksPlayed(1);
  };

  const swipeStart = (event: any): void => {
    const touch = event.changedTouches[0];
    setBlockSwipes(0);
    setTouchStartPosition({
      x: touch.clientX,
      y: touch.clientY,
      timeStamp: event.timeStamp
    });
  };

  const swipeMove = (event: SwipeEventData): void => {
    if (state.gameOver || state.startScreen) {
      return;
    }

    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
      return;
    }

    if (gameSettings.swipeSingleBlock && hasSwiped) {
      return;
    }

    const newBlockSwipe = Math.floor(
      (event.deltaX * gameSettings.swipeSensitivity) / BLOCK_SIZE
    );

    if (newBlockSwipe !== blockSwipes) {
      if (newBlockSwipe > blockSwipes) {
        movePlayer(RIGHT);
      }
      if (newBlockSwipe < blockSwipes) {
        movePlayer(LEFT);
      }
      setBlockSwipes(newBlockSwipe);
      setHasSwiped(true);
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

    setBlockSwipes(0);
    setHasSwiped(false);

    const axis = {
      x: Math.abs(delta.x),
      y: Math.abs(delta.y)
    };

    if (axis.x < TAP_MOVE_DIST_MAX && axis.y < TAP_MOVE_DIST_MAX) {
      return;
    }

    if (
      delta.y > 0 &&
      axis.y / (axis.x + 1) > SWIPE_DOWN_ANGLE &&
      axis.y > SWIPE_DOWN_DIST_MIN
    ) {
      moveMaxDown();
    }
  };

  const header = state.trial ? (
    <div className={css.TrialCounter}>
      {'Prøverunde - Brikke ' +
        blocksPlayed +
        ' av ' +
        gameSettings.trialTetrominos.length}
    </div>
  ) : (
    <Header highScore={highScore} />
  );

  return (
    <div className={css.mainScreen}>
      {header}
      <StartScreen
        startScreen={state.startScreen}
        showHighScores={() => {
          navigate('/highscores');
        }}
        startTrial={progressTrial}
      />
      <TrialScreen
        play={startCountdown}
        progressTrial={progressTrial}
        restart={returnHome}
        trial={state.trial}
        trialStage={state.trialStage}
      />
      <CountDownOverlay current={state.countdown} />
      <GameOver
        gameOver={state.gameOver && gamesPlayed > 0}
        restart={returnHome}
      />
      <div className={css.Tetris} ref={refPassThrough}>
        <div className={css.SwipeHandler} {...swipeHandlers}></div>
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
            <aside>
              <Next tetromino={tetrominos[1]} />
              <TetrisVertical className={css.VerticalTetrisLogo} />
            </aside>
          </section>
        </section>
      </div>
    </div>
  );
}
