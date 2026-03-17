import { useState } from 'react';
import { motion } from 'framer-motion';
import { springs } from '../../lib/animations';

const WORDS = [
  { word: 'blue', prob: 0.35 },
  { word: 'clear', prob: 0.18 },
  { word: 'dark', prob: 0.14 },
  { word: 'gray', prob: 0.09 },
  { word: 'falling', prob: 0.04 },
];

function applyTemperature(options, temp) {
  const logits = options.map(o => Math.log(o.prob + 1e-10));
  const scaled = logits.map(l => l / temp);
  const maxS = Math.max(...scaled);
  const exps = scaled.map(s => Math.exp(s - maxS));
  const sum = exps.reduce((a, b) => a + b, 0);
  return options.map((o, i) => ({ ...o, prob: exps[i] / sum }));
}

export default function TemperatureDemo({ level, compact = false }) {
  const [temperature, setTemperature] = useState(1.0);
  const adjusted = applyTemperature(WORDS, temperature);
  const maxProb = Math.max(...adjusted.map(o => o.prob));
  const showNumbers = level >= 3;

  return (
    <div className={`flex flex-col ${compact ? 'p-3' : 'p-6 h-full justify-center'}`}>
      <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
        "The sky is ____" — drag the slider:
      </p>

      {/* slider */}
      <div className={compact ? 'mb-3' : 'mb-5'}>
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
          <span>Focused</span>
          {showNumbers && <span className="font-mono">T = {temperature.toFixed(1)}</span>}
          <span>Creative</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
      </div>

      {/* bars */}
      <div className="space-y-2">
        {adjusted.map((option, i) => (
          <div key={option.word} className="flex items-center gap-2">
            <span className="w-14 text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
              {option.word}
            </span>
            <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--accent)', opacity: 0.8 }}
                animate={{ width: `${(option.prob / maxProb) * 100}%` }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              />
            </div>
            {showNumbers && (
              <span className="w-12 text-right text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                {(option.prob * 100).toFixed(0)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
