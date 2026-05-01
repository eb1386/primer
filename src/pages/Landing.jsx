import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { springs } from '../lib/animations';

const fadeUpItem = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...springs.standard, delay },
  },
});

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-5 sm:px-6 py-6 sm:py-8">
      {/* wordmark */}
      <motion.div
        className="self-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className="font-display text-base sm:text-lg tracking-normal" style={{ color: 'var(--text-primary)' }}>
          Primer
        </span>
      </motion.div>

      {/* hero */}
      <div className="flex flex-col items-center text-center max-w-2xl -mt-8 px-1">
        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          {...fadeUpItem(0)}
        >
          Learn how AI actually works.
        </motion.h1>

        <motion.p
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
          {...fadeUpItem(0.1)}
        >
          From your first prediction to understanding real neural networks. No experience needed.
        </motion.p>

        <motion.button
          className="mt-8 sm:mt-10 px-8 py-3.5 rounded-lg text-base font-medium text-white cursor-pointer relative overflow-hidden active:scale-95 transition-transform"
          style={{ backgroundColor: 'var(--accent)' }}
          {...fadeUpItem(0.2)}
          whileHover={{ scale: 1.02, backgroundColor: 'var(--accent-hover)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/learn')}
        >
          Start learning
        </motion.button>
      </div>

      {/* footer */}
      <motion.div
        className="text-xs sm:text-sm"
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Built by{' '}
        <a
          href="https://github.com/eb1386"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-muted)' }}
        >
          eb1386
        </a>
      </motion.div>
    </div>
  );
}
