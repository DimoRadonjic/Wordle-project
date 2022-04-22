import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

const Key = ({ keyVal, bigKey, disabled }) => {
  const { onDelete, onEnter, onSelectLetter } = useContext(AppContext);
  const selectLetter = () => {
    if (keyVal === 'ENTER') {
      onEnter();
    } else if (keyVal === 'DEL') {
      onDelete();
    } else {
      onSelectLetter(keyVal);
    }
  };
  return (
    <div
      className='key'
      id={bigKey ? 'big' : disabled && 'disabled'}
      onClick={selectLetter}
    >
      {keyVal}
    </div>
  );
};

export default Key;
