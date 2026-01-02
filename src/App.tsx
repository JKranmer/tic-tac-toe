import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { WinnerModal } from './components/WinnerModal';

function App() {
  const { squares, xIsNext, winner, winningLine, scores, resetGame, handleSquareClick, resetScores } = useGame();

  const gameEnded = Boolean(winner);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 tracking-tight">
        Tic-Tac-Toe
      </h1>

      <GameInfo xIsNext={xIsNext} scores={scores} />

      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
        winningLine={winningLine}
        xIsNext={xIsNext}
        gameEnded={gameEnded}
      />

      <div className="mt-8 flex gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors shadow-md"
        >
          Reset Board
        </button>
        <button
          onClick={resetScores}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg font-semibold transition-colors shadow-md"
        >
          Reset Scores
        </button>
      </div>

      <WinnerModal winner={winner} onReset={resetGame} />
    </div>
  );
}

export default App;
