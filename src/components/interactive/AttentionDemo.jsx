import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '../../lib/animations';

const SENTENCES = [
  {
    words: ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'],
    targets: {
      'it': {
        targetIndex: 7,
        weights: [0.05, 0.35, 0.08, 0.02, 0.02, 0.04, 0.06, 0.0, 0.12, 0.26],
        explanation: '"it" refers to "the cat" — the model pays heavy attention to "cat" to resolve the pronoun.',
      },
      'tired': {
        targetIndex: 9,
        weights: [0.03, 0.22, 0.15, 0.02, 0.01, 0.03, 0.05, 0.18, 0.08, 0.0],
        explanation: '"tired" is about the cat\'s state — the model looks at "cat," "sat," and "it" to understand who is tired.',
      },
      'sat': {
        targetIndex: 2,
        weights: [0.12, 0.38, 0.0, 0.10, 0.04, 0.18, 0.03, 0.05, 0.05, 0.05],
        explanation: '"sat" focuses on "cat" (who sat) and "mat" (where it sat).',
      },
    },
  },
  {
    words: ['The', 'bank', 'by', 'the', 'river', 'was', 'steep'],
    targets: {
      'bank': {
        targetIndex: 1,
        weights: [0.10, 0.0, 0.08, 0.05, 0.42, 0.10, 0.25],
        explanation: '"bank" could mean a financial institution or a riverbank. "river" and "steep" disambiguate it to a riverbank.',
      },
      'steep': {
        targetIndex: 6,
        weights: [0.04, 0.30, 0.06, 0.03, 0.22, 0.12, 0.0],
        explanation: '"steep" describes the bank — the model attends to "bank" and "river" for context.',
      },
    },
  },
  {
    words: ['She', 'gave', 'him', 'the', 'book', 'that', 'she', 'had', 'written'],
    targets: {
      'him': {
        targetIndex: 2,
        weights: [0.28, 0.22, 0.0, 0.05, 0.18, 0.04, 0.10, 0.06, 0.07],
        explanation: '"him" is the recipient — the model looks at "She" (the giver), "gave" (the action), and "book" (what was given).',
      },
      'written': {
        targetIndex: 8,
        weights: [0.10, 0.05, 0.03, 0.04, 0.25, 0.08, 0.22, 0.12, 0.0],
        explanation: '"written" connects to "she" (who wrote) and "book" (what was written).',
      },
    },
  },
  {
    words: ['I', 'went', 'to', 'the', 'store', 'but', 'it', 'was', 'closed'],
    targets: {
      'it': {
        targetIndex: 6,
        weights: [0.04, 0.06, 0.02, 0.05, 0.45, 0.08, 0.0, 0.10, 0.20],
        explanation: '"it" refers to "store" — the model strongly attends to "store" to resolve what was closed.',
      },
      'closed': {
        targetIndex: 8,
        weights: [0.03, 0.12, 0.02, 0.04, 0.30, 0.10, 0.18, 0.08, 0.0],
        explanation: '"closed" is about the store\'s state — the model looks at "store," "it," and "went" for context.',
      },
    },
  },
];

function fakeQK(word, dim = 4) {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = ((hash << 5) - hash) + word.charCodeAt(i);
    hash |= 0;
  }
  const vec = [];
  for (let i = 0; i < dim; i++) {
    hash = ((hash * 1103515245) + 12345) | 0;
    vec.push((((hash >> 16) & 0x7fff) / 32768 * 4 - 2).toFixed(1));
  }
  return vec;
}

export default function AttentionDemo({ level, compact = false }) {
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const sentence = SENTENCES[sentenceIdx];
  const targetOptions = Object.keys(sentence.targets);
  const [targetWord, setTargetWord] = useState(targetOptions[0]);
  const [userPicks, setUserPicks] = useState(new Set());
  const [revealed, setRevealed] = useState(false);

  const target = sentence.targets[targetWord];
  const weights = target?.weights || [];
  const targetIndex = target?.targetIndex ?? 0;

  const showPercentages = level >= 3;
  const showQK = level >= 4;

  const topAttentionIndices = useMemo(() => {
    const indexed = weights
      .map((w, i) => ({ weight: w, index: i }))
      .filter((_, i) => i !== targetIndex)
      .sort((a, b) => b.weight - a.weight);
    return indexed.slice(0, 3).filter(item => item.weight > 0.05);
  }, [weights, targetIndex]);

  const feedback = useMemo(() => {
    if (!revealed || userPicks.size === 0) return null;

    const topIndicesSet = new Set(topAttentionIndices.map(item => item.index));
    const topOneIndex = topAttentionIndices.length > 0 ? topAttentionIndices[0].index : null;

    const matchedCount = [...userPicks].filter(idx => topIndicesSet.has(idx)).length;
    const missedCount = userPicks.size - matchedCount;
    const hitTopOne = topOneIndex !== null && userPicks.has(topOneIndex);

    if (hitTopOne && missedCount === 0) {
      return {
        text: 'Great intuition! You found the most important word.',
        type: 'excellent',
      };
    }
    if (hitTopOne && missedCount > 0) {
      return {
        text: `You found the key word, but also picked ${missedCount} that the model didn't focus on.`,
        type: 'good',
      };
    }
    if (matchedCount >= 1 && missedCount === 0) {
      return {
        text: 'Nice! You spotted the important connections.',
        type: 'good',
      };
    }
    if (matchedCount >= 1) {
      return {
        text: `You got ${matchedCount} right, but ${missedCount} of your picks weren't high-attention words.`,
        type: 'good',
      };
    }
    return {
      text: 'Interesting — the model focused on different words than you expected.',
      type: 'neutral',
    };
  }, [revealed, userPicks, topAttentionIndices]);

  const handleWordClick = useCallback((word, idx) => {
    if (revealed) return;
    if (idx === targetIndex) return;
    setUserPicks(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, [revealed, targetIndex]);

  const handleReveal = () => setRevealed(true);

  const handleReset = () => {
    setUserPicks(new Set());
    setRevealed(false);
  };

  const handleChangeTarget = (newTarget) => {
    setTargetWord(newTarget);
    setUserPicks(new Set());
    setRevealed(false);
  };

  const handleChangeSentence = () => {
    const nextIdx = (sentenceIdx + 1) % SENTENCES.length;
    setSentenceIdx(nextIdx);
    const nextSentence = SENTENCES[nextIdx];
    const nextTargets = Object.keys(nextSentence.targets);
    setTargetWord(nextTargets[0]);
    setUserPicks(new Set());
    setRevealed(false);
  };

  const maxWeight = Math.max(...weights);

  return (
    <div className={`flex flex-col justify-center ${compact ? 'p-3' : 'p-6 h-full'}`}>
      {/* prompt */}
      <div className="mb-4">
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
          {level <= 2
            ? 'Which words does the AI look at to understand the highlighted word?'
            : 'Which words receive the most attention for the target word?'}
        </p>
      </div>

      {/* targets */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Target:</span>
        {targetOptions.map(t => {
          const tData = sentence.targets[t];
          const isSelected = t === targetWord;
          return (
            <motion.button
              key={`${t}-${tData.targetIndex}`}
              onClick={() => handleChangeTarget(t)}
              className="px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border"
              style={{
                backgroundColor: isSelected ? 'var(--accent)' : 'transparent',
                color: isSelected ? 'white' : 'var(--text-secondary)',
                borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {t}
            </motion.button>
          );
        })}
      </div>

      {/* sentence */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {sentence.words.map((word, idx) => {
          const isTarget = idx === targetIndex;
          const isPicked = userPicks.has(idx);
          const weight = weights[idx] || 0;
          const heatOpacity = revealed ? Math.max(0.08, weight / maxWeight) : 1;

          return (
            <motion.button
              key={`${word}-${idx}`}
              onClick={() => handleWordClick(word, idx)}
              className="relative px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border-none"
              style={{
                backgroundColor: isTarget
                  ? 'var(--accent)'
                  : revealed
                    ? `rgba(201, 137, 58, ${heatOpacity * 0.6})`
                    : isPicked
                      ? 'var(--interactive-bg)'
                      : 'var(--bg-primary)',
                color: isTarget ? 'white' : 'var(--text-primary)',
                outline: isPicked && !revealed ? '2px solid var(--accent)' : 'none',
                outlineOffset: '1px',
              }}
              whileHover={!isTarget && !revealed ? { scale: 1.05 } : {}}
              whileTap={!isTarget && !revealed ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.quick, delay: idx * 0.03 }}
            >
              {word}
              {/* bar */}
              {revealed && !isTarget && (
                <motion.div
                  className="absolute bottom-0 left-1 right-1 rounded-full"
                  style={{
                    height: 3,
                    backgroundColor: 'var(--code-number)',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: weight / maxWeight }}
                  transition={springs.standard}
                />
              )}
              {/* percentage */}
              {revealed && showPercentages && !isTarget && weight > 0.03 && (
                <motion.span
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono"
                  style={{ color: 'var(--code-number)' }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.quick, delay: 0.2 }}
                >
                  {(weight * 100).toFixed(0)}%
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* actions */}
      <div className="flex gap-2 mb-4">
        {!revealed ? (
          <motion.button
            onClick={handleReveal}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
          >
            {userPicks.size > 0 ? 'Check my guesses' : 'Reveal attention'}
          </motion.button>
        ) : (
          <motion.button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer border"
            style={{ backgroundColor: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
            whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            whileTap={{ scale: 0.98 }}
          >
            Try again
          </motion.button>
        )}
        <motion.button
          onClick={handleChangeSentence}
          className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none"
          style={{
            backgroundColor: revealed ? 'var(--accent)' : 'var(--interactive-bg)',
            color: revealed ? 'white' : 'var(--text-secondary)',
          }}
          animate={revealed ? { scale: [1, 1.03, 1] } : {}}
          transition={revealed ? { duration: 0.4, delay: 0.5 } : {}}
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Next sentence"
        >
          Next sentence →
        </motion.button>
      </div>

      {/* feedback */}
      <AnimatePresence>
        {revealed && feedback && (
          <motion.div
            className="mb-3 px-3 py-2.5 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: feedback.type === 'excellent'
                ? 'rgba(34, 139, 94, 0.12)'
                : feedback.type === 'good'
                  ? 'rgba(34, 139, 94, 0.08)'
                  : 'rgba(140, 140, 140, 0.08)',
              color: feedback.type === 'neutral'
                ? 'var(--text-secondary)'
                : '#22875E',
              border: '1px solid',
              borderColor: feedback.type === 'excellent'
                ? 'rgba(34, 139, 94, 0.25)'
                : feedback.type === 'good'
                  ? 'rgba(34, 139, 94, 0.18)'
                  : 'rgba(140, 140, 140, 0.15)',
            }}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={springs.standard}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* explanation */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="p-3 rounded-lg text-xs leading-relaxed"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springs.standard}
          >
            {target.explanation}
          </motion.div>
        )}
      </AnimatePresence>

      {/* qk detail */}
      {showQK && revealed && (
        <motion.div
          className="mt-3 p-3 rounded-lg font-mono text-[10px] space-y-1"
          style={{ backgroundColor: 'var(--bg-code)', color: 'var(--code-text)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.standard, delay: 0.3 }}
        >
          <div>
            <span style={{ color: 'var(--code-keyword)' }}>Q</span>({targetWord}) = [{fakeQK(targetWord).join(', ')}]
          </div>
          {sentence.words.slice(0, 3).map((w, i) => (
            <div key={i}>
              <span style={{ color: 'var(--code-string)' }}>K</span>({w}) = [{fakeQK(w).join(', ')}]
              {' '}<span style={{ color: 'var(--text-muted)' }}>
                score = {(weights[i] * 10).toFixed(1)}
              </span>
            </div>
          ))}
          <div style={{ color: 'var(--text-muted)' }}>...</div>
          <div>
            <span style={{ color: 'var(--code-keyword)' }}>softmax</span>(scores / sqrt(d_k)) = attention weights
          </div>
        </motion.div>
      )}
    </div>
  );
}
