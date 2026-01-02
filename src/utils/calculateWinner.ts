export type Player = 'X' | 'O';
export type SquareValue = Player | null;

export function calculateWinner(squares: SquareValue[]): { winner: Player | 'Draw' | null; line: number[] | null } {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }

    if (squares.every((square) => square !== null)) {
        return { winner: 'Draw', line: null };
    }

    return { winner: null, line: null };
}
