import cryptoJs from 'crypto-js';
import React, { createContext, useEffect, useState } from 'react';
import { generateTodaysWord, generateWordSet } from './Words';

const initialState = {
  board: [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ],
  currAttempt: { attempt: 0, letterPos: 0 },
  disabledLetters: [],
  correctWord: '',
  clicked: false,
  restart: false,
  gameOver: {
    gameOver: false,
    guessedWord: false,
  },
};

const encrypt = (content, password) =>
  typeof content === 'object'
    ? cryptoJs.AES.encrypt(JSON.stringify({ content }), password).toString()
    : cryptoJs.AES.encrypt(content, password).toString();

const decrypt = (crypted, password) =>
  typeof content === 'object'
    ? JSON.parse(
        cryptoJs.AES.decrypt(crypted, password, {
          mode: cryptoJs.mode.CBC,
          padding: cryptoJs.pad.Pkcs7,
        }).toString(cryptoJs.enc.Utf8)
      ).content
    : cryptoJs.AES.decrypt(crypted, password, {
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7,
      }).toString(cryptoJs.enc.Utf8);
export const AppContext = createContext(initialState);

export const AppContextProvider = (props) => {
  const [board, setBoard] = useState(initialState.board);
  const [currAttempt, setCurrAttempt] = useState(initialState.currAttempt);

  const [disabledLetters, setDisabledLetters] = useState(
    initialState.disabledLetters
  );
  const [correctWord, setCorrectWord] = useState(initialState.correctWord);

  const [clicked, setClicked] = useState(initialState.clicked);

  const [restart, setRestart] = useState(initialState.restart);

  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });

  const [wordSet, setWordSet] = useState(new Set());

  useEffect(() => {
    async function getSet() {
      const wordSet = await generateWordSet();
      setWordSet(wordSet);
      if (window.sessionStorage.getItem('correctWord')) {
        const todaysWord = window.sessionStorage.getItem('correctWord');
        const decrypted = decrypt(todaysWord, 'CorrectWordSecret');

        setCorrectWord(decrypted);
      } else {
        const todaysWord = generateTodaysWord(wordSet);
        setCorrectWord(todaysWord);

        const encrypted = encrypt(todaysWord, 'CorrectWordSecret');

        window.sessionStorage.setItem('correctWord', encrypted);
      }
    }

    getSet();
  }, []);
  console.log('CorrectWord', correctWord);

  useEffect(() => {
    if (
      window.sessionStorage.getItem('Board') &&
      window.sessionStorage.getItem('GameInfo') &&
      window.sessionStorage.getItem('GameStatus')
    ) {
      const gameInfo = JSON.parse(
        decrypt(window.sessionStorage.getItem('GameInfo'), 'SecretGameInfo')
      ).content;
      setCurrAttempt(gameInfo);

      const gameStatus = JSON.parse(
        decrypt(window.sessionStorage.getItem('GameStatus'), 'SecretGameStatus')
      ).content;
      setGameOver(gameStatus);

      const boardData = JSON.parse(
        decrypt(window.sessionStorage.getItem('Board'), 'SecretBoard')
      ).content;
      setBoard(boardData);
    } else {
      const encBoard = encrypt(board, 'SecretBoard');
      window.sessionStorage.setItem('Board', encBoard);

      const encGameInfo = encrypt(currAttempt, 'SecretGameInfo');
      window.sessionStorage.setItem('GameInfo', encGameInfo);

      const encGameStatus = encrypt(
        { gameOver: false, guessedWord: false },
        'SecretGameStatus'
      );
      window.sessionStorage.setItem('GameStatus', encGameStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRestart = () => {
    if (gameOver.gameOver || gameOver.guessedWord) {
      setCurrAttempt({ attempt: 0, letterPos: 0 });
      const encGameInfo = encrypt(currAttempt, 'SecretGameInfo');

      window.sessionStorage.setItem('GameInfo', encGameInfo);

      setBoard([
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ]);

      const encBoard = encrypt(board, 'SecretBoard');
      window.sessionStorage.setItem('Board', encBoard);

      setDisabledLetters([]);
      const todaysWord = generateTodaysWord(wordSet);
      setCorrectWord(todaysWord);

      const encrypted = encrypt(todaysWord, 'CorrectWordSecret');

      window.sessionStorage.setItem('correctWord', encrypted);
      setGameOver({ gameOver: false, guessedWord: false });
      const encGameStatus = encrypt(
        { gameOver: false, guessedWord: false },
        'SecretGameStatus'
      );
      window.sessionStorage.setItem('GameStatus', encGameStatus);

      setRestart(true);
    }
  };

  const onSelectLetter = (keyVal) => {
    if (currAttempt.letterPos > 4) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
    setBoard(newBoard);
    const encBoard = encrypt(board, 'SecretBoard');

    window.sessionStorage.setItem('Board', encBoard);

    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 });

    const encGameInfo = encrypt(
      { ...currAttempt, letterPos: currAttempt.letterPos + 1 },
      'SecretGameInfo'
    );
    window.sessionStorage.setItem('GameInfo', encGameInfo);

    setClicked(!clicked);
  };
  const onDelete = () => {
    if (currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = '';
    setBoard(newBoard);

    const encBoard = encrypt(board, 'SecretBoard');
    window.sessionStorage.setItem('Board', encBoard);

    setCurrAttempt({
      ...currAttempt,
      letterPos: currAttempt.letterPos - 1,
    });

    const encGameInfo = encrypt(
      {
        ...currAttempt,
        letterPos: currAttempt.letterPos - 1,
      },
      'SecretGameInfo'
    );

    window.sessionStorage.setItem('GameInfo', encGameInfo);

    setClicked(!clicked);
  };

  const onEnter = () => {
    if (currAttempt.letterPos < 4) return;
    let currWord = '';

    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLocaleLowerCase())) {
      const encGameInfo = encrypt(
        { attempt: currAttempt.attempt + 1, letterPos: 0 },
        'SecretGameInfo'
      );

      window.sessionStorage.setItem('GameInfo', encGameInfo);
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
    } else {
      alert('Word not found');
    }

    if (currWord.toLowerCase() === correctWord.toLowerCase()) {
      setGameOver({
        gameOver: true,
        guessedWord: true,
      });

      const encGameStatus = encrypt(
        {
          gameOver: (gameOver.gameOver = true),
          guessedWord: (gameOver.guessedWord = true),
        },
        'SecretGameStatus'
      );
      window.sessionStorage.setItem('GameStatus', encGameStatus);
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: (gameOver.gameOver = true), guessedWord: false });
      const encGameStatus = encrypt(
        { gameOver: (gameOver.gameOver = true), guessedWord: false },
        'SecretGameStatus'
      );
      window.sessionStorage.setItem('GameStatus', encGameStatus);
    }
  };

  return (
    <AppContext.Provider
      value={{
        board,
        setBoard,
        currAttempt,
        setCurrAttempt,
        disabledLetters,
        setDisabledLetters,
        correctWord,
        setCorrectWord,
        restart,
        setRestart,
        gameOver,
        setGameOver,
        onEnter,
        onDelete,
        onSelectLetter,
        onRestart,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
