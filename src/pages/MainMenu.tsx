import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import PlayerSetup from '@/components/game/PlayerSetup';
import LoadGameDialog from '@/components/game/LoadGameDialog';
import { GameMode } from '@/contexts/GameContext';
import { 
  Bot, 
  Users, 
  BookOpen, 
  Settings as SettingsIcon,
  Home,
  Trophy,
  Store,
  Clock,
  Crown,
  Zap
} from 'lucide-react';

const MainMenu = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>('pvp');

  const menuButtons = [
    {
      label: 'Player vs AI',
      action: () => setShowAIOptions(true),
      description: 'Challenge AI opponents',
      icon: <Bot className="w-8 h-8" />,
      secondaryIcon: <Zap className="w-6 h-6" />,
      className: 'green-button',
      textColor: 'text-white'
    },
    {
      label: 'Player vs Player',
      action: () => {
        setSelectedMode('pvp');
        setShowPlayerSetup(true);
      },
      description: 'Play against a friend',
      icon: <Users className="w-8 h-8" />,
      secondaryIcon: '♟️',
      className: 'red-button',
      textColor: 'text-white'
    },
    {
      label: 'Game Rules',
      action: () => navigate('/rules'),
      description: 'Learn chess rules',
      icon: <BookOpen className="w-8 h-8" />,
      secondaryIcon: '📚',
      className: 'yellow-button',
      textColor: 'text-black'
    },
    {
      label: 'Settings',
      action: () => navigate('/settings'),
      description: 'Customize experience',
      icon: <SettingsIcon className="w-8 h-8" />,
      secondaryIcon: <Crown className="w-6 h-6" />,
      className: 'blue-button',
      textColor: 'text-white'
    }
  ];

  const aiDifficulties: { level: GameMode; label: string; description: string; emoji: string }[] = [
    { level: 'ai-easy', label: 'Easy', description: 'Perfect for beginners', emoji: '🌱' },
    { level: 'ai-medium', label: 'Medium', description: 'Balanced challenge', emoji: '⚡' },
    { level: 'ai-hard', label: 'Hard', description: 'For experienced players', emoji: '🔥' }
  ];

  const startAIGame = (difficulty: GameMode) => {
    setSelectedMode(difficulty);
    setShowPlayerSetup(true);
  };

  const handleStartGame = (players: { white: string; black: string }) => {
    dispatch({ type: 'START_GAME', mode: selectedMode, players });
    navigate('/game');
  };

  const handleLoadGame = () => {
    navigate('/game');
  };

  const handleBack = () => {
    setShowAIOptions(false);
    setShowPlayerSetup(false);
  };

  // Decorative chess pieces for sides
  const chessDecorations = ['♔', '♕', '♖', '♗', '♘', '♙'];

  return (
    <div className="min-h-screen playful-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative chess pieces floating */}
      {chessDecorations.map((piece, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl text-yellow-300/30 pointer-events-none"
          style={{
            left: index < 3 ? '5%' : '90%',
            top: `${20 + (index % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
        >
          {piece}
        </motion.div>
      ))}

      <div className="max-w-4xl w-full z-10">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="game-title-3d mb-4 animate-[bounceIn_1.5s_ease-out]">
            Chess Master
          </h1>
          <motion.p 
            className="text-2xl md:text-3xl text-white/90 font-semibold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.3)'
            }}
          >
            Choose Your Move
          </motion.p>
        </motion.div>

        {!showAIOptions && !showPlayerSetup ? (
          /* Main Menu Grid */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {menuButtons.map((button, index) => (
              <motion.div
                key={button.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6, type: "spring" }}
                className={`game-button ${button.className} group`}
                onClick={button.action}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-white/90 group-hover:scale-110 transition-transform duration-200">
                      {button.icon}
                    </div>
                    <div>
                      <h3 className={`text-xl md:text-2xl font-bold ${button.textColor} mb-1`}
                          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        {button.label}
                      </h3>
                      <p className={`text-sm ${button.textColor}/80`}>
                        {button.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-200">
                    {typeof button.secondaryIcon === 'string' ? button.secondaryIcon : button.secondaryIcon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : showPlayerSetup ? (
          /* Player Setup */
          <PlayerSetup
            gameMode={selectedMode}
            onStartGame={handleStartGame}
            onBack={handleBack}
          />
        ) : (
          /* AI Difficulty Selection */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8 bg-black/40 backdrop-blur-lg border-white/20 rounded-3xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  Choose AI Difficulty
                </h2>
                <p className="text-white/80 text-lg">Select your opponent's strength</p>
              </div>

              <div className="space-y-4 mb-8">
                {aiDifficulties.map((diff, index) => (
                  <motion.div
                    key={diff.level}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Button
                      onClick={() => startAIGame(diff.level)}
                      className="w-full p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                               text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 
                               transition-all duration-300 border-2 border-white/20"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{diff.emoji}</span>
                          <div className="text-left">
                            <div className="text-xl font-bold">{diff.label}</div>
                            <div className="text-sm opacity-90">{diff.description}</div>
                          </div>
                        </div>
                        <div className="text-2xl opacity-70">🎯</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={handleBack}
                className="w-full p-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800
                         text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105
                         transition-all duration-300"
              >
                ← Back to Main Menu
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Bottom Arcade Navigation */}
        {!showAIOptions && !showPlayerSetup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="arcade-nav mx-auto max-w-md"
          >
            <div className="arcade-nav-button group">
              <Home className="w-6 h-6 text-white group-hover:text-yellow-200 transition-colors" />
            </div>
            <div className="arcade-nav-button group">
              <Trophy className="w-6 h-6 text-white group-hover:text-yellow-200 transition-colors" />
            </div>
            <LoadGameDialog onGameLoaded={handleLoadGame}>
              <div className="arcade-nav-button group">
                <Store className="w-6 h-6 text-white group-hover:text-yellow-200 transition-colors" />
              </div>
            </LoadGameDialog>
            <div className="arcade-nav-button group">
              <Clock className="w-6 h-6 text-white group-hover:text-yellow-200 transition-colors" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;