import wordBank from './wordle-bank.txt';

export const generateWordSet = async () => {
  const res = await fetch(wordBank);
  const resText = await res.text();
  const wordArr = resText.split(/\r?\n/);
  const wordSet = new Set(wordArr);

  return wordSet;
};

export const generateTodaysWord = (wordSet) => {
  const wordArr = [...wordSet];
  const todaysWord = wordArr[Math.floor(Math.random() * wordArr.length)];

  return todaysWord;
};
