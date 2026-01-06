import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { GobblePiece } from './GobblePiece';
import type { GobbleBoardState, SelectedPiece, Player } from '../hooks/useGobbleGame';

interface GobbleBoardProps {
    board: GobbleBoardState;
    onSquareClick: (index: number) => void;
    selectedPiece: SelectedPiece | null;
    turn: Player;
    gameEnded: boolean;
    winningLine: number[] | null;
}

export function GobbleBoard({ board, onSquareClick, selectedPiece, turn, gameEnded, winningLine }: GobbleBoardProps) {

    const getTopPiece = (stack: any[]) => stack.length > 0 ? stack[stack.length - 1] : null;

    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 w-full h-auto max-w-sm aspect-square bg-page rounded-2xl mx-auto shadow-2xl border border-border">
            {board.map((stack, i) => {
                const topPiece = getTopPiece(stack);
                const isWinningSquare = winningLine?.includes(i);

                // Determine if this square is a valid drop target for the selected piece
                let isValidTarget = false;
                if (selectedPiece && !gameEnded) {
                    if (!topPiece || selectedPiece.size > topPiece.size) {
                        isValidTarget = true;
                    }
                }

                // If no piece selected, logic for "can I select this?" (Classic mode only logic usually, but handled in hook)
                const isSelectable = !gameEnded && topPiece && topPiece.player === turn && !selectedPiece;

                return (
                    <motion.button
                        key={i}
                        onClick={() => onSquareClick(i)}
                        className={clsx(
                            "relative w-full aspect-square bg-surface rounded-xl flex items-center justify-center shadow-inner border-2 transition-all duration-300",
                            isWinningSquare ? (topPiece?.player === 'X' ? "border-player-x bg-player-x/20" : "border-player-o bg-player-o/20") : "border-border",
                            isValidTarget && "ring-4 ring-brand/30 bg-brand/5 cursor-pointer",
                            isSelectable && "hover:ring-2 hover:ring-brand/50 cursor-pointer",
                            !isValidTarget && !isSelectable && !gameEnded && "cursor-default",
                            selectedPiece?.index === i && "ring-4 ring-brand scale-95" // Highlight source of move
                        )}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Stack Visualization: Using direct piece for now. 
                            Could render pieces below with opacity/offset if desired, but 
                            Gobble rules usually only show top. 
                        */}
                        <AnimatePresence mode='popLayout'>
                            {topPiece && (
                                <motion.div
                                    key={topPiece.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="w-full h-full flex items-center justify-center p-2"
                                >
                                    <GobblePiece
                                        player={topPiece.player}
                                        size={topPiece.size}
                                        isSelected={selectedPiece?.index === i}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                );
            })}
        </div>
    );
}
