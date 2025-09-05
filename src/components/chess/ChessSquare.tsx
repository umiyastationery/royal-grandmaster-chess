import { ChessPiece } from '@/contexts/GameContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChessSquareProps {
  piece: ChessPiece | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  isInCheck: boolean;
  onClick: () => void;
}

const ChessSquare = ({
  piece,
  isLight,
  isSelected,
  isValidMove,
  isLastMove,
  isInCheck,
  onClick
}: ChessSquareProps) => {
  // Chess piece Unicode symbols
  const pieceSymbols: Record<string, string> = {
    'white-king': '♔',
    'white-queen': '♕',
    'white-rook': '♖',
    'white-bishop': '♗',
    'white-knight': '♘',
    'white-pawn': '♙',
    'black-king': '♚',
    'black-queen': '♛',
    'black-rook': '♜',
    'black-bishop': '♝',
    'black-knight': '♞',
    'black-pawn': '♟'
  };

  const getPieceSymbol = (piece: ChessPiece) => {
    const key = `${piece.color}-${piece.type}`;
    return pieceSymbols[key] || '';
  };

  return (
    <motion.div
      className={cn(
        'chess-board-square w-full h-full flex items-center justify-center cursor-pointer relative',
        {
          'light': isLight,
          'dark': !isLight,
          'highlighted': isSelected,
          'check': isInCheck
        }
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        backgroundColor: isSelected 
          ? 'hsl(var(--board-highlight) / 0.6)' 
          : isLastMove
          ? 'hsl(var(--accent) / 0.3)'
          : isLight 
          ? 'hsl(var(--board-light))' 
          : 'hsl(var(--board-dark))',
        boxShadow: isSelected 
          ? 'inset 0 0 0 3px hsl(var(--board-highlight))' 
          : isInCheck
          ? 'inset 0 0 0 3px hsl(var(--board-check))'
          : undefined
      }}
    >
      {/* Valid Move Indicator */}
      {isValidMove && !piece && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-4 h-4 rounded-full bg-board-highlight opacity-60"
        />
      )}

      {/* Valid Capture Indicator */}
      {isValidMove && piece && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 rounded-full border-4 border-board-highlight opacity-60"
        />
      )}

      {/* Chess Piece */}
      {piece && (
        <motion.div
          className="text-4xl md:text-5xl lg:text-6xl select-none relative z-10"
          style={{
            filter: 'drop-shadow(var(--shadow-piece))',
            color: piece.color === 'white' ? '#f8f8ff' : '#2c2c2c'
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            duration: 0.3
          }}
          whileHover={{ scale: 1.1 }}
        >
          {getPieceSymbol(piece)}
        </motion.div>
      )}

      {/* Glow effect for selected pieces */}
      {isSelected && piece && (
        <motion.div
          className="absolute inset-0 rounded"
          animate={{
            boxShadow: [
              '0 0 0 0 hsl(var(--accent) / 0.7)',
              '0 0 0 10px hsl(var(--accent) / 0)',
              '0 0 0 0 hsl(var(--accent) / 0.7)'
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  );
};

export default ChessSquare;