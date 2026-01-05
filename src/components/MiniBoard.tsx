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
            isActive ? "bg-brand/20 ring-2 ring-brand shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-surface/50"
        )}>
            {squares.map((value, i) => (
                <button
                    key={i}
                    onClick={() => onSquareClick(i)}
                    disabled={disabled || !!value}
                    className={clsx(
                        "w-full aspect-square min-w-[2rem] min-h-[2rem] sm:min-w-[2.5rem] sm:min-h-[2.5rem] rounded flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold transition-all",
                        value === 'X' ? "text-brand bg-surface" : value === 'O' ? "text-purple-400 bg-surface" : "bg-surface hover:bg-surface/80",
                        winningLine?.includes(i) && "bg-green-500/30",
                        !value && !disabled && isActive && "hover:bg-brand/20 cursor-pointer",
                        (disabled || value) && "cursor-default"
                    )}
                >
                    {value}
                </button>
            ))}
        </div>
    );
}
