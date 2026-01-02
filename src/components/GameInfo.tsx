import { motion } from 'framer-motion';


interface GameInfoProps {
    xIsNext: boolean;
    scores: { X: number; O: number };
}

export function GameInfo({ xIsNext, scores }: GameInfoProps) {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm mb-6">
            <div className="flex justify-between items-center bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
                <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-400 font-medium">Player X</span>
                    <span className="text-2xl font-bold text-blue-400">{scores.X}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-400 font-medium">Player O</span>
                    <span className="text-2xl font-bold text-pink-400">{scores.O}</span>
                </div>
            </div>

            <div className="flex justify-center items-center py-2">
                <span className="text-gray-400 mr-2">Turn:</span>
                <motion.span
                    key={xIsNext ? 'X' : 'O'}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`font-bold text-xl ${xIsNext ? 'text-blue-400' : 'text-pink-400'}`}
                >
                    {xIsNext ? 'X' : 'O'}
                </motion.span>
            </div>
        </div>
    );
}
