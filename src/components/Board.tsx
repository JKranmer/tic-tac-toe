import { Square } from './Square';
import type { SquareValue } from '../utils/calculateWinner';

interface BoardProps {
    squares: SquareValue[];
    onSquareClick: (index: number) => void;
    winningLine: number[] | null;
    xIsNext: boolean;
    gameEnded: boolean;
}

export function Board({ squares, onSquareClick, winningLine, gameEnded }: BoardProps) {
    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 bg-gray-800/50 rounded-2xl backdrop-blur-sm shadow-2xl border border-gray-700">
            {squares.map((square, i) => (
                <Square
                    key={i}
                    value={square}
                    onClick={() => onSquareClick(i)}
                    isWinningSquare={winningLine?.includes(i) ?? false}
                    disabled={gameEnded}
                />
            ))}
        </div>
    );
}
