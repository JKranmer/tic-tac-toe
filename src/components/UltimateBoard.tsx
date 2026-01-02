import { MiniBoard } from './MiniBoard';
import type { GlobalSquareValue } from '../hooks/useUltimateGame';
import type { SquareValue } from '../utils/calculateWinner';
import clsx from 'clsx';

interface UltimateBoardProps {
    localBoards: SquareValue[][];
    globalGrid: GlobalSquareValue[];
    onSquareClick: (boardIndex: number, squareIndex: number) => void;
    activeQuadrant: number | null;
    gameEnded: boolean;
}

export function UltimateBoard({ localBoards, globalGrid, onSquareClick, activeQuadrant, gameEnded }: UltimateBoardProps) {
    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-900 rounded-2xl max-w-2xl mx-auto">
            {localBoards.map((board, boardIndex) => {
                const status = globalGrid[boardIndex];
                const isActive = !gameEnded && status === null && (activeQuadrant === null || activeQuadrant === boardIndex);
                const isClosed = status !== null;

                return (
                    <div key={boardIndex} className="relative">
                        <MiniBoard
                            squares={board}
                            onSquareClick={(squareIndex) => onSquareClick(boardIndex, squareIndex)}
                            isActive={isActive}
                            disabled={gameEnded || isClosed || (!isActive && activeQuadrant !== null)}
                            winningLine={null} // Local winning line could be passed if we tracked it in hook
                        />

                        {/* Overlay for closed/won boards */}
                        {isClosed && (
                            <div className={clsx(
                                "absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm bg-gray-900/60 z-10",
                                status === 'X' ? "text-blue-500" : "text-pink-500"
                            )}>
                                <span className={clsx(
                                    "text-6xl sm:text-8xl font-black",
                                    status === 'Draw' && "text-gray-400 text-4xl"
                                )}>
                                    {status === 'Draw' ? "?" : status}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
