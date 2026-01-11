import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Player } from '../utils/calculateWinner';

interface BonesPieceProps {
    owner: Player;
    isSelected?: boolean;
    isGhost?: boolean;
    isValidTarget?: boolean;
    onClick?: () => void;
}

export function BonesPiece({ owner, isSelected, isGhost, isValidTarget, onClick }: BonesPieceProps) {
    return (
        <motion.div
            layout
            onClick={onClick}
            initial={isGhost ? { opacity: 0, scale: 0.8 } : { opacity: 0, scale: 0 }}
            animate={{
                opacity: isGhost ? 0.4 : 1,
                scale: 1,
                rotate: isSelected ? 5 : 0 // Jiggle if selected
            }}
            whileHover={!isGhost ? { scale: 1.1 } : undefined}
            className={clsx(
                "relative w-full h-full flex items-center justify-center transition-colors",
                onClick && "cursor-pointer",
                isGhost && "pointer-events-none"
            )}
        >
            {/* Cross Shape constructed with two bars */}
            <div className={clsx(
                "absolute w-3/4 h-1/4 rounded-full shadow-sm",
                owner === 'X' ? "bg-player-x" : "bg-player-o",
                isSelected && "ring-4 ring-brand/50",
                isValidTarget && "ring-2 ring-emerald-400"
            )}></div>
            <div className={clsx(
                "absolute h-3/4 w-1/4 rounded-full shadow-sm",
                owner === 'X' ? "bg-player-x" : "bg-player-o",
                isSelected && "ring-4 ring-brand/50",
                isValidTarget && "ring-2 ring-emerald-400"
            )}></div>
        </motion.div>
    );
}
