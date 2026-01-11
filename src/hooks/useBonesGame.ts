import { useState, useCallback } from 'react';
import type { Player } from '../utils/calculateWinner';

export interface Bone {
    id: string;
    owner: Player;
    x: number;
    y: number;
}

export interface Skull {
    id: string; // key like "x,y" representing the top-left corner of the 2x2 square
    owner: Player;
    x: number;
    y: number;
}

export type BonesGameState = {
    pieces: Bone[];
    skulls: Skull[];
    turn: Player;
    winner: Player | null;
    winningLine: string[] | null; // IDs of winning skulls or bones
    inventory: { X: number; O: number };
    selectedBoneId: string | null;
    validMoves: string[]; // "x,y"
    placeBone: (x: number, y: number) => void;
    selectBone: (id: string | null) => void;
    moveBone: (x: number, y: number) => void;
    resetGame: () => void;
};

const MAX_PIECES = 8;

export function useBonesGame(): BonesGameState {
    const [pieces, setPieces] = useState<Bone[]>([]);
    const [skulls, setSkulls] = useState<Skull[]>([]);
    const [turn, setTurn] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | null>(null);
    const [winningLine, setWinningLine] = useState<string[] | null>(null);
    const [inventory, setInventory] = useState({ X: MAX_PIECES, O: MAX_PIECES });
    const [selectedBoneId, setSelectedBoneId] = useState<string | null>(null);

    // Helpers
    const getBoneAt = useCallback((x: number, y: number, currentPieces: Bone[]) => {
        return currentPieces.find(p => p.x === x && p.y === y);
    }, []);

    const isOccupied = useCallback((x: number, y: number, currentPieces: Bone[] = pieces) => {
        return currentPieces.some(p => p.x === x && p.y === y);
    }, [pieces]);

    // Graph Connectivity Check
    const isConnectedWithout = useCallback((pieceToRemove: Bone, currentPieces: Bone[]) => {
        const remaining = currentPieces.filter(p => p.id !== pieceToRemove.id);
        if (remaining.length <= 1) return true;

        const startNode = remaining[0];
        const visited = new Set<string>();
        const queue = [startNode];
        visited.add(startNode.id);

        while (queue.length > 0) {
            const current = queue.shift()!;
            const neighbors = remaining.filter(p => !visited.has(p.id) &&
                ((Math.abs(p.x - current.x) === 1 && p.y === current.y) ||
                    (Math.abs(p.y - current.y) === 1 && p.x === current.x))
            );

            for (const n of neighbors) {
                visited.add(n.id);
                queue.push(n);
            }
        }

        return visited.size === remaining.length;
    }, []);

    // Check surrounding neighbors for placing validity
    const hasNeighbor = useCallback((x: number, y: number, currentPieces: Bone[]) => {
        return currentPieces.some(p =>
            (Math.abs(p.x - x) === 1 && p.y === y) ||
            (Math.abs(p.y - y) === 1 && p.x === x)
        );
    }, []);

    // Win Detection
    const checkWin = useCallback((currentSkulls: Skull[], currentPieces: Bone[]) => {
        // 1. Perfect Grave (Instant Win)
        // Check every 2x2 square to see if it's single-colored
        // We only need to check the last placed/moved piece's neighbors, but iterating all is safe for now (small board)

        // Find all 2x2 squares
        // A 2x2 square is identified by top-left (x,y). It needs (x,y), (x+1,y), (x,y+1), (x+1,y+1)

        // Optimize: verify squares around currentPieces
        const potentialSquares = new Set<string>();
        currentPieces.forEach(p => {
            potentialSquares.add(`${p.x},${p.y}`);
            potentialSquares.add(`${p.x - 1},${p.y}`);
            potentialSquares.add(`${p.x},${p.y - 1}`);
            potentialSquares.add(`${p.x - 1},${p.y - 1}`);
        });

        for (const key of potentialSquares) {
            const [x, y] = key.split(',').map(Number);
            const tl = getBoneAt(x, y, currentPieces);
            const tr = getBoneAt(x + 1, y, currentPieces);
            const bl = getBoneAt(x, y + 1, currentPieces);
            const br = getBoneAt(x + 1, y + 1, currentPieces);

            if (tl && tr && bl && br) {
                // Check perfect grave
                if (tl.owner === tr.owner && tr.owner === bl.owner && bl.owner === br.owner) {
                    return { winner: tl.owner, line: [tl.id, tr.id, bl.id, br.id] };
                }
            }
        }

        // 2. 3 Skulls in a row
        // Build grid of skulls
        const skullMap = new Map<string, Skull>();
        currentSkulls.forEach(s => skullMap.set(`${s.x},${s.y}`, s));

        for (const skull of currentSkulls) {
            // Check Horizontal
            if (skullMap.get(`${skull.x + 1},${skull.y}`)?.owner === skull.owner &&
                skullMap.get(`${skull.x + 2},${skull.y}`)?.owner === skull.owner) {
                return { winner: skull.owner, line: [skull.id, `${skull.x + 1},${skull.y}`, `${skull.x + 2},${skull.y}`] };
            }
            // Check Vertical
            if (skullMap.get(`${skull.x},${skull.y + 1}`)?.owner === skull.owner &&
                skullMap.get(`${skull.x},${skull.y + 2}`)?.owner === skull.owner) {
                return { winner: skull.owner, line: [skull.id, `${skull.x},${skull.y + 1}`, `${skull.x},${skull.y + 2}`] };
            }
            // Check Diagonal \
            if (skullMap.get(`${skull.x + 1},${skull.y + 1}`)?.owner === skull.owner &&
                skullMap.get(`${skull.x + 2},${skull.y + 2}`)?.owner === skull.owner) {
                return { winner: skull.owner, line: [skull.id, `${skull.x + 1},${skull.y + 1}`, `${skull.x + 2},${skull.y + 2}`] };
            }
            // Check Diagonal /
            if (skullMap.get(`${skull.x - 1},${skull.y + 1}`)?.owner === skull.owner &&
                skullMap.get(`${skull.x - 2},${skull.y + 2}`)?.owner === skull.owner) {
                return { winner: skull.owner, line: [skull.id, `${skull.x - 1},${skull.y + 1}`, `${skull.x - 2},${skull.y + 2}`] };
            }
        }

        return { winner: null, line: null };
    }, []);

    // Update Skulls Logic
    const updateSkulls = useCallback((currentPieces: Bone[], currentPlayer: Player) => {
        const newSkulls: Skull[] = [];

        // Detect all 2x2 squares
        const potentialSquares = new Set<string>();
        currentPieces.forEach(p => {
            // A piece at x,y can be part of 4 squares:
            // Top-Left of square (x,y)
            // Top-Right of square (x-1, y)
            // Bottom-Left of square (x, y-1)
            // Bottom-Right of square (x-1, y-1)
            potentialSquares.add(`${p.x},${p.y}`);
            potentialSquares.add(`${p.x - 1},${p.y}`);
            potentialSquares.add(`${p.x},${p.y - 1}`);
            potentialSquares.add(`${p.x - 1},${p.y - 1}`);
        });

        potentialSquares.forEach(key => {
            const [x, y] = key.split(',').map(Number);
            const tl = getBoneAt(x, y, currentPieces);
            const tr = getBoneAt(x + 1, y, currentPieces);
            const bl = getBoneAt(x, y + 1, currentPieces);
            const br = getBoneAt(x + 1, y + 1, currentPieces);

            if (tl && tr && bl && br) {
                // Square exists. Check if it already had a skull in previous state to preserve owner?
                // Rules say: "If action closes a square... put Skull of YOUR color".
                // If square persists, skull persists.
                // If square was just formed (or re-formed), current player gets it.

                // We need to know if this square existed before.
                // But simpler: We recalculate ALL skulls. 
                // Wait, "If you move a piece... cova opens... skull removed".
                // "If closes... put skull". 
                // So we need persistent identity of skulls to know WHO owns it if it didn't change.

                // Let's rely on `skulls` state.
                const existingSkull = skulls.find(s => s.x === x && s.y === y);
                if (existingSkull) {
                    newSkulls.push(existingSkull);
                } else {
                    // It's a new skull (or re-closed). 
                    // Warning: If I move a piece that WAS part of a square, and I place it somewhere else that CLOSES the SAME square?
                    // That's impossible (move must begin by picking up, which breaks the square).
                    // So any square found now that wasn't in `skulls` is NEWLY formed by the current action.
                    newSkulls.push({
                        id: key,
                        owner: currentPlayer,
                        x, y
                    });
                }
            }
        });

        // Note: Logic above assumes `skulls` is from BEFORE the move.
        // But `updateSkulls` is called with NEW pieces.
        // Any skull in `newSkulls` that wasn't in `skulls` is new -> assign `currentPlayer`.
        // Any skull in `newSkulls` that WAS in `skulls` -> keep owner.
        // However, the `existingSkull` check handles persistence.
        // What if a skull is LOST? It simply won't be added to `newSkulls`.

        return newSkulls;
    }, [skulls, getBoneAt]);

    const placeBone = (x: number, y: number) => {
        if (winner) return;

        // Validation
        if (pieces.length > 0 && !hasNeighbor(x, y, pieces)) return;
        if (isOccupied(x, y, pieces)) return;
        if (inventory[turn] <= 0) return; // Should switch to move phase if 0, UI should block

        const newPiece: Bone = {
            id: crypto.randomUUID(),
            owner: turn,
            x, y
        };

        const newPieces = [...pieces, newPiece];

        // Update Inventory
        const newInventory = { ...inventory, [turn]: inventory[turn] - 1 };

        // Update Skulls
        const newSkulls = updateSkulls(newPieces, turn);

        // Check Win
        const winResult = checkWin(newSkulls, newPieces);

        setPieces(newPieces);
        setInventory(newInventory);
        setSkulls(newSkulls);

        if (winResult.winner) {
            setWinner(winResult.winner);
            setWinningLine(winResult.line);
        } else {
            setTurn(turn === 'X' ? 'O' : 'X');
        }
    };

    const selectBone = (id: string | null) => {
        if (winner) return;
        if (!id) {
            setSelectedBoneId(null);
            return;
        }

        const bone = pieces.find(p => p.id === id);
        if (!bone) return;
        if (bone.owner !== turn) return;

        // Validate "Locked" (surrounded by 4)
        const neighbors = pieces.filter(p =>
            (Math.abs(p.x - bone.x) === 1 && p.y === bone.y) ||
            (Math.abs(p.y - bone.y) === 1 && p.x === bone.x)
        );
        if (neighbors.length === 4) return; // Locked

        // Validate "Connectivity" (Bridge check)
        if (!isConnectedWithout(bone, pieces)) return; // Critical bridge

        setSelectedBoneId(id);
    };

    const moveBone = (x: number, y: number) => {
        if (!selectedBoneId || winner) return;

        const bone = pieces.find(p => p.id === selectedBoneId);
        if (!bone) return;

        // Validate Target
        if (isOccupied(x, y, pieces)) return; // Can't move to occupied

        // Temp remove to check placement validity
        // "New position must touch at least one piece" (excluding itself)
        const otherPieces = pieces.filter(p => p.id !== selectedBoneId);
        if (otherPieces.length > 0 && !hasNeighbor(x, y, otherPieces)) return;

        // Perform Move
        const newBone = { ...bone, x, y };
        const newPieces = [...otherPieces, newBone];

        // Update Skulls (implicit removal of broken ones, addition of new ones)
        // IMPORTANT: We need to remove skulls BROKEN by the LIFTING of the piece first?
        // Actually `updateSkulls` recalculates from scratch based on geometry.
        // If the geometry no longer supports a skull, it won't be in `newSkulls`.
        // If it does, and it was there before, it persists.
        // If it does, and it wasn't, it's new (Owner = Current Turn).
        // BUT: if I move a piece, I might break a skull and form a NEW one elsewhere.
        // The broken skull is gone. The new one is mine. 
        // Correct.

        // ISSUE: `updateSkulls` uses `skulls` state for persistence.
        // If I simply call `updateSkulls(newPieces, turn)`, strict geometric check:
        // 1. Calculate all valid squares in new config.
        // 2. For each, if it existed in `skulls`, keep owner. Else `turn`.
        // This is correct behavior. Breaking a square removes it (it won't be in step 1).

        const newSkulls = updateSkulls(newPieces, turn);
        const winResult = checkWin(newSkulls, newPieces);

        setPieces(newPieces);
        setSkulls(newSkulls);
        setSelectedBoneId(null);

        if (winResult.winner) {
            setWinner(winResult.winner);
            setWinningLine(winResult.line);
        } else {
            setTurn(turn === 'X' ? 'O' : 'X');
        }
    };

    const resetGame = () => {
        setPieces([]);
        setSkulls([]);
        setTurn('X');
        setWinner(null);
        setWinningLine(null);
        setInventory({ X: MAX_PIECES, O: MAX_PIECES });
        setSelectedBoneId(null);
    };

    return {
        pieces,
        skulls,
        turn,
        winner,
        winningLine,
        inventory,
        selectedBoneId,
        validMoves: [], // Could compute for hints
        placeBone,
        selectBone,
        moveBone,
        resetGame
    };
}
