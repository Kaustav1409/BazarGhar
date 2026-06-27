import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState('enter');

  /* Timeline Map (Premium Cinematic Pacing - ~3.0s total):
     0.0s -> enter        (Deep forest screen, soft fade in)
     0.2s -> reveal_text  (Logo slowly scales from 0.96 to 1.00)
     1.2s -> shimmer      (Subtle metallic light sweep)
     1.8s -> tagline      (Tagline fades up)
     2.8s -> exit         (Fade smoothly into Home page)
     3.2s -> done         (Unmount)
  */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal_text'), 200);
    const t2 = setTimeout(() => setPhase('shimmer'), 1200);
    const t3 = setTimeout(() => setPhase('tagline'), 1800);
    const t4 = setTimeout(() => setPhase('exit'), 2800);
    const t5 = setTimeout(() => onFinish(), 3200);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, [onFinish]);

  const text = "BazarGhar";
  const letters = Array.from(text);

  const showText = ['reveal_text', 'shimmer', 'tagline', 'exit'].includes(phase);
  const showShimmer = ['shimmer', 'tagline', 'exit'].includes(phase);
  const showTagline = ['tagline', 'exit'].includes(phase);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000] overflow-hidden select-none" // Black screen as requested
          aria-label="BazarGhar loading screen"
          aria-live="polite"
        >
          {/* Ambient center glow fading in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(163, 133, 96, 0.05) 0%, transparent 50%)',
            }}
            aria-hidden="true"
          />

          {/* BRAND TEXT & SCALING CONTAINER */}
          <div className="relative z-10 flex flex-col items-center">
            {showText && (
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1.00, opacity: 1 }}
                transition={{ 
                  scale: { duration: 2.8, ease: "easeOut" },
                  opacity: { duration: 1.2, ease: "easeOut" }
                }}
                className="relative flex overflow-hidden py-4 px-10"
              >
                {/* Text render */}
                <div className="font-brand font-extrabold text-[5.5vw] md:text-[4.5rem] lg:text-[6.5rem] tracking-tight leading-none text-surface-white">
                  {letters.map((char, index) => (
                    <span 
                      key={index} 
                      className={index >= 5 ? 'text-secondary' : 'text-surface-white'}
                      style={{ 
                        display: 'inline-block',
                        // Subtle manual kerning adjustments for Syne
                        marginRight: char === 'r' ? '-0.02em' : '0em'
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>

                {/* Subtle metallic sweep */}
                {showShimmer && (
                  <motion.div
                    initial={{ x: '-150%', opacity: 0 }}
                    animate={{ x: '250%', opacity: 0.5 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 z-20 w-[15%] bg-gradient-to-r from-transparent via-white to-transparent mix-blend-overlay skew-x-[-20deg]"
                  />
                )}
              </motion.div>
            )}

            {/* TAGLINE REVEAL */}
            <div className="h-10 mt-3 relative overflow-hidden flex items-center justify-center">
              {showTagline && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 1, 0.25, 1], // Luxury ease
                  }}
                  className="font-body text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-surface-white/60 font-medium"
                >
                  Har Zaroorat Ek Jagah
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
