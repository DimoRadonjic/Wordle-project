import React, { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import Key from './Key';

const Keyboard = () => {
  const keys1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const keys2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const keys3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const keys = keys1.concat(keys2, keys3);

  const { onDelete, onEnter, onSelectLetter, disabledLetters } =
    useContext(AppContext);

  const handleKeyboard = useCallback(
    (e) => {
      if (e.key.toLowerCase() === 'enter') {
        onEnter();
      } else if (e.key.toLowerCase() === 'backspace') {
        onDelete();
      } else {
        keys.forEach((key) => {
          if (e.key.toLowerCase() === key.toLowerCase()) {
            onSelectLetter(key);
          }
        });
      }
    },
    [keys, onDelete, onEnter, onSelectLetter]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard);
    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [handleKeyboard]);

  return (
    <div className='keyboard' onKeyDown={handleKeyboard}>
      <div className='line1'>
        {keys1.map((key) => (
          <Key keyVal={key} disabled={disabledLetters.includes(key)} />
        ))}
      </div>
      <div className='line2'>
        {keys2.map((key) => (
          <Key keyVal={key} disabled={disabledLetters.includes(key)} />
        ))}
      </div>
      <div className='line3'>
        <Key keyVal={'ENTER'} bigKey={true} />

        {keys3.map((key) => (
          <Key keyVal={key} disabled={disabledLetters.includes(key)} />
        ))}
        <Key keyVal={'DEL'} bigKey={true} />
      </div>
    </div>
  );
};

export default Keyboard;
