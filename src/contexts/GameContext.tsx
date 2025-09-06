import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';
export type GameMode = 'pvp' | 'ai-easy' | 'ai-medium' | 'ai-hard';
export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export interface Position {
  row: number;
  col: number;
}

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
  position: Position;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  boardTheme: 'classic' | 'marble' | 'neon' | 'dark';
  pieceStyle: 'classic' | 'modern' | 'futuristic';
}

export interface PlayerInfo {
  name: string;
  color: PieceColor;
}

export interface SavedGame {
  id: string;
  name: string;
  timestamp: string;
  gameState: GameState;
  players: {
    white: string;
    black: string;
  };
}

export interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: PieceColor;
  gameMode: GameMode;
  gameStatus: GameStatus;
  selectedSquare: Position | null;
  validMoves: Position[];
  capturedPieces: { white: ChessPiece[]; black: ChessPiece[] };
  moveHistory: string[];
  settings: GameSettings;
  isGameStarted: boolean;
  lastMove: { from: Position; to: Position } | null;
  players: {
    white: string;
    black: string;
  };
  // Save/Load functionality
  castlingRights: {
    whiteKingSide: boolean;
    whiteQueenSide: boolean;
    blackKingSide: boolean;
    blackQueenSide: boolean;
  };
  enPassantTarget: Position | null;
  halfMoveClock: number;
  fullMoveNumber: number;
}

type GameAction =
  | { type: 'START_GAME'; mode: GameMode; playerColor?: PieceColor; players?: { white: string; black: string } }
  | { type: 'SELECT_SQUARE'; position: Position }
  | { type: 'MOVE_PIECE'; from: Position; to: Position }
  | { type: 'SET_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'RESET_GAME' }
  | { type: 'SET_VALID_MOVES'; moves: Position[] }
  | { type: 'SET_GAME_STATUS'; status: GameStatus }
  | { type: 'SAVE_GAME'; saveName?: string }
  | { type: 'LOAD_GAME'; gameState: GameState; players: { white: string; black: string } }
  | { type: 'SET_PLAYERS'; players: { white: string; black: string } };

const initialGameSettings: GameSettings = {
  soundEnabled: true,
  musicVolume: 0.7,
  boardTheme: 'classic',
  pieceStyle: 'classic'
};

const createInitialBoard = (): (ChessPiece | null)[][] => {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place black pieces
  const blackPieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  blackPieces.forEach((type, col) => {
    board[0][col] = { type, color: 'black', position: { row: 0, col } };
  });
  
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black', position: { row: 1, col } };
  }
  
  // Place white pieces
  const whitePieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  whitePieces.forEach((type, col) => {
    board[7][col] = { type, color: 'white', position: { row: 7, col } };
  });
  
  for (let col = 0; col < 8; col++) {
    board[6][col] = { type: 'pawn', color: 'white', position: { row: 6, col } };
  }
  
  return board;
};

const initialState: GameState = {
  board: createInitialBoard(),
  currentPlayer: 'white',
  gameMode: 'pvp',
  gameStatus: 'playing',
  selectedSquare: null,
  validMoves: [],
  capturedPieces: { white: [], black: [] },
  moveHistory: [],
  settings: initialGameSettings,
  isGameStarted: false,
  lastMove: null,
  players: {
    white: 'Player 1',
    black: 'Player 2'
  },
  castlingRights: {
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true
  },
  enPassantTarget: null,
  halfMoveClock: 0,
  fullMoveNumber: 1
};

// Save/Load Game utilities
const saveGameToLocalStorage = (gameState: GameState, saveName?: string): string => {
  const savedGames = getSavedGames();
  const gameId = Date.now().toString();
  const timestamp = new Date().toISOString();
  const name = saveName || `Game ${new Date().toLocaleString()}`;
  
  const savedGame: SavedGame = {
    id: gameId,
    name,
    timestamp,
    gameState,
    players: gameState.players
  };
  
  savedGames.push(savedGame);
  localStorage.setItem('chessmaster_saved_games', JSON.stringify(savedGames));
  return name;
};

const getSavedGames = (): SavedGame[] => {
  const saved = localStorage.getItem('chessmaster_saved_games');
  return saved ? JSON.parse(saved) : [];
};

const deleteSavedGame = (gameId: string): void => {
  const savedGames = getSavedGames().filter(game => game.id !== gameId);
  localStorage.setItem('chessmaster_saved_games', JSON.stringify(savedGames));
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      const players = action.players || (
        action.mode === 'pvp' 
          ? { white: 'Player 1', black: 'Player 2' }
          : { white: 'Player', black: 'Computer' }
      );
      
      return {
        ...initialState,
        gameMode: action.mode,
        isGameStarted: true,
        settings: state.settings,
        players
      };
      
    case 'SELECT_SQUARE':
      const { position } = action;
      
      // Handle bounds checking - if invalid position, deselect
      if (position.row < 0 || position.row > 7 || position.col < 0 || position.col > 7) {
        return {
          ...state,
          selectedSquare: null,
          validMoves: []
        };
      }
      
      const piece = state.board[position.row][position.col];
      
      if (piece && piece.color === state.currentPlayer) {
        return {
          ...state,
          selectedSquare: position,
          validMoves: [] // Will be calculated by chess engine
        };
      }
      
      if (state.selectedSquare && state.validMoves.some(move => 
        move.row === position.row && move.col === position.col)) {
        // Valid move - will be handled by MOVE_PIECE
        return state;
      }
      
      return {
        ...state,
        selectedSquare: null,
        validMoves: []
      };
      
    case 'MOVE_PIECE':
      const newBoard = state.board.map(row => [...row]);
      const movingPiece = newBoard[action.from.row][action.from.col];
      const capturedPiece = newBoard[action.to.row][action.to.col];
      
      if (!movingPiece) return state;
      
      // Update piece position
      movingPiece.position = action.to;
      movingPiece.hasMoved = true;
      
      // Move piece
      newBoard[action.to.row][action.to.col] = movingPiece;
      newBoard[action.from.row][action.from.col] = null;
      
      // Handle captured piece
      const newCapturedPieces = { ...state.capturedPieces };
      if (capturedPiece) {
        newCapturedPieces[capturedPiece.color].push(capturedPiece);
      }
      
      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === 'white' ? 'black' : 'white',
        selectedSquare: null,
        validMoves: [],
        capturedPieces: newCapturedPieces,
        lastMove: { from: action.from, to: action.to }
      };
      
    case 'SET_VALID_MOVES':
      return {
        ...state,
        validMoves: action.moves
      };
      
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.status
      };
      
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings }
      };
      
    case 'RESET_GAME':
      return {
        ...initialState,
        settings: state.settings
      };
      
    case 'SAVE_GAME':
      const saveName = saveGameToLocalStorage(state, action.saveName);
      return state; // Don't change state, just save to localStorage
      
    case 'LOAD_GAME':
      return {
        ...action.gameState,
        settings: state.settings,
        players: action.players
      };
      
    case 'SET_PLAYERS':
      return {
        ...state,
        players: action.players
      };
      
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Export utility functions for use in components
export { getSavedGames, deleteSavedGame };