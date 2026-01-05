import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { SquareValue } from '../utils/calculateWinner';

interface MiniBoardProps {
    squares: SquareValue[];
    onSquareClick: (index: number) => void;
    isActive: boolean;
    disabled?: boolean;
    winningLine: number[] | null;
    boardWinner?: string | null;
}

export function MiniBoard({ squares, onSquareClick, isActive, disabled, winningLine, boardWinner }: MiniBoardProps) {
    return (
        <div className={clsx(
            "grid grid-cols-3 gap-1 p-1 rounded-lg transition-all duration-300",
            isActive ? "bg-brand/20 ring-2 ring-brand scale-[1.02]" : "bg-surface/50 opacity-80"
        )}>
            {squares.map((value, i) => (
                <motion.button
                    key={i}
                    whileHover={!value && !disabled && isActive ? { scale: 0.95 } : {}}
                    whileTap={!value && !disabled && isActive ? { scale: 0.9 } : {}}
                    onClick={() => onSquareClick(i)}
                    disabled={disabled || !!value}
                    className={clsx(
                        "w-full aspect-square min-w-[1.25rem] min-h-[1.25rem] sm:min-w-[2.5rem] sm:min-h-[2.5rem] rounded flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold transition-all",
                        value === 'X' ? "text-player-x bg-surface" : value === 'O' ? "text-player-o bg-surface" : "bg-surface hover:bg-surface/80",
                        winningLine?.includes(i) && (
                            boardWinner === 'X' ? "bg-player-x/30" :
                                boardWinner === 'O' ? "bg-player-o/30" :
                                    "bg-brand/30"
                        ),
                        !value && !disabled && isActive && "hover:bg-brand/20 cursor-pointer",
                        (disabled || value) && "cursor-default"
                    )}
                >
                    {value}
                </motion.button>
            ))}
        </div>
    );
}
