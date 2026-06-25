import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState('enter');

  /* Timeline Map:
     0.0s -> enter        (Soft glow appears)
     1.0s -> reveal_text  (BazarGhar expands from center)
     3.0s -> shimmer      (Shimmer sweeps across text)
     4.5s -> tagline      (Tagline fades in below)
     6.5s -> exit         (Fade out to app)
     7.5s -> done         (Unmount)
  */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal_text'), 1000);
    const t2 = setTimeout(() => setPhase('shimmer'), 3000);
    const t3 = setTimeout(() => setPhase('tagline'), 4500);
    const t4 = setTimeout(() => setPhase('exit'), 6500);
    const t5 = setTimeout(() => onFinish(), 7500);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, [onFinish]);

  const text = "BazarGhar";
  const letters = Array.from(text);
  const centerIndex = 4; // 'r' is the center of the 9-letter word

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
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden select-none"
          aria-label="BazarGhar loading screen"
          aria-live="polite"
        >
          {/* 0.0s - 1.0s: Soft ambient center glow fading in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 50%)',
            }}
            aria-hidden="true"
          />

          {/* 3.0s: Subtle particle glow behind the text */}
          {showShimmer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              <div className="w-[300px] h-[100px] bg-gold/10 blur-[40px] rounded-full mix-blend-multiply" />
            </motion.div>
          )}

          {/* BRAND TEXT REVEAL */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex overflow-hidden py-4 px-8">
              {showText && letters.map((char, index) => {
                // Calculate distance from center to orchestrate the outward expansion
                const dist = Math.abs(index - centerIndex);
                // The center letter (dist=0) has 0 delay. Outer letters are delayed.
                const delay = dist * 0.15;
                
                // Initial X offset: Letters start closer to the center, then expand outward
                // If index < center, it starts right (positive X) and moves left (to 0).
                // If index > center, it starts left (negative X) and moves right (to 0).
                const initialX = (centerIndex - index) * 15;

                return (
                  <motion.span
                    key={index}
                    initial={{
                      opacity: 0,
                      x: initialX,
                      filter: 'blur(10px)',
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 1.2,
                      delay: delay,
                      ease: [0.16, 1, 0.3, 1], // Apple-style smooth ease-out
                    }}
                    className={`font-display font-semibold text-[12vw] md:text-[10rem] lg:text-[14rem] tracking-tight leading-none ${
                      index >= 5 ? 'text-amber-500' : 'text-slate-900'
                    }`}
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </motion.span>
                );
              })}

              {/* 3.0s: Luxury shimmer passing across the text */}
              {showShimmer && (
                <motion.div
                  initial={{ x: '-150%', opacity: 0 }}
                  animate={{ x: '250%', opacity: 0.6 }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 z-20 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent mix-blend-overlay skew-x-[-20deg]"
                />
              )}
            </div>

            {/* TAGLINE REVEAL (4.5s) */}
            <div className="h-8 mt-6 relative overflow-hidden flex items-center justify-center">
              {showTagline && (
                <motion.p
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-base md:text-lg tracking-[0.6em] uppercase text-slate-600 font-bold"
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
