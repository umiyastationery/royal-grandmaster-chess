import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const RulesPage = () => {
  const navigate = useNavigate();

  const pieceRules = [
    {
      name: 'Pawn ♟',
      rules: [
        'Moves forward one square',
        'Can move two squares on first move',
        'Captures diagonally',
        'Promotes to Queen, Rook, Bishop, or Knight when reaching opposite end'
      ]
    },
    {
      name: 'Rook ♜',
      rules: [
        'Moves any number of squares horizontally or vertically',
        'Cannot jump over other pieces',
        'Used in castling with the King'
      ]
    },
    {
      name: 'Knight ♞',
      rules: [
        'Moves in L-shape: 2 squares in one direction + 1 square perpendicular',
        'Only piece that can jump over others',
        'Always lands on opposite colored square'
      ]
    },
    {
      name: 'Bishop ♝',
      rules: [
        'Moves diagonally any number of squares',
        'Cannot jump over other pieces',
        'Always stays on same colored squares'
      ]
    },
    {
      name: 'Queen ♛',
      rules: [
        'Most powerful piece',
        'Combines Rook and Bishop moves',
        'Can move horizontally, vertically, or diagonally'
      ]
    },
    {
      name: 'King ♚',
      rules: [
        'Moves one square in any direction',
        'Cannot move into check',
        'Used in castling with Rook',
        'Game ends when checkmated'
      ]
    }
  ];

  const specialRules = [
    {
      name: 'Castling',
      description: 'A special move involving the King and Rook',
      conditions: [
        'Neither King nor Rook has moved',
        'No pieces between King and Rook',
        'King is not in check',
        'King does not pass through check'
      ]
    },
    {
      name: 'En Passant',
      description: 'Special pawn capture',
      conditions: [
        'Opponent pawn moves two squares from starting position',
        'Your pawn is adjacent to it',
        'Must capture immediately on next turn'
      ]
    },
    {
      name: 'Pawn Promotion',
      description: 'When pawn reaches opposite end',
      conditions: [
        'Can promote to Queen, Rook, Bishop, or Knight',
        'Usually promoted to Queen (strongest piece)',
        'Happens immediately upon reaching end'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-royal p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate('/menu')}
            variant="outline"
            className="royal-button"
          >
            ← Back to Menu
          </Button>
          
          <h1 className="text-4xl font-bold golden-text">Rules of Chess</h1>
          
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Game Objective */}
            <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
              <h2 className="text-2xl font-bold golden-text mb-4">Game Objective</h2>
              <p className="text-lg text-foreground mb-2">
                The goal is to <strong>checkmate</strong> your opponent's King.
              </p>
              <p className="text-muted-foreground">
                Checkmate occurs when the King is under attack and cannot escape capture.
              </p>
            </Card>

            {/* Basic Setup */}
            <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
              <h2 className="text-2xl font-bold golden-text mb-4">Board Setup</h2>
              <div className="space-y-2 text-foreground">
                <p>• 8×8 board with alternating light and dark squares</p>
                <p>• White pieces start on ranks 1-2, Black on ranks 7-8</p>
                <p>• White always moves first</p>
                <p>• Players alternate turns</p>
              </div>
            </Card>

            {/* Piece Movement */}
            <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
              <h2 className="text-2xl font-bold golden-text mb-4">Piece Movement</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pieceRules.map((piece, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-xl font-semibold text-accent">{piece.name}</h3>
                    <ul className="space-y-1">
                      {piece.rules.map((rule, rIndex) => (
                        <li key={rIndex} className="text-sm text-muted-foreground">
                          • {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* Special Moves */}
            <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
              <h2 className="text-2xl font-bold golden-text mb-4">Special Moves</h2>
              <div className="space-y-4">
                {specialRules.map((rule, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-accent mb-2">{rule.name}</h3>
                    <p className="text-foreground mb-2">{rule.description}</p>
                    <ul className="space-y-1">
                      {rule.conditions.map((condition, cIndex) => (
                        <li key={cIndex} className="text-sm text-muted-foreground">
                          • {condition}
                        </li>
                      ))}
                    </ul>
                    {index < specialRules.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </Card>

            {/* Game End Conditions */}
            <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
              <h2 className="text-2xl font-bold golden-text mb-4">Game End Conditions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-accent">Winning</h3>
                  <p className="text-muted-foreground">• Checkmate - opponent's King cannot escape attack</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold text-accent">Draw Conditions</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Stalemate - no legal moves but King is not in check</li>
                    <li>• Insufficient material - neither side can checkmate</li>
                    <li>• Threefold repetition - same position occurs three times</li>
                    <li>• 50-move rule - 50 moves without pawn move or capture</li>
                    <li>• Mutual agreement between players</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Chess Notation */}
            <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
              <h2 className="text-2xl font-bold golden-text mb-4">Chess Notation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-2">Files & Ranks</h3>
                  <p className="text-muted-foreground mb-2">Columns: a-h (left to right)</p>
                  <p className="text-muted-foreground">Rows: 1-8 (bottom to top for White)</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-2">Special Symbols</h3>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• + = Check</li>
                    <li>• # = Checkmate</li>
                    <li>• O-O = Kingside castling</li>
                    <li>• O-O-O = Queenside castling</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RulesPage;