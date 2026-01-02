import { useState, useCallback, useEffect } from 'react';
import { calculateWinner, type Player, type SquareValue } from '../utils/calculateWinner';

export interface GameState {
    squares: SquareValue[];
    xIsNext: boolean;
    winner: Player | 'Draw' | null;
    winningLine: number[] | null;
    scores: { X: number; O: number };
    resetGame: () => void;
    handleSquareClick: (index: number) => void;
    resetScores: () => void;
}

const INITIAL_SQUARES = Array(9).fill(null);

export function useGame(): GameState {
    const [squares, setSquares] = useState<SquareValue[]>(INITIAL_SQUARES);
    const [xIsNext, setXIsNext] = useState<boolean>(true);
    const [scores, setScores] = useState<{ X: number; O: number }>(() => {
        const saved = localStorage.getItem('tictactoe-scores');
        return saved ? JSON.parse(saved) : { X: 0, O: 0 };
    });

    const { winner, line } = calculateWinner(squares);

    useEffect(() => {
        localStorage.setItem('tictactoe-scores', JSON.stringify(scores));
    }, [scores]);

    useEffect(() => {
        if (winner && winner !== 'Draw') {
            setScores((prev) => ({
                ...prev,
                [winner]: prev[winner] + 1,
            }));
        }
    }, [winner]);

    const handleSquareClick = useCallback((index: number) => {
        if (calculateWinner(squares).winner || squares[index]) {
            return;
        }

        const newSquares = [...squares];
        newSquares[index] = xIsNext ? 'X' : 'O';
        setSquares(newSquares);
        setXIsNext(!xIsNext);
    }, [squares, xIsNext]);

    const resetGame = useCallback(() => {
        setSquares(INITIAL_SQUARES);
        setXIsNext(true); // Winner starts or alternating? Standard is X starts or loser starts. Let's stick to X starts.
    }, []);

    const resetScores = useCallback(() => {
        setScores({ X: 0, O: 0 });
    }, []);

    return {
        squares,
        xIsNext,
        winner,
        winningLine: line,
        scores,
        resetGame,
        handleSquareClick,
        resetScores,
    };
}
