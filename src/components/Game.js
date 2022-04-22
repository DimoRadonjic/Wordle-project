import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import Board from './Board';
import GameOver from './GameOver';
import Keyboard from './Keyboard';

const Game = () => {
  const { gameOver } = useContext(AppContext);
  return (
    <div className='game'>
      <Board />
      {gameOver.gameOver ? <GameOver /> : <Keyboard />}
    </div>
  );
};

export default Game;
