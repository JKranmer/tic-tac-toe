import { motion } from 'framer-motion';
import type { SquareValue } from '../utils/calculateWinner';
import clsx from 'clsx';

interface SquareProps {
    value: SquareValue;
    onClick: () => void;
    isWinningSquare: boolean;
    disabled: boolean;
    isNextToRemove?: boolean;
}

export function Square({ value, onClick, isWinningSquare, disabled, isNextToRemove }: SquareProps) {
    return (
        <motion.button
            whileHover={!value && !disabled ? { scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
            whileTap={!value && !disabled ? { scale: 0.95 } : {}}
            className={clsx(
                "w-full aspect-square min-w-[6rem] min-h-[6rem] sm:min-w-[8rem] sm:min-h-[8rem] bg-gray-800 rounded-xl flex items-center justify-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl shadow-lg border-2 transition-all duration-300",
                isWinningSquare ? "border-green-400 bg-green-900/20" : "border-gray-700",
                !value && !disabled && "cursor-pointer hover:border-gray-500",
                (value || disabled) && "cursor-default",
                isNextToRemove && "border-red-500/50 opacity-60 animate-pulse bg-red-900/10"
            )}
            onClick={onClick}
            disabled={disabled || !!value}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            {value && (
                <motion.span
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={clsx(
                        "font-extrabold",
                        value === 'X' ? "text-blue-400" : "text-pink-400",
                        isNextToRemove && "text-red-300"
                    )}
                >
                    {value}
                </motion.span>
            )}
        </motion.button>
    );
}
