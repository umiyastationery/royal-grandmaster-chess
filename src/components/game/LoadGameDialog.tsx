import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useGame, getSavedGames, deleteSavedGame, SavedGame } from '@/contexts/GameContext';
import { toast } from 'sonner';
import { FolderOpen, Trash2, Calendar, Users, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadGameDialogProps {
  children: React.ReactNode;
  onGameLoaded?: () => void;
}

const LoadGameDialog = ({ children, onGameLoaded }: LoadGameDialogProps) => {
  const { dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);

  const refreshSavedGames = () => {
    setSavedGames(getSavedGames().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      refreshSavedGames();
    }
  };

  const handleLoadGame = (savedGame: SavedGame) => {
    dispatch({ 
      type: 'LOAD_GAME', 
      gameState: savedGame.gameState,
      players: savedGame.players
    });
    toast.success(`Loaded "${savedGame.name}"`);
    setIsOpen(false);
    onGameLoaded?.();
  };

  const handleDeleteGame = (gameId: string, gameName: string) => {
    deleteSavedGame(gameId);
    refreshSavedGames();
    toast.success(`Deleted "${gameName}"`);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getGameModeDisplay = (gameMode: string) => {
    if (gameMode === 'pvp') return 'Player vs Player';
    return `Player vs AI (${gameMode.replace('ai-', '')})`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur border-accent/30 max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold golden-text flex items-center gap-2">
            <FolderOpen className="w-6 h-6" />
            Load Saved Game
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {savedGames.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No saved games found</p>
              <p className="text-sm text-muted-foreground">Start a game and save it to see your saves here</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {savedGames.map((savedGame, index) => (
                <motion.div
                  key={savedGame.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-4 bg-card/60 border-accent/20 hover:border-accent/40 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{savedGame.name}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Players:</span>
                            <span className="font-semibold text-foreground">
                              {savedGame.players.white} vs {savedGame.players.black}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Gamepad2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Mode:</span>
                            <span className="font-semibold text-foreground">
                              {getGameModeDisplay(savedGame.gameState.gameMode)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Saved:</span>
                            <span className="font-semibold text-foreground">
                              {formatDate(savedGame.timestamp)}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Current Turn:</span>
                            <span className="ml-2 font-semibold text-foreground capitalize">
                              {savedGame.gameState.currentPlayer} ({savedGame.gameState.currentPlayer === 'white' ? savedGame.players.white : savedGame.players.black})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleLoadGame(savedGame)}
                          className="royal-button"
                          size="sm"
                        >
                          Load
                        </Button>
                        <Button
                          onClick={() => handleDeleteGame(savedGame.id, savedGame.name)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setIsOpen(false)}
            variant="secondary"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadGameDialog;