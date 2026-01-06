import { useState } from 'react';
import type { Player } from '../utils/calculateWinner';
export type { Player };

export type PieceSize = 1 | 2 | 3; // 1: Small (P), 2: Medium (M), 3: Large (G)

export interface GobblePiece {
    id: string;
    player: Player;
    size: PieceSize;
}

export type BoardStack = GobblePiece[];
export type GobbleBoardState = BoardStack[];

export interface PlayerInventory {
    1: number; // Small count
    2: number; // Medium count
    3: number; // Large count
}

export type GobbleMode = 'quick' | 'classic';

export interface SelectedPiece {
    source: 'inventory' | 'board';
    id: string;
    size: PieceSize;
    index?: number; // Board index if source is board
}

const INITIAL_INVENTORY: PlayerInventory = { 1: 2, 2: 2, 3: 2 };

export function useGobbleGame() {
    const [board, setBoard] = useState<GobbleBoardState>(Array(9).fill([]));
    const [xInventory, setXInventory] = useState<PlayerInventory>({ ...INITIAL_INVENTORY });
    const [oInventory, setOInventory] = useState<PlayerInventory>({ ...INITIAL_INVENTORY });
    const [turn, setTurn] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [selectedPiece, setSelectedPiece] = useState<SelectedPiece | null>(null);
    const [gobbleMode, setGobbleMode] = useState<GobbleMode>('quick');
    const [scores, setScores] = useState({ X: 0, O: 0 });

    const getTopPiece = (stack: BoardStack): GobblePiece | null => {
        return stack.length > 0 ? stack[stack.length - 1] : null;
    };

    const checkWinner = (currentBoard: GobbleBoardState): { winner: Player | null, line: number[] | null } => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            const topA = getTopPiece(currentBoard[a]);
            const topB = getTopPiece(currentBoard[b]);
            const topC = getTopPiece(currentBoard[c]);

            if (topA && topB && topC && topA.player === topB.player && topA.player === topC.player) {
                return { winner: topA.player, line };
            }
        }
        return { winner: null, line: null };
    };

    const handleSelectInventoryPiece = (size: PieceSize) => {
        if (winner) return;

        const currentInventory = turn === 'X' ? xInventory : oInventory;
        if (currentInventory[size] > 0) {
            // Toggle selection if already selected same size from inventory
            if (selectedPiece?.source === 'inventory' && selectedPiece.size === size) {
                setSelectedPiece(null);
            } else {
                setSelectedPiece({
                    source: 'inventory',
                    id: `inv-${turn}-${size}-${Date.now()}`, // Temporary ID logic
                    size
                });
            }
        }
    };

    const handleBoardClick = (index: number) => {
        if (winner) return;

        const stack = board[index];
        const topPiece = getTopPiece(stack);

        // Case 1: Placing a selected piece (Drop or Move)
        if (selectedPiece) {
            // Logic: Can we place here?
            // Rule: Size must be > top piece size (if any)
            // Special Rule for Move: Can't move to same spot (implied by "lift" logic logic below, but good to check)

            if (topPiece && selectedPiece.size <= topPiece.size) {
                // Invalid move: target too big
                // If clicked piece is own piece and in Classic mode, maybe switch selection?
                if (gobbleMode === 'classic' && topPiece.player === turn && selectedPiece.source === 'board') {
                    // Switch selection to this piece
                    setSelectedPiece({
                        source: 'board',
                        id: topPiece.id,
                        size: topPiece.size,
                        index
                    });
                    return;
                }
                return; // Invalid move, do nothing or show feedback
            }

            // Valid Move/Drop Logic
            executeMove(index);
            return;
        }

        // Case 2: Selecting a piece on the board (Classic visual move start)
        if (gobbleMode === 'classic' && topPiece && topPiece.player === turn) {
            setSelectedPiece({
                source: 'board',
                id: topPiece.id,
                size: topPiece.size,
                index
            });
        }
    };

    const executeMove = (targetIndex: number) => {
        if (!selectedPiece) return;

        let newBoard = [...board];
        let newXInv = { ...xInventory };
        let newOInv = { ...oInventory };
        const currentInv = turn === 'X' ? newXInv : newOInv;

        // 1. Revelation Check (Classic Mode only, if moving from board)
        if (selectedPiece.source === 'board' && selectedPiece.index !== undefined) {
            const sourceStack = [...board[selectedPiece.index]];
            // Simulate lift
            sourceStack.pop();
            // Check if this revealed state causes OPPONENT to win
            const tempBoard = [...board];
            tempBoard[selectedPiece.index] = sourceStack;

            const opponent = turn === 'X' ? 'O' : 'X';
            const revelationResult = checkWinner(tempBoard);

            if (revelationResult.winner === opponent) {
                // Checkmate by Revelation! Opponent wins immediately.
                setBoard(tempBoard); // Commit the lift so user sees why they lost
                setWinner(opponent);
                setWinningLine(revelationResult.line);
                setScores(s => ({ ...s, [opponent]: s[opponent] + 1 }));
                setSelectedPiece(null);
                return;
            }

            // If no instant loss, finalize the lift in the real newBoard
            newBoard[selectedPiece.index] = sourceStack;
        } else {
            // Decrement inventory if source is inventory
            currentInv[selectedPiece.size]--;
            if (turn === 'X') setXInventory(newXInv);
            else setOInventory(newOInv);
        }

        // 2. Place Piece
        const newPiece: GobblePiece = {
            id: selectedPiece.id,
            player: turn,
            size: selectedPiece.size
        };

        const targetStack = [...newBoard[targetIndex], newPiece];
        newBoard[targetIndex] = targetStack;

        // 3. Update Board & State
        setBoard(newBoard);
        setSelectedPiece(null);

        // 4. Check for Standard Win
        const winResult = checkWinner(newBoard);
        if (winResult.winner) {
            setWinner(winResult.winner);
            setWinningLine(winResult.line);
            setScores(s => ({ ...s, [winResult.winner!]: s[winResult.winner!] + 1 }));
        } else {
            setTurn(turn === 'X' ? 'O' : 'X');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill([]));
        setXInventory({ ...INITIAL_INVENTORY });
        setOInventory({ ...INITIAL_INVENTORY });
        setTurn('X');
        setWinner(null);
        setWinningLine(null);
        setSelectedPiece(null);
    };

    return {
        board,
        xInventory,
        oInventory,
        turn,
        winner,
        winningLine,
        selectedPiece,
        gobbleMode,
        scores,
        setGobbleMode,
        handleSelectInventoryPiece,
        handleBoardClick,
        resetGame,
        resetScores: () => setScores({ X: 0, O: 0 })
    };
}
