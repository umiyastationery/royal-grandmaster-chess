import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  const handleSoundToggle = (enabled: boolean) => {
    dispatch({
      type: 'SET_SETTINGS',
      settings: { soundEnabled: enabled }
    });
  };

  const handleVolumeChange = (value: number[]) => {
    dispatch({
      type: 'SET_SETTINGS',
      settings: { musicVolume: value[0] }
    });
  };

  const handleBoardThemeChange = (theme: 'classic' | 'marble' | 'neon' | 'dark') => {
    dispatch({
      type: 'SET_SETTINGS',
      settings: { boardTheme: theme }
    });
  };

  const handlePieceStyleChange = (style: 'classic' | 'modern' | 'futuristic') => {
    dispatch({
      type: 'SET_SETTINGS',
      settings: { pieceStyle: style }
    });
  };

  const boardThemes = [
    { id: 'classic', name: 'Classic Wood', description: 'Traditional wooden chess board' },
    { id: 'marble', name: 'Marble', description: 'Elegant marble finish' },
    { id: 'neon', name: 'Neon', description: 'Futuristic glowing board' },
    { id: 'dark', name: 'Dark Mode', description: 'Dark theme for night play' }
  ];

  const pieceStyles = [
    { id: 'classic', name: 'Classic', description: 'Traditional Staunton pieces' },
    { id: 'modern', name: 'Modern', description: 'Contemporary minimalist design' },
    { id: 'futuristic', name: 'Futuristic', description: 'Sci-fi inspired pieces' }
  ];

  return (
    <div className="min-h-screen bg-gradient-royal p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate('/menu')}
            variant="outline"
            className="royal-button"
          >
            ← Back to Menu
          </Button>
          
          <h1 className="text-4xl font-bold golden-text">Settings</h1>
          
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        <div className="space-y-6">
          {/* Audio Settings */}
          <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
            <h2 className="text-2xl font-bold golden-text mb-4">Audio Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-toggle" className="text-lg font-medium">
                    Sound Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable piece movement and capture sounds
                  </p>
                </div>
                <Switch
                  id="sound-toggle"
                  checked={state.settings.soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-lg font-medium">
                  Music Volume: {Math.round(state.settings.musicVolume * 100)}%
                </Label>
                <Slider
                  value={[state.settings.musicVolume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Board Theme */}
          <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
            <h2 className="text-2xl font-bold golden-text mb-4">Board Theme</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {boardThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    state.settings.boardTheme === theme.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => handleBoardThemeChange(theme.id as any)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${
                      state.settings.boardTheme === theme.id 
                        ? 'bg-accent' 
                        : 'bg-muted'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Piece Style */}
          <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
            <h2 className="text-2xl font-bold golden-text mb-4">Piece Style</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {pieceStyles.map((style) => (
                <div
                  key={style.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    state.settings.pieceStyle === style.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => handlePieceStyleChange(style.id as any)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{style.name}</h3>
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${
                      state.settings.pieceStyle === style.id 
                        ? 'bg-accent' 
                        : 'bg-muted'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Game Options */}
          <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
            <h2 className="text-2xl font-bold golden-text mb-4">Game Options</h2>
            
            <div className="space-y-4">
              <Button
                onClick={() => {
                  dispatch({ type: 'RESET_GAME' });
                  navigate('/menu');
                }}
                variant="outline"
                className="w-full royal-button"
              >
                Reset Game Statistics
              </Button>
              
              <Button
                onClick={() => {
                  // Reset to default settings
                  dispatch({
                    type: 'SET_SETTINGS',
                    settings: {
                      soundEnabled: true,
                      musicVolume: 0.7,
                      boardTheme: 'classic',
                      pieceStyle: 'classic'
                    }
                  });
                }}
                variant="secondary"
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </div>
          </Card>

          {/* Credits */}
          <Card className="p-6 bg-card/90 backdrop-blur border-accent/30">
            <h2 className="text-2xl font-bold golden-text mb-4">Credits</h2>
            <div className="space-y-2 text-center">
              <p className="text-foreground">
                <strong>Game Concept:</strong> Keval Patel
              </p>
              <p className="text-muted-foreground">
                Development: KP'S Creations
              </p>
              <p className="text-muted-foreground">
                Special Thanks: Keval Patel
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;