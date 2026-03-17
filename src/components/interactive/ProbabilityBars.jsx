import { motion } from 'framer-motion';
import { springs } from '../../lib/animations';

const WORDS = [
  { word: 'blue', prob: 0.35 },
  { word: 'clear', prob: 0.18 },
  { word: 'dark', prob: 0.14 },
  { word: 'gray', prob: 0.09 },
  { word: 'red', prob: 0.04 },
  { word: 'beautiful', prob: 0.03 },
];

export default function ProbabilityBars({ level, compact = false }) {
  const maxProb = Math.max(...WORDS.map(w => w.prob));
  const showFormula = level >= 4;
  const showNumbers = level >= 3;

  return (
    <div className="p-6 h-full flex flex-col justify-center">
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
        "The sky is ____"
      </p>
      <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        {showNumbers ? 'Probability of each word:' : 'Which words fit best?'}
      </p>

      {showFormula && (
        <div
          className="mb-6 px-4 py-3 rounded-lg font-mono text-xs"
          style={{ backgroundColor: 'var(--bg-code)', color: 'var(--code-text)' }}
        >
          P(word) = e^(score) / Σ e^(scores)
        </div>
      )}

      <div className="space-y-3">
        {WORDS.map((item, i) => {
          const barWidth = (item.prob / maxProb) * 100;

          return (
            <div key={item.word} className="flex items-center gap-3">
              <span className="w-20 text-sm font-mono text-right flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                {item.word}
              </span>
              <div className="flex-1 h-6 rounded overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: 'var(--accent)', opacity: 0.8 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ ...springs.standard, delay: i * 0.06 }}
                />
              </div>
              {showNumbers && (
                <span className="w-12 text-xs font-mono text-right flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {(item.prob * 100).toFixed(0)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
