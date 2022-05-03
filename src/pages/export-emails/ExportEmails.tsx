import React, { ReactElement, useContext, useEffect } from 'react';

import css from './ExportEmails.module.scss';
import { fetchRealTimeScoreList } from '../../helpers';
import { GameStateActionType } from '../../enums/GameStateActionTypes';
import { GameStateContext } from '../../contexts/GameStateContext';

const ExportEmails = (): ReactElement => {
  const { gameState, gameDispatch } = useContext(GameStateContext);

  useEffect(() => {
    gameDispatch({
      type: GameStateActionType.ResetScoreList
    });

    const unsubscribe = fetchRealTimeScoreList(gameDispatch);

    return () => {
      unsubscribe();
    };
  }, []);

  const renderEmailList = (): ReactElement => {
    return (
      <>
        {gameState.scoreList.map((entry, index) => (
          <tr key={index}>
            <td>{entry.name}</td>
            <td>{entry.email}</td>
            <td>{entry.subscribe ? '*' : null}</td>
            <td>{entry.email2}</td>
            <td>{entry.subscribe2 ? '*' : null}</td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className={css.ExportEmails}>
      <table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>E-post, spiller 1</th>
            <th>Nyhetsbrev</th>
            <th>E-post, spiller 2</th>
            <th>Nyhetsbrev</th>
          </tr>
        </thead>
        <tbody>{renderEmailList()}</tbody>
      </table>
    </div>
  );
};

export default ExportEmails;
