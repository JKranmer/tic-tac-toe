import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Player } from '../utils/calculateWinner';

interface SkullPieceProps {
    owner: Player;
}

export function SkullPiece({ owner }: SkullPieceProps) {
    return (
        <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-full h-full flex items-center justify-center pointer-events-none z-10"
        >
            <svg
                viewBox="0 0 24 24"
                className={clsx(
                    "w-3/4 h-3/4 drop-shadow-sm transition-colors duration-300",
                    owner === 'X' ? "fill-player-x" : "fill-player-o"
                )}
            >
                <path d="M12 2C7.58 2 4 5.58 4 10c0 2.03.76 3.87 2 5.28V19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-3.72c1.24-1.41 2-3.25 2-5.28 0-4.42-3.58-8-8-8zm0 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-6H9V8h6v2z" />
            </svg>

            {/* Glow effect */}
            <div className={clsx(
                "absolute inset-0 rounded-full blur-xl -z-10 opacity-40",
                owner === 'X' ? "bg-player-x" : "bg-player-o"
            )}></div>
        </motion.div>
    );
}
