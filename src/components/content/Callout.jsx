import { motion } from 'framer-motion';
import { springs } from '../../lib/animations';

export default function Callout({ children }) {
  return (
    <motion.div
      className="my-6 px-5 py-4 rounded-r-lg text-sm"
      style={{
        backgroundColor: 'var(--accent-subtle)',
        borderLeft: '3px solid var(--accent)',
        color: 'var(--text-primary)',
      }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0, transition: springs.standard }}
    >
      <div className="flex gap-3 items-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>
          <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9" cy="5.5" r="0.75" fill="currentColor"/>
        </svg>
        <div style={{ lineHeight: 1.65 }}>{children}</div>
      </div>
    </motion.div>
  );
}
