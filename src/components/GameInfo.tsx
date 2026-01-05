import { motion } from 'framer-motion';


interface GameInfoProps {
    xIsNext: boolean;
    scores: { X: number; O: number };
}

export function GameInfo({ xIsNext, scores }: GameInfoProps) {
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

            <div className="flex justify-center items-center py-2">
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
    );
}
