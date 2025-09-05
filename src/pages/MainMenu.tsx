import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

const MainMenu = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [showAIOptions, setShowAIOptions] = useState(false);

  const menuItems = [
    {
      label: 'Player vs AI',
      action: () => setShowAIOptions(true),
      description: 'Challenge our intelligent AI opponents'
    },
    {
      label: 'Player vs Player',
      action: () => {
        dispatch({ type: 'START_GAME', mode: 'pvp' });
        navigate('/game');
      },
      description: 'Play against a friend locally'
    },
    {
      label: 'Rules of Chess',
      action: () => navigate('/rules'),
      description: 'Learn the complete rules and strategies'
    },
    {
      label: 'Settings',
      action: () => navigate('/settings'),
      description: 'Customize your gaming experience'
    }
  ];

  const aiDifficulties = [
    { level: 'ai-easy', label: 'Easy', description: 'Perfect for beginners' },
    { level: 'ai-medium', label: 'Medium', description: 'Balanced challenge' },
    { level: 'ai-hard', label: 'Hard', description: 'For experienced players' }
  ];

  const startAIGame = (difficulty: any) => {
    dispatch({ type: 'START_GAME', mode: difficulty });
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-royal flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold golden-text mb-4">Chess Master</h1>
          <p className="text-xl text-muted-foreground">Choose your battlefield</p>
        </motion.div>

        {!showAIOptions ? (
          /* Main Menu Options */
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur border-accent/20 hover:border-accent/50 transition-all duration-300 cursor-pointer menu-item"
                      onClick={item.action}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-2">{item.label}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-4xl text-accent opacity-70">♔</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* AI Difficulty Selection */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-card/90 backdrop-blur border-accent/30">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold golden-text mb-2">Choose AI Difficulty</h2>
                <p className="text-muted-foreground">Select your opponent's strength</p>
              </div>

              <div className="space-y-4 mb-8">
                {aiDifficulties.map((diff, index) => (
                  <motion.div
                    key={diff.level}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Button
                      onClick={() => startAIGame(diff.level)}
                      className="w-full p-6 royal-button text-left justify-start"
                      variant="outline"
                    >
                      <div>
                        <div className="text-xl font-semibold mb-1">{diff.label}</div>
                        <div className="text-sm opacity-80">{diff.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => setShowAIOptions(false)}
                variant="secondary"
                className="w-full"
              >
                ← Back to Main Menu
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;