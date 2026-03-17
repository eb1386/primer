import { motion, AnimatePresence } from 'framer-motion';
import { LEVELS } from '../../lib/constants';
import { springs, overlayScale } from '../../lib/animations';

export default function LevelSelector({ onSelect }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 sm:py-0 overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        {...overlayScale}
      >
        <div className="w-full max-w-xl my-auto">
          <motion.h1
            className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-center mb-2 sm:mb-3"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { ...springs.standard, delay: 0.1 } }}
          >
            What's your experience?
          </motion.h1>
          <motion.p
            className="text-center mb-6 sm:mb-10 text-sm sm:text-base"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { ...springs.standard, delay: 0.15 } }}
          >
            Pick a level. You can change this anytime.
          </motion.p>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            {LEVELS.map((level, i) => (
              <motion.button
                key={level.id}
                onClick={() => onSelect(level.id)}
                className="w-full text-left px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl border cursor-pointer transition-colors active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { ...springs.standard, delay: 0.2 + i * 0.06 },
                }}
                whileHover={{
                  y: -2,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  borderColor: 'var(--accent)',
                  transition: springs.quick,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
                  <span className="font-display text-base sm:text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                    {level.name}
                  </span>
                  <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {level.description}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs mt-1 sm:mt-1.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                  {level.preview}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
