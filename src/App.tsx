import { useGame, type GameMode } from './hooks/useGame';
import { useUltimateGame } from './hooks/useUltimateGame';
import { useGobbleGame } from './hooks/useGobbleGame';
import { useBonesGame } from './hooks/useBonesGame';
import { Board } from './components/Board';
import { UltimateBoard } from './components/UltimateBoard';
import { GobbleBoard } from './components/GobbleBoard';
import { BonesBoard } from './components/BonesBoard';
import { Inventory } from './components/Inventory';
import { GameInfo } from './components/GameInfo';
import { WinnerModal } from './components/WinnerModal';
import { useState } from 'react';
import clsx from 'clsx';
import { ThemeSettings } from './components/ThemeSettings';

import { RulesModal } from './components/RulesModal';

function App() {
  const {
    squares,
    xIsNext,
    winner,
    winningLine,
    scores,
    resetGame,
    handleSquareClick,
    resetScores,
    nextToRemove,
    gameMode,
    setGameMode
  } = useGame();
  const ultimateGame = useUltimateGame();
  const gobbleGame = useGobbleGame();
  const bonesGame = useBonesGame();
  const [showHints, setShowHints] = useState(true);
  const [rulesMode, setRulesMode] = useState<GameMode | null>(null);

  // Derived state based on active mode
  let currentXIsNext = xIsNext;
  let currentScores = scores;
  let currentWinner = winner;

  if (gameMode === 'ultimate') {
    currentXIsNext = ultimateGame.xIsNext;
    currentScores = ultimateGame.scores;
    currentWinner = ultimateGame.winner;
  } else if (gameMode === 'gobble') {
    currentXIsNext = gobbleGame.turn === 'X';
    currentScores = gobbleGame.scores;
    currentWinner = gobbleGame.winner;
  } else if (gameMode === 'bones') {
    currentXIsNext = bonesGame.turn === 'X';
    // Use Skull counts as the "Score"
    const xSkulls = bonesGame.skulls.filter((s) => s.owner === 'X').length;
    const oSkulls = bonesGame.skulls.filter((s) => s.owner === 'O').length;
    currentScores = { X: xSkulls, O: oSkulls };
    currentWinner = bonesGame.winner;
  }

  const gameEnded = Boolean(currentWinner);

  const handleModeSwitch = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'ultimate') ultimateGame.resetGame();
    if (mode === 'gobble') gobbleGame.resetGame();
    if (mode === 'bones') bonesGame.resetGame();
    // classic/infinite are reset internally by setGameMode in useGame
  };

  const handleResetGame = () => {
    if (gameMode === 'ultimate') ultimateGame.resetGame();
    else if (gameMode === 'gobble') gobbleGame.resetGame();
    else if (gameMode === 'bones') bonesGame.resetGame();
    else resetGame();
  };

  const handleResetScores = () => {
    if (gameMode === 'ultimate') ultimateGame.resetScores();
    else if (gameMode === 'gobble') gobbleGame.resetScores();
    // else if (gameMode === 'bones') bonesGame.resetScores(); // Hook doesn't have resetScores
    else resetScores();
  };

  return (
    <div className="w-full h-full bg-page text-primary relative overflow-y-auto font-sans transition-colors duration-500">
      <ThemeSettings />
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <main className="min-h-full flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end tracking-tight font-primary">
          Tic-Tac-Toe
        </h1>

        {/* Game Mode Selector */}
        <div className="mb-6 flex flex-wrap justify-center gap-2 bg-surface p-2 rounded-xl shadow-lg border border-border">
          {(['classic', 'infinite', 'ultimate', 'gobble', 'bones'] as GameMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeSwitch(mode)}
              className={clsx(
                'px-4 py-2 rounded-lg font-bold transition-all duration-300',
                gameMode === mode
                  ? 'bg-brand text-white shadow-md scale-105'
                  : 'text-secondary hover:text-primary hover:bg-page'
              )}
              aria-label={`Switch to ${mode} Mode`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Gobble Mode Sub-Selector */}
        {gameMode === 'gobble' && (
          <div className="mb-6 flex items-center justify-center gap-4 bg-surface/50 p-2 rounded-lg border border-border">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Dynamics:</span>
            <button
              onClick={() => {
                gobbleGame.setGobbleMode('quick');
                gobbleGame.resetGame();
              }}
              className={clsx(
                'px-3 py-1 rounded text-sm font-bold transition-colors',
                gobbleGame.gobbleMode === 'quick' ? 'bg-brand/20 text-brand' : 'text-secondary hover:text-primary'
              )}
            >
              Quick (Drop Only)
            </button>
            <div className="w-px h-4 bg-border"></div>
            <button
              onClick={() => {
                gobbleGame.setGobbleMode('classic');
                gobbleGame.resetGame();
              }}
              className={clsx(
                'px-3 py-1 rounded text-sm font-bold transition-colors',
                gobbleGame.gobbleMode === 'classic' ? 'bg-brand/20 text-brand' : 'text-secondary hover:text-primary'
              )}
            >
              Classic (Move & Drop)
            </button>
          </div>
        )}

        <GameInfo xIsNext={currentXIsNext} scores={currentScores} onRulesClick={() => setRulesMode(gameMode)} />

        {/* Game Boards */}
        {gameMode === 'ultimate' ? (
          <UltimateBoard
            localBoards={ultimateGame.localBoards}
            globalGrid={ultimateGame.globalGrid}
            onSquareClick={ultimateGame.handleSquareClick}
            activeQuadrant={ultimateGame.activeQuadrant}
            gameEnded={gameEnded}
          />
        ) : gameMode === 'gobble' ? (
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Player O Inventory (Top) */}
            <Inventory
              player="O"
              inventory={gobbleGame.oInventory}
              isActive={!gameEnded && gobbleGame.turn === 'O'}
              selectedPiece={gobbleGame.selectedPiece}
              onSelect={gobbleGame.handleSelectInventoryPiece}
            />

            <GobbleBoard
              board={gobbleGame.board}
              onSquareClick={gobbleGame.handleBoardClick}
              selectedPiece={gobbleGame.selectedPiece}
              turn={gobbleGame.turn}
              gameEnded={gameEnded}
              winningLine={gobbleGame.winningLine}
            />

            {/* Player X Inventory (Bottom) */}
            <Inventory
              player="X"
              inventory={gobbleGame.xInventory}
              isActive={!gameEnded && gobbleGame.turn === 'X'}
              selectedPiece={gobbleGame.selectedPiece}
              onSelect={gobbleGame.handleSelectInventoryPiece}
            />
          </div>
        ) : gameMode === 'bones' ? (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex justify-between w-full max-w-sm px-4">
              <div
                className={clsx(
                  'text-lg font-bold transition-all',
                  bonesGame.turn === 'X' ? 'text-player-x scale-110' : 'text-secondary'
                )}
              >
                Bones: {bonesGame.inventory.X}
              </div>
              <div
                className={clsx(
                  'text-lg font-bold transition-all',
                  bonesGame.turn === 'O' ? 'text-player-o scale-110' : 'text-secondary'
                )}
              >
                Bones: {bonesGame.inventory.O}
              </div>
            </div>
            <BonesBoard gameState={bonesGame} />
            <div className="text-sm text-secondary text-center max-w-md">
              Form 1x1 squares (Graves) to collect Skulls. Win by aligning 3 Skulls or forming a "Perfect Grave" (4
              bones of your color).
            </div>
          </div>
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
              aria-label="Reset Board"
            >
              Reset Board
            </button>
            <button
              onClick={handleResetScores}
              className="px-6 py-2 bg-surface hover:bg-surface/80 border border-border text-primary rounded-lg font-semibold transition-colors shadow-md"
              aria-label="Reset Scores"
            >
              Reset Scores
            </button>
          </div>
        </div>
      </main>

      <WinnerModal winner={currentWinner} onReset={handleResetGame} />
      <RulesModal isOpen={Boolean(rulesMode)} onClose={() => setRulesMode(null)} mode={rulesMode} />
    </div>
  );
}

export default App;
