import React, { ReactElement } from 'react';

import css from './Display.module.scss';

const Display = (props: {
  content: string | number;
  style?: React.CSSProperties;
}): ReactElement => {
  const { content, style } = props;

  return (
    <div className={css.Display} style={style}>
      {content}
    </div>
  );
};

export default Display;
