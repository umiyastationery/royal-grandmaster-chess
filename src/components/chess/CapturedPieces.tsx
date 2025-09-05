import { ChessPiece, PieceColor } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface CapturedPiecesProps {
  pieces: ChessPiece[];
  color: PieceColor;
  title: string;
}

const CapturedPieces = ({ pieces, color, title }: CapturedPiecesProps) => {
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

  // Calculate material advantage
  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
  };

  const totalValue = pieces.reduce((sum, piece) => sum + pieceValues[piece.type], 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: color === 'white' ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-4 bg-card/80 backdrop-blur border-accent/20 h-fit">
        <div className="text-center mb-3">
          <h3 className="text-lg font-semibold golden-text">{title}</h3>
          {totalValue > 0 && (
            <p className="text-sm text-muted-foreground">
              Material Value: {totalValue}
            </p>
          )}
        </div>

        <div className="min-h-[100px]">
          {pieces.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              No pieces captured
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              <AnimatePresence>
                {pieces.map((piece, index) => (
                  <motion.div
                    key={`${piece.type}-${index}`}
                    initial={{ 
                      opacity: 0, 
                      scale: 0,
                      rotate: -180,
                      y: -20 
                    }}
                    animate={{ 
                      opacity: 0.7, 
                      scale: 1,
                      rotate: 0,
                      y: 0 
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0,
                      rotate: 180 
                    }}
                    transition={{ 
                      duration: 0.5,
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15
                    }}
                    className="flex items-center justify-center p-2 rounded bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <span 
                      className="text-2xl select-none"
                      style={{
                        color: piece.color === 'white' ? '#f8f8ff' : '#2c2c2c',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }}
                    >
                      {getPieceSymbol(piece)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Piece count by type */}
        {pieces.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              {Object.entries(
                pieces.reduce((acc, piece) => {
                  acc[piece.type] = (acc[piece.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="capitalize">{type}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default CapturedPieces;