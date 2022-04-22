import React, { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';

const Letter = ({ letterPos, attemptVal }) => {
  const { board, correctWord, currAttempt, setDisabledLetters } =
    useContext(AppContext);
  const letter = board[attemptVal][letterPos];

  const correct =
    correctWord[letterPos]?.toLowerCase() === letter?.toLowerCase();
  const almost =
    !correct && letter !== '' && correctWord.includes(letter?.toLowerCase());

  const letterState =
    currAttempt.attempt > attemptVal &&
    (correct ? 'correct' : almost ? 'almost' : 'error');

  useEffect(() => {
    if (letter !== '' && !correct && !almost) {
      setDisabledLetters((prev) => [...prev, letter]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currAttempt.attempt]);

  return (
    <div className='letter' id={letterState}>
      {letter}
    </div>
  );
};

export default Letter;
