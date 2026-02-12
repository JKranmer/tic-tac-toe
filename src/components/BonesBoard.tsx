import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BonesPiece } from './BonesPiece';
import { SkullPiece } from './SkullPiece';
import type { BonesGameState } from '../hooks/useBonesGame';

const CELL_SIZE = 64; // px

interface BonesBoardProps {
  gameState: BonesGameState;
}

export function BonesBoard({ gameState }: BonesBoardProps) {
  const { pieces, skulls, turn, winner, selectedBoneId, placeBone, selectBone, moveBone } = gameState;

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Auto-center logic
  useEffect(() => {
    if (!containerRef.current) return;

    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0;

    if (pieces.length > 0) {
      minX = Math.min(...pieces.map((p) => p.x));
      maxX = Math.max(...pieces.map((p) => p.x));
      minY = Math.min(...pieces.map((p) => p.y));
      maxY = Math.max(...pieces.map((p) => p.y));
    }

    // Center point in grid units
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Container center
    const rect = containerRef.current.getBoundingClientRect();
    const contCenterX = rect.width / 2;
    const contCenterY = rect.height / 2;

    // Calculate offset to bring grid center to container center
    // Grid coord (0,0) is at (0,0) relative to transform origin
    // We want (centerX * CELL) + OffsetX = ContCenterX
    const targetX = contCenterX - centerX * CELL_SIZE;
    const targetY = contCenterY - centerY * CELL_SIZE;

    setOffset({ x: targetX, y: targetY });
  }, [pieces, containerRef.current?.offsetWidth, containerRef.current?.offsetHeight]);

  // Handle board interaction
  const handleBoardClick = (e: React.MouseEvent) => {
    // Did we click a piece? If so, propagation stopped there.
    // If we are here, we clicked empty space.
    if (winner) return;

    // Calculate grid coordinates
    // Mouse Client - Container Rect gives pos in Container
    // Pos in Container - Offset gives pos relative to Grid (0,0)
    // Divide by CELL_SIZE to get index
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const localX = e.clientX - rect.left - offset.x; // Pixel relative to Grid Origin
    const localY = e.clientY - rect.top - offset.y;

    const gridX = Math.round(localX / CELL_SIZE);
    const gridY = Math.round(localY / CELL_SIZE);

    // Action
    if (selectedBoneId) {
      // Trying to move
      moveBone(gridX, gridY);
    } else {
      // Trying to place
      placeBone(gridX, gridY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left - offset.x;
    const localY = e.clientY - rect.top - offset.y;
    const gridX = Math.round(localX / CELL_SIZE);
    const gridY = Math.round(localY / CELL_SIZE);
    setHoverPos({ x: gridX, y: gridY });
  };

  return (
    <div
      className="w-full h-[60vh] bg-page border border-border rounded-2xl relative overflow-hidden custom-scrollbar cursor-crosshair shadow-inner"
      ref={containerRef}
      onClick={handleBoardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPos(null)}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px`
        }}
      ></div>

      {/* Game World Container */}
      <motion.div
        className="absolute top-0 left-0 w-0 h-0"
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Render Pieces */}
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            layoutId={piece.id} // Enable magic motion layout transitions for moving pieces
            className="absolute w-12 h-12 flex items-center justify-center z-10"
            style={{
              left: piece.x * CELL_SIZE - 24, // Centered on grid point
              top: piece.y * CELL_SIZE - 24
            }}
            onClick={(e) => {
              e.stopPropagation();
              selectBone(piece.id); // Select to move
            }}
          >
            <BonesPiece
              owner={piece.owner}
              isSelected={selectedBoneId === piece.id}
              isValidTarget={false} // Could compute valid move targets
              onClick={() => selectBone(piece.id)} // Redundant but explicit
            />
          </motion.div>
        ))}

        {/* Render Skulls */}
        {skulls.map((skull) => (
          <motion.div
            key={skull.id}
            className="absolute w-8 h-8 z-0 pointer-events-none"
            style={{
              // Skull is at center of square (x,y) -> (x+0.5, y+0.5)
              left: (skull.x + 0.5) * CELL_SIZE - 16,
              top: (skull.y + 0.5) * CELL_SIZE - 16
            }}
          >
            <SkullPiece owner={skull.owner} />
          </motion.div>
        ))}

        {/* Ghost Piece for Hover */}
        {!winner && hoverPos && (
          <div
            className="absolute w-12 h-12 flex items-center justify-center pointer-events-none z-20 opacity-50"
            style={{
              left: hoverPos.x * CELL_SIZE - 24,
              top: hoverPos.y * CELL_SIZE - 24
            }}
          >
            {/* Show ghost only if valid place? Or always show to indicate target? */}
            <BonesPiece owner={turn} isGhost />
          </div>
        )}
      </motion.div>

      {/* UI Overlay for Messages/Controls inside board area if needed */}
      <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur px-3 py-1 rounded text-xs font-mono text-secondary pointer-events-none border border-border">
        {hoverPos ? `(${hoverPos.x}, ${hoverPos.y})` : 'Hover to grid'}
      </div>
    </div>
  );
}
