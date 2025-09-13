import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { GameMode } from '@/contexts/GameContext';
import PlayerName from '@/components/ui/PlayerName';

interface PlayerSetupProps {
  gameMode: GameMode;
  onStartGame: (players: { white: string; black: string }) => void;
  onBack: () => void;
}

const PlayerSetup = ({ gameMode, onStartGame, onBack }: PlayerSetupProps) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  
  const isAIMode = gameMode !== 'pvp';
  const aiDifficultyLabel = gameMode.replace('ai-', '').charAt(0).toUpperCase() + gameMode.replace('ai-', '').slice(1);

  const handleStartGame = () => {
    const players = isAIMode 
      ? { white: player1Name || 'Player', black: `AI (${aiDifficultyLabel})` }
      : { white: player1Name || 'Player 1', black: player2Name || 'Player 2' };
    
    onStartGame(players);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card className="p-8 bg-card/90 backdrop-blur border-accent/30">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold golden-text mb-2">
            {isAIMode ? 'Player vs AI Setup' : 'Player vs Player Setup'}
          </h2>
          <p className="text-muted-foreground">
            {isAIMode 
              ? `Enter your name to challenge the ${aiDifficultyLabel} AI`
              : 'Enter names for both players'
            }
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="player1" className="text-lg font-semibold text-foreground">
              {isAIMode ? 'Your Name' : 'Player 1 (White)'}
            </Label>
            <Input
              id="player1"
              type="text"
              placeholder={isAIMode ? 'Enter your name' : 'Enter Player 1 name'}
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="mt-2 text-lg p-4 bg-input/50 border-accent/30 focus:border-accent text-foreground"
              maxLength={20}
            />
          </div>

          {!isAIMode && (
            <div>
              <Label htmlFor="player2" className="text-lg font-semibold text-foreground">
                Player 2 (Black)
              </Label>
              <Input
                id="player2"
                type="text"
                placeholder="Enter Player 2 name"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="mt-2 text-lg p-4 bg-input/50 border-accent/30 focus:border-accent text-foreground"
                maxLength={20}
              />
            </div>
          )}

          {isAIMode && (
            <div className="p-4 bg-muted/30 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">AI Opponent:</span>
                <PlayerName 
                  name={`AI (${aiDifficultyLabel})`}
                  brandingClassName="text-amber-400/50"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            onClick={onBack}
            variant="secondary"
            className="flex-1"
          >
            ← Back
          </Button>
          <Button
            onClick={handleStartGame}
            className="flex-1 royal-button"
          >
            Start Game
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default PlayerSetup;