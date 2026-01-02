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
                        className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 text-center max-w-sm w-full"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-white">
                            {winner === 'Draw' ? (
                                <span className="text-gray-300">It's a Draw!</span>
                            ) : (
                                <>
                                    <span className={winner === 'X' ? 'text-blue-400' : 'text-pink-400'}>
                                        {winner}
                                    </span> Wins!
                                </>
                            )}
                        </h2>

                        <button
                            onClick={onReset}
                            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Play Again
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
