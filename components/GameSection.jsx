'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import MaskedText from './ui/MaskedText';
import dynamic from 'next/dynamic';

// Dynamically import game to avoid SSR issues
const TowerDefenseGame = dynamic(() => import('./TowerDefenseGame'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto" />
        <p className="text-white">Loading game...</p>
      </div>
    </div>
  ),
});

export default function GameSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <section ref={ref} className="relative bg-gray-900 py-32 px-6 md:px-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-gray-400 font-light">
              Need a Break?
            </span>
          </motion.div>

          <div className="space-y-3 mb-8">
            <MaskedText delay={0.2}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                TAKE A
              </h2>
            </MaskedText>
            <MaskedText delay={0.4}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-white">
                Break
              </h2>
            </MaskedText>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Relax your mind with our mini tower defense game. Protect the library from 
            knowledge thieves while taking a quick study break!
          </motion.p>
        </div>

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative bg-gray-800 border-2 border-gray-700 overflow-hidden">
            {/* Game Canvas */}
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
              {!gameStarted ? (
                // Start Overlay
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-center"
                  >
                    <div className="mb-8">
                      <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Library Defense
                      </h3>
                      <p className="text-gray-400 mb-8">
                        Protect the library! Use arrow keys to move and spacebar to shoot.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setGameStarted(true)}
                      className="group relative px-12 py-4 bg-white text-gray-900 font-bold text-lg overflow-hidden transition-all duration-300 hover:px-14"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Start Game
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">←</kbd>
                        <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">→</kbd>
                        <span>Move</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Space</kbd>
                        <span>Shoot</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                // Game Active - Render the actual game
                <TowerDefenseGame />
              )}
            </div>

            {/* Game Stats Bar */}
            <div className="bg-gray-900 px-6 py-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-6">
                  <div>
                    <span className="text-gray-500">High Score:</span>
                    <span className="text-white font-bold ml-2">24,500</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Players Today:</span>
                    <span className="text-white font-bold ml-2">1,337</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  View Leaderboard →
                </button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { title: 'Easy Controls', desc: 'Simple keyboard controls for quick gameplay' },
              { title: 'Quick Sessions', desc: 'Perfect 5-minute study breaks' },
              { title: 'Track Progress', desc: 'Compete on global leaderboards' }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                className="bg-gray-800 border border-gray-700 p-6 hover:border-gray-600 transition-colors"
              >
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
