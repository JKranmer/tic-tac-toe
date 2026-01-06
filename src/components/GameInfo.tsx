import { motion } from 'framer-motion';

interface GameInfoProps {
    xIsNext: boolean;
    scores: { X: number; O: number };
    onRulesClick: () => void;
}

export function GameInfo({ xIsNext, scores, onRulesClick }: GameInfoProps) {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm mb-6">
            <div className="flex justify-between items-center bg-surface rounded-xl p-4 shadow-lg border border-border">
                <div className="flex flex-col items-center">
                    <span className="text-sm text-secondary font-medium">Player X</span>
                    <span className="text-2xl font-bold text-player-x">{scores.X}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm text-secondary font-medium">Player O</span>
                    <span className="text-2xl font-bold text-player-o">{scores.O}</span>
                </div>
            </div>

            <div className="flex justify-center items-center py-2 gap-4">
                <button
                    onClick={onRulesClick}
                    className="flex items-center gap-1.5 text-secondary hover:text-brand transition-colors text-sm font-medium bg-surface/50 px-3 py-1.5 rounded-full hover:bg-surface border border-transparent hover:border-brand/30"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Rules
                </button>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center">
                    <span className="text-secondary mr-2">Turn:</span>
                    <motion.span
                        key={xIsNext ? 'X' : 'O'}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`font-bold text-xl ${xIsNext ? 'text-player-x' : 'text-player-o'}`}
                    >
                        {xIsNext ? 'X' : 'O'}
                    </motion.span>
                </div>
            </div>
        </div>
    );
}
