import './App.css';
import { AppContextProvider } from './AppContext';
import Game from './components/Game';

function App() {
  return (
    <div className='App'>
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContextProvider>
        <Game />
      </AppContextProvider>
    </div>
  );
}

export default App;
