import { Square } from './Square';
import type { SquareValue } from '../utils/calculateWinner';

interface BoardProps {
    squares: SquareValue[];
    onSquareClick: (index: number) => void;
    winningLine: number[] | null;
    gameEnded: boolean;
    nextToRemove: number | null;
    showHints: boolean;
}

export function Board({ squares, onSquareClick, winningLine, gameEnded, nextToRemove, showHints }: BoardProps) {

    return (
        <div className="flex flex-col items-center">
            {gameEnded && (
                <h2 className="text-2xl font-bold mb-6 tracking-wide text-gray-400" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                    Game Over
                </h2>
            )}

            <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 w-full h-auto max-w-xl aspect-square bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700 shadow-2xl">
                {squares.map((value, index) => (
                    <Square
                        key={index}
                        value={value}
                        onClick={() => onSquareClick(index)}
                        isWinningSquare={winningLine?.includes(index) ?? false}
                        disabled={gameEnded}
                        isNextToRemove={showHints && nextToRemove === index}
                    />
                ))}
            </div>
        </div>
    );
}
