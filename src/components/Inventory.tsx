
import { GobblePiece } from './GobblePiece';
import type { PlayerInventory, PieceSize, SelectedPiece } from '../hooks/useGobbleGame';
import type { Player } from '../utils/calculateWinner';
import clsx from 'clsx';

interface InventoryProps {
    player: Player;
    inventory: PlayerInventory;
    isActive: boolean;
    selectedPiece: SelectedPiece | null;
    onSelect: (size: PieceSize) => void;
}

export function Inventory({ player, inventory, isActive, selectedPiece, onSelect }: InventoryProps) {
    const sizes: PieceSize[] = [1, 2, 3]; // S, M, L

    return (
        <div className={clsx(
            "flex gap-2 p-2 rounded-xl transition-all duration-300 border-2 items-center justify-center",
            isActive ? "bg-surface border-brand shadow-lg scale-105" : "bg-transparent border-transparent opacity-60"
        )}>
            {sizes.map((size) => {
                const count = inventory[size];
                const isSelected = selectedPiece?.source === 'inventory' && selectedPiece.size === size && isActive;
                const isDisabled = count === 0 || !isActive;

                return (
                    <button
                        key={size}
                        onClick={() => !isDisabled && onSelect(size)}
                        disabled={isDisabled}
                        className={clsx(
                            "relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg transition-all",
                            isDisabled && "cursor-not-allowed grayscale opacity-30",
                            !isDisabled && "hover:bg-brand/10 cursor-pointer"
                        )}
                    >
                        {/* Count Badge */}
                        <div className="absolute -top-1 -right-1 z-20 bg-brand text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                            {count}
                        </div>

                        {/* Piece Visualization */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                            <GobblePiece player={player} size={size} isSelected={isSelected} />
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
