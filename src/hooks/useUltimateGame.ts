import { useState, useCallback, useEffect } from 'react';
import { calculateWinner, type Player, type SquareValue } from '../utils/calculateWinner';

export type GlobalSquareValue = Player | 'Draw' | null;

export interface UltimateGameState {
    localBoards: SquareValue[][]; // 9 boards x 9 squares
    globalGrid: GlobalSquareValue[]; // 9 quadrants status
    xIsNext: boolean;
    activeQuadrant: number | null; // null means free move (any open quadrant)
    winner: Player | 'Draw' | null;
    scores: { X: number; O: number };
    winningLine: number[] | null; // Global winning line
    handleSquareClick: (boardIndex: number, squareIndex: number) => void;
    resetGame: () => void;
    resetScores: () => void;
}

const INITIAL_LOCAL_BOARD = Array(9).fill(null);
const INITIAL_LOCAL_BOARDS = Array(9).fill(null).map(() => [...INITIAL_LOCAL_BOARD]);

// Helper to check global winner considering Wildcards ('Draw')
function calculateGlobalWinner(squares: GlobalSquareValue[]): { winner: Player | 'Draw' | null; line: number[] | null } {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
        const valA = squares[a];
        const valB = squares[b];
        const valC = squares[c];

        // Skip if any is null (open)
        if (!valA || !valB || !valC) continue;

        // Check if line matches for X (X or Draw counts as X)
        const aIsX = valA === 'X' || valA === 'Draw';
        const bIsX = valB === 'X' || valB === 'Draw';
        const cIsX = valC === 'X' || valC === 'Draw';
        if (aIsX && bIsX && cIsX) return { winner: 'X', line: [a, b, c] };

        // Check if line matches for O (O or Draw counts as O)
        const aIsO = valA === 'O' || valA === 'Draw';
        const bIsO = valB === 'O' || valB === 'Draw';
        const cIsO = valC === 'O' || valC === 'Draw';
        if (aIsO && bIsO && cIsO) return { winner: 'O', line: [a, b, c] };
    }

    // Check for full draw (no open quadrants left)
    if (squares.every(s => s !== null)) return { winner: 'Draw', line: null };

    return { winner: null, line: null };
}

export function useUltimateGame() {
    const [localBoards, setLocalBoards] = useState<SquareValue[][]>(INITIAL_LOCAL_BOARDS);
    const [globalGrid, setGlobalGrid] = useState<GlobalSquareValue[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [activeQuadrant, setActiveQuadrant] = useState<number | null>(null);
    const [startingPlayer, setStartingPlayer] = useState<Player>('X');
    const [scores, setScores] = useState<{ X: number; O: number }>(() => {
        const saved = localStorage.getItem('ultimate-tictactoe-scores');
        return saved ? JSON.parse(saved) : { X: 0, O: 0 };
    });

    const { winner, line } = calculateGlobalWinner(globalGrid);

    useEffect(() => {
        localStorage.setItem('ultimate-tictactoe-scores', JSON.stringify(scores));
    }, [scores]);

    const handleSquareClick = useCallback((boardIndex: number, squareIndex: number) => {
        if (winner) return;

        // Validate move:
        // 1. Must be in activeQuadrant (if restricted)
        if (activeQuadrant !== null && activeQuadrant !== boardIndex) return;

        // 2. Target quadrant must be open (Global Grid value is null) - handled by activeQuadrant logic usually, 
        //    but doubles check if someone clicks a closed board in Free Move mode.
        if (globalGrid[boardIndex] !== null) return;

        // 3. Square must be empty
        if (localBoards[boardIndex][squareIndex]) return;

        const newLocalBoards = [...localBoards];
        const newBoard = [...newLocalBoards[boardIndex]];
        newBoard[squareIndex] = xIsNext ? 'X' : 'O';
        newLocalBoards[boardIndex] = newBoard;
        setLocalBoards(newLocalBoards);

        // Check local win
        const localResult = calculateWinner(newBoard);
        const newGlobalGrid = [...globalGrid];

        if (localResult.winner) {
            newGlobalGrid[boardIndex] = localResult.winner;
            setGlobalGrid(newGlobalGrid);
        }

        // Determine next active quadrant
        // Rule: Next move must be in the board corresponding to the squareIndex played.
        // If that target board is closed (has a value in globalGrid) or full, then Free Move (null).
        let nextActive: number | null = squareIndex;

        // Check if target board is closed (winner or draw)
        const isTargetClosed = newGlobalGrid[nextActive] !== null;

        // Check if target board is full (no nulls) - redundant if 'Draw' logic works, but 'Draw' comes from calculateWinner checking fullness. 
        // However, if a board is NOT won but FULL (draw), calculateWinner returns 'Draw', so globalGrid gets 'Draw', so it's closed.
        // So just checking globalGrid is usually enough.

        if (isTargetClosed) {
            nextActive = null; // Free move
        } else {
            // Edge case: Board is not "closed" by win/draw logic yet, but is actually full? 
            // calculateWinner handles full board -> Draw, so this should be covered.
        }

        // If the move caused a Global Win, set active to null (game over)
        const globalResult = calculateGlobalWinner(newGlobalGrid);
        if (globalResult.winner) {
            setActiveQuadrant(null);
            if (globalResult.winner !== 'Draw') {
                setScores(prev => ({ ...prev, [globalResult.winner as Player]: prev[globalResult.winner as Player] + 1 }));
            }
        } else {
            setActiveQuadrant(nextActive as number | null);
            setXIsNext(!xIsNext);
        }

    }, [localBoards, globalGrid, activeQuadrant, xIsNext, winner]);

    const resetGame = useCallback(() => {
        let nextStarter = startingPlayer;
        if (winner) {
            if (winner === 'Draw') {
                nextStarter = startingPlayer === 'X' ? 'O' : 'X';
            } else {
                nextStarter = winner;
            }
        }

        setStartingPlayer(nextStarter);
        setLocalBoards(Array(9).fill(null).map(() => Array(9).fill(null)));
        setGlobalGrid(Array(9).fill(null));
        setXIsNext(nextStarter === 'X');
        setActiveQuadrant(null); // First move is always free? Or linked? Usually free.
    }, [winner, startingPlayer]);

    const resetScores = useCallback(() => {
        setScores({ X: 0, O: 0 });
    }, []);

    return {
        localBoards,
        globalGrid,
        xIsNext,
        activeQuadrant,
        winner,
        winningLine: line,
        scores,
        handleSquareClick,
        resetGame,
        resetScores
    };
}
