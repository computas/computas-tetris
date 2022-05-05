import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import {
  calculateLandingRow,
  createStage,
  GameBoard,
  getTetrominoBB,
  Row
} from 'helpers/gameHelpers';
import { Player } from 'models';
import { STAGE_HEIGHT, STAGE_WIDTH } from 'components/stage/Stage';

const PREVIEW_COLOR_BASE = 200;
const initialStage = createStage();
const initialRows: Row[] = [];

export const useStage = (
  player: Player
): [GameBoard, Dispatch<SetStateAction<GameBoard>>, Row[]] => {
  const [stage, setStage] = useState(initialStage);
  const [rowsCleared, setRowsCleared] = useState(initialRows);

  useEffect(() => {
    setRowsCleared([]);
  }, []);

  useEffect(() => {
    const newStage = { ...stage };

    clearStage(newStage);
    renderDropPreview(player, newStage);
    renderTetromino(player, newStage);

    const removeLines = checkLines(newStage);
    if (removeLines.length) {
      const removed = removeLinesFromStage(newStage, removeLines);
      setRowsCleared(removed);
      highlightRows(newStage, removeLines);
    }

    setStage(newStage);
  }, [player]);

  return [stage, setStage, rowsCleared];
};

const clearStage = (stage: GameBoard): void => {
  for (let y = 0; y < STAGE_HEIGHT; y++) {
    for (let x = 0; x < STAGE_WIDTH; x++) {
      if (stage.rows[y].cells[x].locked) {
        continue;
      }

      stage.rows[y].cells[x].color = 0;
    }
  }
};

const renderTetromino = (player: Player, stage: GameBoard): void => {
  const bb = getTetrominoBB(player.tetromino, { x: 0, y: 0 });
  for (let y = 0; y < player.tetromino.shape.length; y++) {
    for (let x = 0; x < player.tetromino.shape[0].length; x++) {
      const pixel = player.tetromino.shape[y][x];
      if (!pixel) {
        continue;
      }

      const ypos = player.position.y + y - bb[1];
      if (ypos < 0 || ypos >= stage.rows.length) {
        continue;
      }

      stage.rows[ypos].cells[player.position.x + x] = {
        color: pixel !== 0 ? player.tetromino.color : 0,
        locked: player.collided,
        highlight: false
      };
    }
  }
};

const renderDropPreview = (player: Player, stage: GameBoard): void => {
  const landingAt = calculateLandingRow(player, stage);

  if (landingAt < 0) {
    return;
  }

  let y = 0;
  for (let ty = 0; ty < player.tetromino.shape.length; ty++) {
    if (
      player.tetromino.shape[ty].filter((pixel: number) => pixel !== 0)
        .length === 0
    ) {
      continue;
    }

    for (let x = 0; x < player.tetromino.shape[0].length; x++) {
      const pixel = player.tetromino.shape[ty][x];
      if (!pixel) {
        continue;
      }

      const cell = stage.rows[landingAt + y].cells[player.position.x + x];
      if (cell.locked) {
        continue;
      }

      stage.rows[landingAt + y].cells[player.position.x + x] = {
        ...cell,
        color: pixel !== 0 ? player.tetromino.color + PREVIEW_COLOR_BASE : 0
      };
    }

    y++;
  }
};

const checkLines = (stage: GameBoard): number[] => {
  const rowsToRemove: number[] = [];

  for (let y = 0; y < STAGE_HEIGHT; y++) {
    const row = stage.rows[y];
    if (row.cells.findIndex((cell) => !cell.locked) === -1) {
      rowsToRemove.push(y);
    }
  }

  return rowsToRemove;
};

const removeLinesFromStage = (
  stage: GameBoard,
  removeLines: number[]
): Row[] => {
  const rows: Row[] = [];
  const removed: Row[] = [];
  for (let y = 0; y < STAGE_HEIGHT; y++) {
    const row = stage.rows[y];
    if (removeLines.indexOf(y) !== -1) {
      rows.unshift(generateEmptyRow());
      removed.push(row);
    } else {
      rows.push(row);
    }
  }

  stage.rows = rows;

  return removed;
};

const highlightRows = (stage: GameBoard, highlightLines: number[]): void => {
  stage.rows.forEach((row, line) => {
    if (highlightLines.indexOf(line) !== -1) {
      row.cells.forEach((cell) => {
        cell.highlight = true;
      });
    }
  });
};

const generateEmptyRow = (): Row => {
  const newRow: Row = { cells: [] };
  for (let x = 0; x < STAGE_WIDTH; x++) {
    newRow.cells.push({ color: 0, locked: false, highlight: false });
  }
  return newRow;
};
