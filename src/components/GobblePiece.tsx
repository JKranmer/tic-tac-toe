import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Player } from '../utils/calculateWinner';
import type { PieceSize } from '../hooks/useGobbleGame';

interface GobblePieceProps {
  player: Player;
  size: PieceSize;
  isValidMove?: boolean;
  isSelected?: boolean;
  isGhost?: boolean; // For drag overlay or inventory preview
}

export function GobblePiece({ player, size, isSelected, isGhost }: GobblePieceProps) {
  // Sizes mappings
  const sizeClasses = {
    1: 'w-1/3 h-1/3', // Small
    2: 'w-2/3 h-2/3', // Medium
    3: 'w-full h-full' // Large
  };

  const borderSizes = {
    1: 'border-2',
    2: 'border-[3px]',
    3: 'border-4'
  };

  // Theme colors handled by parent usually, but we can enforce here too
  const colorClass = player === 'X' ? 'border-player-x text-player-x' : 'border-player-o text-player-o';
  const bgClass = player === 'X' ? 'bg-player-x/10' : 'bg-player-o/10';

  return (
    <motion.div
      layout // Allow smooth sizing transitions if reused
      className={clsx(
        'rounded-full flex items-center justify-center font-bold shadow-sm transition-all duration-300 relative z-10',
        sizeClasses[size],
        borderSizes[size],
        colorClass,
        isSelected ? 'bg-opacity-30 scale-110 ring-2 ring-brand ring-offset-2' : bgClass,
        isGhost && 'opacity-50'
      )}
    >
      {/* Inner styling to make it look like a ring/piece */}
      <span className="text-[0.6em] select-none">{player}</span>
    </motion.div>
  );
}
