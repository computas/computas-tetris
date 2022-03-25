import classnames from 'classnames';
import React, { ReactElement } from 'react';

import css from './Display.module.scss';

const Display = (props: {
  content: string | number | string[];
  style?: React.CSSProperties;
}): ReactElement => {
  const { content, style } = props;

  if (typeof content === typeof []) {
    const parts = content as string[];
    return (
      <div className={classnames(css.Display, css.columned)}>
        {parts.map((part: string, index: number) => (
          <span key={index}>{part}</span>
        ))}
      </div>
    );
  }

  return (
    <div className={css.Display} style={style}>
      {content}
    </div>
  );
};

export default Display;
