import React, { ReactElement } from 'react';

import { ReactComponent as Block0 } from '../../svg/Block.svg';
import { ReactComponent as Block2 } from '../../svg/Block-2.svg';
import { ReactComponent as Block1 } from '../../svg/Block-1.svg';
import { ReactComponent as Block5 } from '../../svg/Block-6.svg';
import { ReactComponent as Block4 } from '../../svg/Block-4.svg';
import { ReactComponent as Block6 } from '../../svg/Block-8.svg';
import { ReactComponent as Block3 } from '../../svg/Block-3.svg';

const RenderTetromino = (props: { id: string }): ReactElement => {
  const { id } = props;

  switch (id) {
    case 'I':
      return <Block0 height={40} />;
    case 'J':
      return <Block2 width={20} height={40} />;
    case 'L':
      return <Block1 width={20} height={40} />;
    case 'O':
      return <Block5 width={20} height={40} />;
    case 'S':
      return <Block4 width={28} height={40} />;
    case 'T':
      return <Block6 width={28} height={40} />;
    case 'Z':
      return <Block3 width={28} height={40} />;
  }

  return <Block0 />;
};

export default RenderTetromino;
