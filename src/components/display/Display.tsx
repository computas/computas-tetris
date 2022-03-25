import React, { ReactElement } from 'react';

import css from './Display.module.scss';

const Display = (props: {
  content: string;
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
