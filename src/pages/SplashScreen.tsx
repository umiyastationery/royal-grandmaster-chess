import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showChessboard, setShowChessboard] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [visiblePieces, setVisiblePieces] = useState<number>(0);

  useEffect(() => {
    // Cinematic animation sequence
    const timers = [
      setTimeout(() => setShowChessboard(true), 800),
      setTimeout(() => setShowTitle(true), 1800),
      setTimeout(() => setShowSubtitle(true), 2800),
      setTimeout(() => setShowCredits(true), 3300),
      setTimeout(() => navigate('/menu'), 5500)
    ];

    // Chess pieces appear one by one
    const pieceTimers: NodeJS.Timeout[] = [];
    for (let i = 0; i < 32; i++) {
      pieceTimers.push(
        setTimeout(() => setVisiblePieces(i + 1), 1200 + i * 60)
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      pieceTimers.forEach(clearTimeout);
    };
  }, [navigate]);

  const chessSymbols = ['♔', '♕', '♖', '♗', '♘', '♙'];
  const pieces = [
    { symbol: '♜', row: 0, col: 0 }, { symbol: '♞', row: 0, col: 1 }, { symbol: '♝', row: 0, col: 2 }, { symbol: '♛', row: 0, col: 3 },
    { symbol: '♚', row: 0, col: 4 }, { symbol: '♝', row: 0, col: 5 }, { symbol: '♞', row: 0, col: 6 }, { symbol: '♜', row: 0, col: 7 },
    { symbol: '♟', row: 1, col: 0 }, { symbol: '♟', row: 1, col: 1 }, { symbol: '♟', row: 1, col: 2 }, { symbol: '♟', row: 1, col: 3 },
    { symbol: '♟', row: 1, col: 4 }, { symbol: '♟', row: 1, col: 5 }, { symbol: '♟', row: 1, col: 6 }, { symbol: '♟', row: 1, col: 7 },
    { symbol: '♙', row: 6, col: 0 }, { symbol: '♙', row: 6, col: 1 }, { symbol: '♙', row: 6, col: 2 }, { symbol: '♙', row: 6, col: 3 },
    { symbol: '♙', row: 6, col: 4 }, { symbol: '♙', row: 6, col: 5 }, { symbol: '♙', row: 6, col: 6 }, { symbol: '♙', row: 6, col: 7 },
    { symbol: '♖', row: 7, col: 0 }, { symbol: '♘', row: 7, col: 1 }, { symbol: '♗', row: 7, col: 2 }, { symbol: '♕', row: 7, col: 3 },
    { symbol: '♔', row: 7, col: 4 }, { symbol: '♗', row: 7, col: 5 }, { symbol: '♘', row: 7, col: 6 }, { symbol: '♖', row: 7, col: 7 }
  ];

  // Generate particles for magical effect
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 2
  }));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Royal gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          background: 'var(--gradient-royal)',
          backgroundSize: '400% 400%'
        }}
      />

      {/* Magical particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-accent rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [-20, -100]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Glowing chessboard background */}
      <AnimatePresence>
        {showChessboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="grid grid-cols-8 gap-0 w-[60vmin] h-[60vmin] rounded-lg overflow-hidden shadow-2xl">
              {Array.from({ length: 64 }, (_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isLight = (row + col) % 2 === 0;
                const piece = pieces.find(p => p.row === row && p.col === col);
                const pieceIndex = pieces.indexOf(piece!);
                const shouldShowPiece = piece && pieceIndex < visiblePieces;

                return (
                  <motion.div
                    key={i}
                    className={`aspect-square flex items-center justify-center relative ${
                      isLight ? 'bg-board-light/40' : 'bg-board-dark/60'
                    }`}
                    style={{
                      boxShadow: isLight 
                        ? 'inset 0 0 20px hsl(var(--accent) / 0.1)' 
                        : 'inset 0 0 20px hsl(var(--primary) / 0.2)'
                    }}
                  >
                    {shouldShowPiece && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 0.8,
                          ease: 'backOut',
                          delay: pieceIndex * 0.06
                        }}
                        className="text-2xl md:text-3xl"
                        style={{
                          color: 'hsl(var(--accent))',
                          filter: 'drop-shadow(0 0 10px hsl(var(--accent) / 0.8))',
                          animation: `pieceGoldenShimmer 1.2s ease-out ${pieceIndex * 0.06}s both`
                        }}
                      >
                        {piece.symbol}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="text-center z-20 px-8">
        {/* Main Title with Cinematic Glow */}
        <AnimatePresence>
          {showTitle && (
            <motion.h1
              initial={{ opacity: 0, scale: 0.3, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-6xl md:text-8xl font-bold mb-6 golden-text relative"
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', serif",
                animation: 'titleGlow 2s ease-out forwards',
                textShadow: '0 0 30px hsl(var(--accent) / 0.6), 0 0 60px hsl(var(--secondary) / 0.4)'
              }}
            >
              Chess Master
              {/* Sparkle effects around title */}
              <motion.div
                className="absolute -top-4 -left-4 w-3 h-3 bg-accent rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: 1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
              <motion.div
                className="absolute top-2 -right-6 w-2 h-2 bg-secondary rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Subtitle with Glowing Underline */}
        <AnimatePresence>
          {showSubtitle && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="relative mb-12"
            >
              <motion.p
                className="text-2xl md:text-3xl text-accent font-light relative"
                style={{
                  fontFamily: "'Orbitron', 'Exo 2', sans-serif",
                  textShadow: '0 0 20px hsl(var(--accent) / 0.5)'
                }}
              >
                by Keval Patel
              </motion.p>
              {/* Animated glowing underline */}
              <motion.div
                initial={{ width: '0%', opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
                style={{
                  boxShadow: '0 0 15px hsl(var(--accent))'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credits Footer */}
        <AnimatePresence>
          {showCredits && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full"
            >
              <p 
                className="text-sm md:text-base text-muted-foreground font-light tracking-wide"
                style={{
                  textShadow: '0 0 10px hsl(var(--muted-foreground) / 0.3)'
                }}
              >
                Game Concept: Keval Patel   |   Developed by: Kp's Creations
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central glowing orb effect */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full -z-10"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary-glow) / 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;