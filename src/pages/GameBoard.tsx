import { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { ChessEngine } from '@/utils/chessEngine';
import { Button } from '@/components/ui/button';
import ChessBoard from '@/components/chess/ChessBoard';
import GameStatus from '@/components/chess/GameStatus';
import CapturedPieces from '@/components/chess/CapturedPieces';
import { toast } from 'sonner';

const GameBoard = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Handle AI moves
  useEffect(() => {
    if (state.currentPlayer === 'black' && 
        state.gameMode !== 'pvp' && 
        state.gameStatus === 'playing' &&
        !isAIThinking) {
      
      setIsAIThinking(true);
      
      // Simulate AI thinking time
      setTimeout(() => {
        const difficulty = state.gameMode.replace('ai-', '') as 'easy' | 'medium' | 'hard';
        const aiMove = ChessEngine.generateAIMove(state.board, difficulty);
        
        if (aiMove) {
          dispatch({
            type: 'MOVE_PIECE',
            from: aiMove.from,
            to: aiMove.to
          });
          
          // Play move sound
          if (state.settings.soundEnabled) {
            // Sound would be played here
          }
        }
        
        setIsAIThinking(false);
      }, 1000 + Math.random() * 1000); // 1-2 seconds thinking time
    }
  }, [state.currentPlayer, state.gameMode, state.gameStatus, isAIThinking, state.board, dispatch, state.settings.soundEnabled]);

  // Check game status after each move
  useEffect(() => {
    if (state.gameStatus === 'playing') {
      const isInCheck = ChessEngine.isInCheck(state.board, state.currentPlayer);
      const isCheckmate = ChessEngine.isCheckmate(state.board, state.currentPlayer);
      const isStalemate = ChessEngine.isStalemate(state.board, state.currentPlayer);
      
      if (isCheckmate) {
        const winner = state.currentPlayer === 'white' ? 'Black' : 'White';
        dispatch({ type: 'SET_GAME_STATUS', status: 'checkmate' });
        toast(`Checkmate! ${winner} wins!`);
      } else if (isStalemate) {
        dispatch({ type: 'SET_GAME_STATUS', status: 'stalemate' });
        toast('Stalemate! The game is a draw.');
      } else if (isInCheck) {
        dispatch({ type: 'SET_GAME_STATUS', status: 'check' });
        toast('Check!');
      } else {
        dispatch({ type: 'SET_GAME_STATUS', status: 'playing' });
      }
    }
  }, [state.board, state.currentPlayer, dispatch, state.gameStatus]);

  const handleSquareClick = (row: number, col: number) => {
    if (state.gameStatus === 'checkmate' || state.gameStatus === 'stalemate') return;
    if (isAIThinking && state.currentPlayer === 'black') return;

    const position = { row, col };
    const piece = state.board[row][col];

    // If a square is selected and this is a valid move
    if (state.selectedSquare && 
        state.validMoves.some(move => move.row === row && move.col === col)) {
      
      dispatch({
        type: 'MOVE_PIECE',
        from: state.selectedSquare,
        to: position
      });
      
      // Play move sound
      if (state.settings.soundEnabled) {
        // Sound would be played here
      }
      
      return;
    }

    // Select piece if it belongs to current player
    if (piece && piece.color === state.currentPlayer) {
      const validMoves = ChessEngine.getAllValidMoves(state.board, piece, position)
        .filter(move => {
          // Filter out moves that would put own king in check
          const newBoard = state.board.map(row => [...row]);
          newBoard[move.row][move.col] = piece;
          newBoard[position.row][position.col] = null;
          return !ChessEngine.isInCheck(newBoard, piece.color);
        });

      dispatch({ type: 'SELECT_SQUARE', position });
      dispatch({ type: 'SET_VALID_MOVES', moves: validMoves });
    } else {
      // Deselect if clicking empty square or opponent piece
      dispatch({ type: 'SELECT_SQUARE', position: { row: -1, col: -1 } });
      dispatch({ type: 'SET_VALID_MOVES', moves: [] });
    }
  };

  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/menu');
  };

  if (!state.isGameStarted) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-royal p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => navigate('/menu')}
            variant="outline"
            className="royal-button"
          >
            ← Main Menu
          </Button>
          
          <h1 className="text-3xl font-bold golden-text">Chess Master</h1>
          
          <Button
            onClick={handleNewGame}
            variant="outline"
            className="royal-button"
          >
            New Game
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Captured Pieces - Black */}
          <div className="lg:col-span-1">
            <CapturedPieces
              pieces={state.capturedPieces.black}
              color="black"
              title="Captured by White"
            />
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <GameStatus
              status={state.gameStatus}
              currentPlayer={state.currentPlayer}
              gameMode={state.gameMode}
              isAIThinking={isAIThinking}
            />
            
            <ChessBoard
              board={state.board}
              onSquareClick={handleSquareClick}
              selectedSquare={state.selectedSquare}
              validMoves={state.validMoves}
              lastMove={state.lastMove}
              gameStatus={state.gameStatus}
            />
          </div>

          {/* Captured Pieces - White */}
          <div className="lg:col-span-1">
            <CapturedPieces
              pieces={state.capturedPieces.white}
              color="white"
              title="Captured by Black"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;