import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '../utils/calculateWinner';

interface WinnerModalProps {
  winner: Player | 'Draw' | null;
  onReset: () => void;
}

export function WinnerModal({ winner, onReset }: WinnerModalProps) {
  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-surface p-8 rounded-2xl shadow-2xl border border-border text-center max-w-sm w-full"
          >
            <h2 className="text-3xl font-bold mb-4 text-primary">
              {winner === 'Draw' ? (
                <span className="text-secondary">It's a Draw!</span>
              ) : (
                <>
                  <span className={winner === 'X' ? 'text-player-x' : 'text-player-o'}>{winner}</span> Wins!
                </>
              )}
            </h2>

            <button
              onClick={onReset}
              className="mt-6 px-6 py-3 bg-brand text-white rounded-lg font-bold text-lg hover:bg-brand/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Play Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
