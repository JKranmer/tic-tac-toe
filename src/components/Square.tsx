import { motion } from 'framer-motion';
import type { SquareValue } from '../utils/calculateWinner';
import clsx from 'clsx';

interface SquareProps {
    value: SquareValue;
    onClick: () => void;
    isWinningSquare: boolean;
    disabled: boolean;
}

export function Square({ value, onClick, isWinningSquare, disabled }: SquareProps) {
    return (
        <motion.button
            whileHover={!value && !disabled ? { scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
            whileTap={!value && !disabled ? { scale: 0.95 } : {}}
            className={clsx(
                "h-24 w-24 sm:h-32 sm:w-32 bg-gray-800 rounded-xl flex items-center justify-center text-4xl sm:text-6xl shadow-lg border-2",
                isWinningSquare ? "border-green-400 bg-green-900/20" : "border-gray-700",
                !value && !disabled && "cursor-pointer hover:border-gray-500",
                (value || disabled) && "cursor-default"
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
                        value === 'X' ? "text-blue-400" : "text-pink-400"
                    )}
                >
                    {value}
                </motion.span>
            )}
        </motion.button>
    );
}
