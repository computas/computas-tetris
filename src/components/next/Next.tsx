import classNames from 'classnames';
import React, { ReactElement, useContext } from 'react';

import css from './Next.module.scss';
import Cell from 'components/cell/Cell';
import { GameSettingsContext } from '../../contexts/GameSettingsContext';
import { Tetromino } from '../../helpers';

interface NextProps {
  tetromino: Tetromino;
}

const Next = (props: NextProps): ReactElement => {
  const { tetromino } = props;
  const { gameSettings } = useContext(GameSettingsContext);

  const renderTetromino = (): ReactElement => {
    const renderStage = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[0].length; x++) {
        const pixel = tetromino.shape[y][x];
        if (!pixel) {
          continue;
        }

        renderStage[y][x] = tetromino.color;
      }
    }

    return (
      <div className={css.tetromino}>
        {renderStage.map((row, index) => (
          <div key={'p' + index} className={css.row}>
            {row.map((cell, n) => (
              <Cell key={'c' + index + '_' + n} color={cell} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={classNames(
        css.Next,
        gameSettings.showNext ? null : css.hidden
      )}
    >
      <span>Neste:</span>
      {renderTetromino()}
    </div>
  );
};

export default Next;
