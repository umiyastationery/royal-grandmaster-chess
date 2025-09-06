import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGame } from '@/contexts/GameContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface SaveGameDialogProps {
  children: React.ReactNode;
}

const SaveGameDialog = ({ children }: SaveGameDialogProps) => {
  const { state, dispatch } = useGame();
  const [saveName, setSaveName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveGame = () => {
    const finalSaveName = saveName.trim() || `Game ${new Date().toLocaleString()}`;
    
    dispatch({ type: 'SAVE_GAME', saveName: finalSaveName });
    toast.success(`Game saved as "${finalSaveName}"`);
    
    setSaveName('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur border-accent/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold golden-text flex items-center gap-2">
            <Save className="w-6 h-6" />
            Save Game
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">White:</span>
              <span className="ml-2 font-semibold text-foreground">{state.players.white}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Black:</span>
              <span className="ml-2 font-semibold text-foreground">{state.players.black}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Mode:</span>
              <span className="ml-2 font-semibold text-foreground">
                {state.gameMode === 'pvp' ? 'Player vs Player' : `Player vs AI (${state.gameMode.replace('ai-', '')})`}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Current Turn:</span>
              <span className="ml-2 font-semibold text-foreground capitalize">{state.currentPlayer}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="saveName" className="text-lg font-semibold text-foreground">
              Save Name (Optional)
            </Label>
            <Input
              id="saveName"
              type="text"
              placeholder="Enter a name for this save..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="mt-2 bg-input/50 border-accent/30 focus:border-accent text-foreground"
              maxLength={50}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Leave empty to use automatic timestamp
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => setIsOpen(false)}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveGame}
            className="flex-1 royal-button"
          >
            Save Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveGameDialog;