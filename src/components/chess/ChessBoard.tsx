import { ChessPiece, Position, GameStatus } from '@/contexts/GameContext';
import ChessSquare from './ChessSquare';
import { motion } from 'framer-motion';

interface ChessBoardProps {
  board: (ChessPiece | null)[][];
  onSquareClick: (row: number, col: number) => void;
  selectedSquare: Position | null;
  validMoves: Position[];
  lastMove: { from: Position; to: Position } | null;
  gameStatus: GameStatus;
}

const ChessBoard = ({
  board,
  onSquareClick,
  selectedSquare,
  validMoves,
  lastMove,
  gameStatus
}: ChessBoardProps) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="relative">
      {/* Board Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-board p-4 rounded-lg shadow-royal"
      >
        {/* Rank Labels (Left) */}
        <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-around items-center w-8">
          {ranks.map((rank) => (
            <div key={rank} className="text-accent font-bold text-lg">
              {rank}
            </div>
          ))}
        </div>

        {/* File Labels (Bottom) */}
        <div className="absolute bottom-0 left-8 right-8 flex justify-around items-center h-8">
          {files.map((file) => (
            <div key={file} className="text-accent font-bold text-lg">
              {file}
            </div>
          ))}
        </div>

        {/* Chess Board Grid */}
        <div className="grid grid-cols-8 gap-0 w-80 h-80 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] ml-8 mb-8">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isSelected = 
                selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
              const isValidMove = validMoves.some(
                move => move.row === rowIndex && move.col === colIndex
              );
              const isLastMove = 
                lastMove && 
                ((lastMove.from.row === rowIndex && lastMove.from.col === colIndex) ||
                 (lastMove.to.row === rowIndex && lastMove.to.col === colIndex));
              const isInCheck = 
                piece?.type === 'king' && 
                gameStatus === 'check' && 
                piece.color === (rowIndex < 4 ? 'black' : 'white');

              return (
                <ChessSquare
                  key={`${rowIndex}-${colIndex}`}
                  piece={piece}
                  isLight={isLight}
                  isSelected={isSelected}
                  isValidMove={isValidMove}
                  isLastMove={isLastMove}
                  isInCheck={isInCheck}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                />
              );
            })
          )}
        </div>
      </motion.div>

      {/* Game Over Overlay */}
      {(gameStatus === 'checkmate' || gameStatus === 'stalemate') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
        >
          <div className="bg-card/95 backdrop-blur p-8 rounded-lg border border-accent text-center">
            <h2 className="text-3xl font-bold golden-text mb-2">
              {gameStatus === 'checkmate' ? 'Checkmate!' : 'Stalemate!'}
            </h2>
            <p className="text-xl text-foreground">
              {gameStatus === 'checkmate' ? 'Game Over' : 'Draw'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChessBoard;