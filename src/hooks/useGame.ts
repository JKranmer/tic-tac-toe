import { useState, useCallback, useEffect } from 'react';
import { calculateWinner, type Player, type SquareValue } from '../utils/calculateWinner';

export type GameMode = 'classic' | 'infinite' | 'ultimate';

export interface GameState {
    squares: SquareValue[];
    xIsNext: boolean;
    winner: Player | 'Draw' | null;
    winningLine: number[] | null;
    scores: { X: number; O: number };
    resetGame: () => void;
    handleSquareClick: (index: number) => void;
    resetScores: () => void;
    nextToRemove: number | null;
    gameMode: GameMode;
    setGameMode: (mode: GameMode) => void;
}

const INITIAL_SQUARES = Array(9).fill(null);

export function useGame(): GameState {
    const [squares, setSquares] = useState<SquareValue[]>(INITIAL_SQUARES);
    const [xIsNext, setXIsNext] = useState<boolean>(true);
    const [startingPlayer, setStartingPlayer] = useState<Player>('X'); // Track who started the current game
    const [gameMode, setGameMode] = useState<GameMode>('classic');
    const [xMoves, setXMoves] = useState<number[]>([]);
    const [oMoves, setOMoves] = useState<number[]>([]);
    const [scores, setScores] = useState<{ X: number; O: number }>(() => {
        const saved = localStorage.getItem('tictactoe-scores');
        return saved ? JSON.parse(saved) : { X: 0, O: 0 };
    });

    const { winner, line } = calculateWinner(squares);

    useEffect(() => {
        localStorage.setItem('tictactoe-scores', JSON.stringify(scores));
    }, [scores]);

    const handleModeChange = useCallback((newMode: GameMode) => {
        setGameMode(newMode);
        // Resetting mode always starts with X for fairness/simplicity
        setStartingPlayer('X');
        setSquares(INITIAL_SQUARES);
        setXIsNext(true);
        setXMoves([]);
        setOMoves([]);
    }, []);

    const handleSquareClick = useCallback((index: number) => {
        if (calculateWinner(squares).winner || squares[index]) {
            return;
        }

        const newSquares = [...squares];
        const currentPlayerMoves = xIsNext ? [...xMoves] : [...oMoves];

        // If player already has 3 moves, remove the oldest one
        // Infinite mode logic: remove oldest move if queue is full
        if (gameMode === 'infinite' && currentPlayerMoves.length >= 3) {
            const moveToRemove = currentPlayerMoves.shift(); // Remove first element
            if (moveToRemove !== undefined) {
                newSquares[moveToRemove] = null;
            }
        }

        // Add new move
        currentPlayerMoves.push(index);
        newSquares[index] = xIsNext ? 'X' : 'O';

        setSquares(newSquares);
        if (xIsNext) {
            setXMoves(currentPlayerMoves);
        } else {
            setOMoves(currentPlayerMoves);
        }
        setXIsNext(!xIsNext);

        // Check for winner immediately to update score
        const result = calculateWinner(newSquares);
        if (result.winner && result.winner !== 'Draw') {
            setScores((prev) => ({
                ...prev,
                [result.winner as Player]: prev[result.winner as Player] + 1,
            }));
        }
    }, [squares, xIsNext, xMoves, oMoves, gameMode]);

    const resetGame = useCallback(() => {
        let nextStarter = startingPlayer;

        if (winner) {
            if (winner === 'Draw') {
                // If draw, invalid next starter is the one who didn't start this game
                nextStarter = startingPlayer === 'X' ? 'O' : 'X';
            } else {
                // Winner starts the next game
                nextStarter = winner;
            }
        } else {
            // If manual reset (no winner yet), keep the same starter (retry)
            // or could alternate. Standard convention for retry is same setup.
            // Let's keep nextStarter as startingPlayer (already set above).
        }

        setStartingPlayer(nextStarter);
        setSquares(INITIAL_SQUARES);
        setXIsNext(nextStarter === 'X');
        setXMoves([]);
        setOMoves([]);
    }, [winner, startingPlayer]);

    const resetScores = useCallback(() => {
        setScores({ X: 0, O: 0 });
    }, []);

    // Determine which square is next to be removed for the current player
    // If xIsNext, look at X's moves. If X has 3 moves, the first one (index 0) is next to go.
    // However, the prompt implies we show this *before* they make the 4th move.
    // "When the 4th mark is made, the 1st one disappears."
    // So if I have 3 marks, my next move will trigger removal of my 1st mark.
    const currentMoves = xIsNext ? xMoves : oMoves;
    const nextToRemove = (gameMode === 'infinite' && currentMoves.length >= 3) ? currentMoves[0] : null;

    return {
        squares,
        xIsNext,
        winner,
        winningLine: line,
        scores,
        resetGame,
        handleSquareClick,
        resetScores,
        nextToRemove,
        gameMode,
        setGameMode: handleModeChange,
    };
}

