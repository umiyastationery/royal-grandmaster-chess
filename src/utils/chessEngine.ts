import { ChessPiece, Position, PieceType, PieceColor } from '@/contexts/GameContext';

export class ChessEngine {
  static isValidMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    piece: ChessPiece
  ): boolean {
    // Basic boundary check
    if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false;
    
    // Can't capture own piece
    const targetPiece = board[to.row][to.col];
    if (targetPiece && targetPiece.color === piece.color) return false;
    
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);
    
    switch (piece.type) {
      case 'pawn':
        return this.isValidPawnMove(board, from, to, piece, rowDiff, colDiff);
      case 'rook':
        return this.isValidRookMove(board, from, to, rowDiff, colDiff);
      case 'knight':
        return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
      case 'bishop':
        return this.isValidBishopMove(board, from, to, rowDiff, colDiff, absRowDiff, absColDiff);
      case 'queen':
        return this.isValidQueenMove(board, from, to, rowDiff, colDiff, absRowDiff, absColDiff);
      case 'king':
        return absRowDiff <= 1 && absColDiff <= 1;
      default:
        return false;
    }
  }
  
  private static isValidPawnMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    piece: ChessPiece,
    rowDiff: number,
    colDiff: number
  ): boolean {
    const direction = piece.color === 'white' ? -1 : 1;
    const startingRow = piece.color === 'white' ? 6 : 1;
    const targetPiece = board[to.row][to.col];
    
    // Forward move
    if (colDiff === 0) {
      if (targetPiece) return false; // Can't capture forward
      
      // Single step
      if (rowDiff === direction) return true;
      
      // Double step from starting position
      if (from.row === startingRow && rowDiff === 2 * direction) return true;
    }
    
    // Diagonal capture
    if (Math.abs(colDiff) === 1 && rowDiff === direction) {
      return targetPiece !== null; // Must capture
    }
    
    return false;
  }
  
  private static isValidRookMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    rowDiff: number,
    colDiff: number
  ): boolean {
    // Must move in straight line
    if (rowDiff !== 0 && colDiff !== 0) return false;
    
    return this.isPathClear(board, from, to);
  }
  
  private static isValidBishopMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    rowDiff: number,
    colDiff: number,
    absRowDiff: number,
    absColDiff: number
  ): boolean {
    // Must move diagonally
    if (absRowDiff !== absColDiff) return false;
    
    return this.isPathClear(board, from, to);
  }
  
  private static isValidQueenMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    rowDiff: number,
    colDiff: number,
    absRowDiff: number,
    absColDiff: number
  ): boolean {
    // Queen = Rook + Bishop
    const isRookMove = (rowDiff === 0) !== (colDiff === 0); // XOR: exactly one is zero
    const isBishopMove = absRowDiff === absColDiff;
    
    if (!isRookMove && !isBishopMove) return false;
    
    return this.isPathClear(board, from, to);
  }
  
  private static isPathClear(board: (ChessPiece | null)[][], from: Position, to: Position): boolean {
    const rowStep = Math.sign(to.row - from.row);
    const colStep = Math.sign(to.col - from.col);
    
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;
    
    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  }
  
  static getAllValidMoves(board: (ChessPiece | null)[][], piece: ChessPiece, from: Position): Position[] {
    const validMoves: Position[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const to = { row, col };
        if (this.isValidMove(board, from, to, piece)) {
          validMoves.push(to);
        }
      }
    }
    
    return validMoves;
  }
  
  static isInCheck(board: (ChessPiece | null)[][], color: PieceColor): boolean {
    // Find king position
    let kingPosition: Position | null = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          kingPosition = { row, col };
          break;
        }
      }
      if (kingPosition) break;
    }
    
    if (!kingPosition) return false;
    
    // Check if any enemy piece can attack the king
    const enemyColor = color === 'white' ? 'black' : 'white';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === enemyColor) {
          if (this.isValidMove(board, { row, col }, kingPosition, piece)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  
  static isCheckmate(board: (ChessPiece | null)[][], color: PieceColor): boolean {
    if (!this.isInCheck(board, color)) return false;
    
    // Try all possible moves to see if any can escape check
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const validMoves = this.getAllValidMoves(board, piece, { row, col });
          
          for (const move of validMoves) {
            // Simulate the move
            const newBoard = board.map(r => [...r]);
            const capturedPiece = newBoard[move.row][move.col];
            newBoard[move.row][move.col] = piece;
            newBoard[row][col] = null;
            
            // Check if still in check after move
            if (!this.isInCheck(newBoard, color)) {
              return false; // Found a move that escapes check
            }
          }
        }
      }
    }
    
    return true; // No moves can escape check
  }
  
  static isStalemate(board: (ChessPiece | null)[][], color: PieceColor): boolean {
    if (this.isInCheck(board, color)) return false;
    
    // Check if player has any legal moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const validMoves = this.getAllValidMoves(board, piece, { row, col });
          
          for (const move of validMoves) {
            // Simulate the move
            const newBoard = board.map(r => [...r]);
            newBoard[move.row][move.col] = piece;
            newBoard[row][col] = null;
            
            // Check if move puts own king in check
            if (!this.isInCheck(newBoard, color)) {
              return false; // Found a legal move
            }
          }
        }
      }
    }
    
    return true; // No legal moves available
  }
  
  // AI Move Generation
  static generateAIMove(board: (ChessPiece | null)[][], difficulty: 'easy' | 'medium' | 'hard'): { from: Position; to: Position } | null {
    const aiColor = 'black'; // AI plays black
    const allMoves: { from: Position; to: Position; piece: ChessPiece }[] = [];
    
    // Collect all possible moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === aiColor) {
          const validMoves = this.getAllValidMoves(board, piece, { row, col });
          
          for (const move of validMoves) {
            // Simulate move to ensure it doesn't put AI in check
            const newBoard = board.map(r => [...r]);
            newBoard[move.row][move.col] = piece;
            newBoard[row][col] = null;
            
            if (!this.isInCheck(newBoard, aiColor)) {
              allMoves.push({ from: { row, col }, to: move, piece });
            }
          }
        }
      }
    }
    
    if (allMoves.length === 0) return null;
    
    switch (difficulty) {
      case 'easy':
        return this.getRandomMove(allMoves);
      case 'medium':
        return this.getBestMoveSimple(board, allMoves);
      case 'hard':
        return this.getBestMoveAdvanced(board, allMoves);
      default:
        return this.getRandomMove(allMoves);
    }
  }
  
  private static getRandomMove(moves: { from: Position; to: Position; piece: ChessPiece }[]): { from: Position; to: Position } {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return { from: randomMove.from, to: randomMove.to };
  }
  
  private static getBestMoveSimple(
    board: (ChessPiece | null)[][],
    moves: { from: Position; to: Position; piece: ChessPiece }[]
  ): { from: Position; to: Position } {
    // Simple AI: Prioritize captures
    const captures = moves.filter(move => board[move.to.row][move.to.col] !== null);
    
    if (captures.length > 0) {
      // Choose highest value capture
      let bestCapture = captures[0];
      let bestValue = this.getPieceValue(board[bestCapture.to.row][bestCapture.to.col]!.type);
      
      for (const capture of captures) {
        const value = this.getPieceValue(board[capture.to.row][capture.to.col]!.type);
        if (value > bestValue) {
          bestValue = value;
          bestCapture = capture;
        }
      }
      
      return { from: bestCapture.from, to: bestCapture.to };
    }
    
    return this.getRandomMove(moves);
  }
  
  private static getBestMoveAdvanced(
    board: (ChessPiece | null)[][],
    moves: { from: Position; to: Position; piece: ChessPiece }[]
  ): { from: Position; to: Position } {
    // Advanced AI: Use simple evaluation
    let bestMove = moves[0];
    let bestScore = -Infinity;
    
    for (const move of moves) {
      const score = this.evaluateMove(board, move);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return { from: bestMove.from, to: bestMove.to };
  }
  
  private static evaluateMove(
    board: (ChessPiece | null)[][],
    move: { from: Position; to: Position; piece: ChessPiece }
  ): number {
    let score = 0;
    
    // Capture value
    const capturedPiece = board[move.to.row][move.to.col];
    if (capturedPiece) {
      score += this.getPieceValue(capturedPiece.type);
    }
    
    // Center control
    const centerDistance = Math.abs(move.to.row - 3.5) + Math.abs(move.to.col - 3.5);
    score += (7 - centerDistance) * 0.1;
    
    // Piece development
    if (move.piece.type === 'knight' || move.piece.type === 'bishop') {
      if (move.from.row === 0) score += 0.2; // Moving from back rank
    }
    
    return score;
  }
  
  private static getPieceValue(type: PieceType): number {
    const values = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 0
    };
    return values[type];
  }
}