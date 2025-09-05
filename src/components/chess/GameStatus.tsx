import { GameStatus as Status, PieceColor, GameMode } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Crown, Zap, Users, Bot } from 'lucide-react';

interface GameStatusProps {
  status: Status;
  currentPlayer: PieceColor;
  gameMode: GameMode;
  isAIThinking?: boolean;
}

const GameStatus = ({ status, currentPlayer, gameMode, isAIThinking }: GameStatusProps) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'check':
        return `${currentPlayer === 'white' ? 'White' : 'Black'} King is in Check!`;
      case 'checkmate':
        const winner = currentPlayer === 'white' ? 'Black' : 'White';
        return `Checkmate! ${winner} Wins!`;
      case 'stalemate':
        return 'Stalemate - Draw!';
      case 'draw':
        return 'Game Drawn!';
      default:
        if (isAIThinking && currentPlayer === 'black') {
          return 'AI is thinking...';
        }
        return `${currentPlayer === 'white' ? 'White' : 'Black'}'s Turn`;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'check':
        return 'text-board-check';
      case 'checkmate':
        return 'golden-text';
      case 'stalemate':
      case 'draw':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const getGameModeIcon = () => {
    if (gameMode === 'pvp') return <Users className="h-5 w-5" />;
    return <Bot className="h-5 w-5" />;
  };

  const getGameModeText = () => {
    switch (gameMode) {
      case 'pvp':
        return 'Player vs Player';
      case 'ai-easy':
        return 'vs AI (Easy)';
      case 'ai-medium':
        return 'vs AI (Medium)';
      case 'ai-hard':
        return 'vs AI (Hard)';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 w-full max-w-md"
    >
      <Card className="p-4 bg-card/90 backdrop-blur border-accent/30 text-center">
        {/* Game Mode */}
        <div className="flex items-center justify-center gap-2 mb-3 text-sm text-muted-foreground">
          {getGameModeIcon()}
          <span>{getGameModeText()}</span>
        </div>

        {/* Current Turn/Status */}
        <motion.div
          key={status + currentPlayer}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center gap-3"
        >
          {/* Player Indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-4 h-4 rounded-full ${
                currentPlayer === 'white' ? 'bg-gray-200' : 'bg-gray-800'
              } border-2 border-accent`}
              animate={isAIThinking && currentPlayer === 'black' ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              } : {}}
              transition={{
                duration: 1,
                repeat: isAIThinking ? Infinity : 0,
                ease: 'easeInOut'
              }}
            />
            
            <h2 className={`text-xl font-bold ${getStatusColor()}`}>
              {getStatusMessage()}
            </h2>
          </div>

          {/* Status Icon */}
          {(status === 'checkmate' || status === 'check') && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: status === 'check' ? Infinity : 0,
                ease: 'easeInOut'
              }}
            >
              {status === 'checkmate' ? (
                <Crown className="h-6 w-6 text-accent" />
              ) : (
                <Zap className="h-6 w-6 text-board-check" />
              )}
            </motion.div>
          )}
        </motion.div>

        {/* AI Thinking Animation */}
        {isAIThinking && (
          <motion.div
            className="mt-3 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-accent rounded-full"
                  animate={{
                    y: [-4, 4, -4],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default GameStatus;