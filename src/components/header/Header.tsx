import React, { ReactElement, useContext } from 'react';

import css from './Header.module.scss';
import Display from '../display/Display';
import { GameStateContext } from '../../contexts/GameStateContext';
import { ReactComponent as ComputasLogo } from '../../svg/computas.svg';

interface HeaderProps {
  highScore: number;
}

const Header = (props: HeaderProps): ReactElement => {
  const { gameState } = useContext(GameStateContext);
  const { highScore } = props;

  return (
    <div className={css.Header}>
      <div>
        <Display
          content={'Rader: ' + gameState.storableScore.rows}
          style={{ backgroundColor: '#29cff5' }}
        />
        <Display
          content={'Nivå: ' + gameState.storableScore.level}
          style={{ backgroundColor: '#49bca1' }}
        />
      </div>
      <ComputasLogo className={css.ComputasLogo} />
      <div>
        <Display
          content={'Høyeste poeng: ' + highScore}
          style={{ backgroundColor: '#ff5f63' }}
        />
        <Display
          content={'Poeng: ' + gameState.storableScore.score}
          style={{ backgroundColor: '#fed546' }}
        />
      </div>
    </div>
  );
};

export default Header;
