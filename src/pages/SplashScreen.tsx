import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setShowTitle(true), 500);
    const timer2 = setTimeout(() => setShowSubtitle(true), 1500);
    const timer3 = setTimeout(() => navigate('/menu'), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate]);

  const chessSymbols = ['♔', '♕', '♖', '♗', '♘', '♙'];

  return (
    <div className="min-h-screen bg-gradient-royal flex items-center justify-center relative overflow-hidden">
      {/* Animated chess pieces background */}
      <div className="absolute inset-0">
        {chessSymbols.map((symbol, index) => (
          <motion.div
            key={index}
            initial={{ y: '100vh', opacity: 0, rotate: 0 }}
            animate={{ y: '0vh', opacity: 0.1, rotate: 360 }}
            transition={{
              duration: 2,
              delay: index * 0.2,
              ease: 'easeOut',
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' }
            }}
            className="absolute text-6xl text-accent"
            style={{
              left: `${10 + index * 15}%`,
              animationDelay: `${index * 0.3}s`
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      <div className="text-center z-10">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={showTitle ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-7xl font-bold mb-4 golden-text"
          style={{ fontFamily: 'serif' }}
        >
          Chess Master
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={showSubtitle ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-2xl text-accent italic font-light"
        >
          This Game Was Developed by Keval Patel
        </motion.p>

        {/* Glowing orb effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl -z-10"
        />
      </div>
    </div>
  );
};

export default SplashScreen;