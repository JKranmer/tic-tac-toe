import { useGame, type GameMode } from './hooks/useGame';
import { useUltimateGame } from './hooks/useUltimateGame';
import { Board } from './components/Board';
import { UltimateBoard } from './components/UltimateBoard';
import { GameInfo } from './components/GameInfo';
import { WinnerModal } from './components/WinnerModal';
import { useState } from 'react';
import clsx from 'clsx';
import { ThemeSettings } from './components/ThemeSettings';

function App() {
  const { squares, xIsNext, winner, winningLine, scores, resetGame, handleSquareClick, resetScores, nextToRemove, gameMode, setGameMode } = useGame();
  const ultimateGame = useUltimateGame();
  const [showHints, setShowHints] = useState(true);



  // Derived state based on active mode
  const currentXIsNext = gameMode === 'ultimate' ? ultimateGame.xIsNext : xIsNext;
  const currentScores = gameMode === 'ultimate' ? ultimateGame.scores : scores;
  const currentWinner = gameMode === 'ultimate' ? ultimateGame.winner : winner;
  const gameEnded = Boolean(currentWinner);

  const handleModeSwitch = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'ultimate') {
      ultimateGame.resetGame();
    }
    // classic/infinite are reset internally by setGameMode in useGame
  };

  const handleResetGame = () => {
    if (gameMode === 'ultimate') {
      ultimateGame.resetGame();
    } else {
      resetGame();
    }
  };

  const handleResetScores = () => {
    if (gameMode === 'ultimate') {
      ultimateGame.resetScores();
    } else {
      resetScores();
    }
  };

  return (
    <div className="w-full h-full bg-page text-primary flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-500">
      <ThemeSettings />
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 tracking-tight">
        Tic-Tac-Toe
      </h1>

      {/* Game Mode Selector */}
      <div className="bg-surface/50 p-1 rounded-lg flex mb-6 flex-wrap justify-center gap-1 border border-border">
        {(['classic', 'infinite', 'ultimate'] as GameMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeSwitch(mode)}
            className={clsx(
              "px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base",
              gameMode === mode
                ? "bg-surface text-primary shadow-sm border border-border"
                : "text-secondary hover:text-primary hover:bg-surface/50"
            )}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
          </button>
        ))}
      </div>

      <GameInfo xIsNext={currentXIsNext} scores={currentScores} />

      {gameMode === 'ultimate' ? (
        <UltimateBoard
          localBoards={ultimateGame.localBoards}
          globalGrid={ultimateGame.globalGrid}
          onSquareClick={ultimateGame.handleSquareClick}
          activeQuadrant={ultimateGame.activeQuadrant}
          gameEnded={gameEnded}
        />
      ) : (
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
          gameEnded={gameEnded}
          nextToRemove={nextToRemove}
          showHints={showHints}
        />
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        {gameMode === 'infinite' && (
          <label className="flex items-center gap-2 cursor-pointer text-secondary hover:text-primary transition-colors">
            <input
              type="checkbox"
              checked={showHints}
              onChange={(e) => setShowHints(e.target.checked)}
              className="w-5 h-5 rounded border-border text-brand focus:ring-brand bg-surface"
            />
            <span className="font-medium select-none">Show Infinite Mode Hints</span>
          </label>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleResetGame}
            className="px-6 py-2 bg-brand hover:bg-brand/90 text-white rounded-lg font-semibold transition-colors shadow-md"
          >
            Reset Board
          </button>
          <button
            onClick={handleResetScores}
            className="px-6 py-2 bg-surface hover:bg-surface/80 border border-border text-primary rounded-lg font-semibold transition-colors shadow-md"
          >
            Reset Scores
          </button>
        </div>
      </div>

      <WinnerModal winner={currentWinner} onReset={handleResetGame} />
    </div>
  );
}

export default App;
