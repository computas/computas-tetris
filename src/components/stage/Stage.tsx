import React from 'react';

import './Stage.scss';
import CellView from 'components/cell/CellView';
import { GameBoard } from 'helpers/gameHelpers';

export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export default function Stage(props: { stage: GameBoard }) {
  const { stage } = props;

  return (
    <div className={'Stage'}>
      {stage.rows.map((row, rowIndex) => (
        <div key={'r-' + rowIndex} className="Row">
          {row.cells.map((cell, cellIndex) => (
            <CellView key={'cl-' + rowIndex + '-' + cellIndex} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}
