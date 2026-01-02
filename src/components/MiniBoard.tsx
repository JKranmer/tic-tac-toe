import clsx from 'clsx';
import type { SquareValue } from '../utils/calculateWinner';

interface MiniBoardProps {
    squares: SquareValue[];
    onSquareClick: (index: number) => void;
    isActive: boolean;
    disabled: boolean;
    winningLine: number[] | null;
}

export function MiniBoard({ squares, onSquareClick, isActive, disabled, winningLine }: MiniBoardProps) {
    return (
        <div className={clsx(
            "grid grid-cols-3 gap-1 p-1 rounded-lg transition-all duration-300",
            isActive ? "bg-blue-900/30 ring-2 ring-blue-400 shadow-[0_0_15px_rgba(60,130,246,0.5)]" : "bg-gray-800/30"
        )}>
            {squares.map((value, i) => (
                <button
                    key={i}
                    onClick={() => onSquareClick(i)}
                    disabled={disabled || !!value}
                    className={clsx(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center text-lg sm:text-xl font-bold transition-all",
                        value === 'X' ? "text-blue-400 bg-gray-700/50" : value === 'O' ? "text-pink-400 bg-gray-700/50" : "bg-gray-800 hover:bg-gray-700",
                        winningLine?.includes(i) && "bg-green-900/50",
                        !value && !disabled && isActive && "hover:bg-blue-500/20 cursor-pointer",
                        (disabled || value) && "cursor-default"
                    )}
                >
                    {value}
                </button>
            ))}
        </div>
    );
}
