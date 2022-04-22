import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

const GameOver = () => {
  const { gameOver, onRestart, correctWord, currAttempt } =
    useContext(AppContext);

  return (
    <div className='gameOver'>
      <h3>{gameOver.guessedWord ? 'You Correctly Guessed' : 'You failed'}</h3>
      <h1>Correct: {correctWord}</h1>
      {gameOver.guessedWord || gameOver.gameOver ? (
        <h3>
          {' '}
          You{' '}
          {gameOver.gameOver === true && gameOver.guessedWord === false
            ? 'failed to guess '
            : 'guessed '}
          in {currAttempt.attempt}{' '}
          {currAttempt.attempt > 1 ? 'attempts' : 'attempt'}
          <button onClick={onRestart}>'Play Again?'</button>
        </h3>
      ) : (
        ''
      )}
    </div>
  );
};

export default GameOver;
