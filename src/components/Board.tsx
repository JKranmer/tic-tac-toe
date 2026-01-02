import { Square } from './Square';
import type { SquareValue } from '../utils/calculateWinner';

interface BoardProps {
    squares: SquareValue[];
    onSquareClick: (index: number) => void;
    winningLine: number[] | null;
    xIsNext: boolean;
    gameEnded: boolean;
    nextToRemove: number | null;
    showHints: boolean;
}

export function Board({ squares, onSquareClick, winningLine, xIsNext, gameEnded, nextToRemove, showHints }: BoardProps) {
    const status = xIsNext ? "X's Turn" : "O's Turn";

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 tracking-wide" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                {gameEnded ? (
                    <span className="text-gray-400">Game Over</span>
                ) : (
                    <span className={xIsNext ? "text-blue-400" : "text-pink-400"}>
                        {status}
                    </span>
                )}
            </h2>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700 shadow-2xl">
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
