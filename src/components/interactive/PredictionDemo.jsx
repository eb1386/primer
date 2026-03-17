import { useState } from 'react';
import { motion } from 'framer-motion';
import { springs } from '../../lib/animations';

const SENTENCES = [
  {
    text: 'The sky is',
    options: [
      { word: 'blue', prob: 0.35 },
      { word: 'clear', prob: 0.18 },
      { word: 'dark', prob: 0.14 },
      { word: 'gray', prob: 0.09 },
      { word: 'falling', prob: 0.04 },
    ],
  },
  {
    text: 'She opened the',
    options: [
      { word: 'door', prob: 0.32 },
      { word: 'book', prob: 0.19 },
      { word: 'window', prob: 0.13 },
      { word: 'box', prob: 0.10 },
      { word: 'letter', prob: 0.07 },
    ],
  },
  {
    text: 'I love to',
    options: [
      { word: 'eat', prob: 0.18 },
      { word: 'read', prob: 0.15 },
      { word: 'travel', prob: 0.14 },
      { word: 'cook', prob: 0.11 },
      { word: 'dance', prob: 0.08 },
    ],
  },
  {
    text: '2 + 2 =',
    options: [
      { word: '4', prob: 0.88 },
      { word: '5', prob: 0.03 },
      { word: '3', prob: 0.02 },
      { word: '22', prob: 0.01 },
      { word: 'four', prob: 0.01 },
    ],
  },
  {
    text: 'Once upon a',
    options: [
      { word: 'time', prob: 0.82 },
      { word: 'day', prob: 0.04 },
      { word: 'hill', prob: 0.02 },
      { word: 'star', prob: 0.01 },
      { word: 'dream', prob: 0.01 },
    ],
  },
];

function applyTemperature(options, temp) {
  if (temp === 1) return options;
  const logits = options.map(o => Math.log(o.prob + 1e-10));
  const scaled = logits.map(l => l / temp);
  const maxS = Math.max(...scaled);
  const exps = scaled.map(s => Math.exp(s - maxS));
  const sum = exps.reduce((a, b) => a + b, 0);
  return options.map((o, i) => ({ ...o, prob: exps[i] / sum }));
}

export default function PredictionDemo({ level, compact = false }) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [temperature, setTemperature] = useState(1.0);

  const sentence = SENTENCES[sentenceIndex];
  const adjustedOptions = applyTemperature(sentence.options, temperature);
  const maxProb = Math.max(...adjustedOptions.map(o => o.prob));

  const handleSelect = (word) => {
    setSelected(word);
  };

  const nextSentence = () => {
    setSentenceIndex((sentenceIndex + 1) % SENTENCES.length);
    setSelected(null);
  };

  const showNumbers = level >= 3;
  const showLogits = level >= 5;

  return (
    <div className={`flex flex-col justify-center ${compact ? 'p-3' : 'p-6 h-full'}`}>
      {/* sentence */}
      <div className={compact ? 'mb-3' : 'mb-8'}>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
          Complete the sentence:
        </p>
        <p className={`font-display font-medium ${compact ? 'text-base' : 'text-2xl'}`} style={{ color: 'var(--text-primary)' }}>
          {sentence.text}{' '}
          <span
            className="inline-block px-3 py-0.5 rounded border-b-2 border-dashed min-w-[80px] text-center"
            style={{
              borderColor: selected ? 'var(--success)' : 'var(--accent)',
              color: selected ? 'var(--success)' : 'var(--text-muted)',
            }}
          >
            {selected || '____'}
          </span>
        </p>
      </div>

      {/* options */}
      <div className="space-y-2.5">
        {adjustedOptions.map((option, i) => {
          const barWidth = (option.prob / maxProb) * 100;
          const isSelected = selected === option.word;
          const isTop = option.prob === maxProb;

          return (
            <motion.button
              key={option.word}
              onClick={() => handleSelect(option.word)}
              className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-left cursor-pointer border-none"
              style={{
                backgroundColor: isSelected
                  ? (isTop ? 'rgba(61, 139, 106, 0.1)' : 'rgba(217, 79, 59, 0.08)')
                  : 'transparent',
              }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springs.standard, delay: i * 0.06 }}
              whileHover={{ backgroundColor: 'var(--interactive-bg)' }}
              whileTap={{ scale: 0.98 }}
            >
              {/* word */}
              <span
                className="w-20 text-sm font-medium flex-shrink-0 font-mono"
                style={{ color: isSelected && isTop ? 'var(--success)' : 'var(--text-primary)' }}
              >
                {option.word}
              </span>

              {/* bar */}
              <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: isSelected && isTop ? 'var(--success)' : 'var(--accent)',
                    opacity: isSelected && !isTop ? 0.5 : 0.8,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ ...springs.standard, delay: i * 0.06 }}
                />
              </div>

              {/* probability */}
              {showNumbers && (
                <span className="w-14 text-right text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {(option.prob * 100).toFixed(1)}%
                </span>
              )}

              {/* logits */}
              {showLogits && (
                <span className="w-16 text-right text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  z={Math.log(option.prob + 1e-10).toFixed(2)}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* feedback */}
      {selected && (
        <motion.div
          className="mt-4 text-sm text-center"
          style={{ color: selected === adjustedOptions[0].word ? 'var(--success)' : 'var(--text-secondary)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: springs.quick }}
        >
          {selected === adjustedOptions[0].word
            ? "You matched the model's top pick!"
            : `The model's top pick was "${adjustedOptions[0].word}"`}
        </motion.div>
      )}

      {/* next */}
      <div className="mt-4 flex justify-center">
        <motion.button
          onClick={nextSentence}
          className="text-sm px-5 py-2.5 rounded-lg cursor-pointer border-none font-medium"
          style={{
            color: selected ? 'white' : 'var(--text-secondary)',
            backgroundColor: selected ? 'var(--accent)' : 'var(--interactive-bg)',
          }}
          animate={selected ? { scale: [1, 1.03, 1] } : {}}
          transition={selected ? { duration: 0.4, delay: 0.3 } : {}}
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
        >
          Try another sentence →
        </motion.button>
      </div>

      {/* labels */}
      {level <= 2 && (
        <div className="mt-4 flex justify-between text-xs px-24" style={{ color: 'var(--text-muted)' }}>
          <span>less likely</span>
          <span>more likely</span>
        </div>
      )}
    </div>
  );
}
