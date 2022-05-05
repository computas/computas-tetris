import React, { ReactElement } from 'react';

import { Cell } from '../../helpers/gameHelpers';

const CellView = (props: { cell: Cell }): ReactElement => {
  const { cell } = props;

  const restore = (): void => {
    cell.highlight = false;
  };

  return (
    <div
      className="Cell"
      data-color={cell.color}
      data-highlight={cell.highlight}
      onAnimationEnd={restore}
    />
  );
};

export default CellView;
