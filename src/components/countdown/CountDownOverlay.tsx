import React, { ReactElement } from 'react';

import css from './CountDownOverlay.module.scss';

interface CountDownProps {
  current: number;
}

const CountDownOverlay = (props: CountDownProps): ReactElement | null => {
  const { current } = props;

  if (current <= 0) {
    return null;
  }

  return (
    <div className={css.CountDown}>
      <span className={css.countDownText} data-value={current} />
    </div>
  );
};

export default CountDownOverlay;
