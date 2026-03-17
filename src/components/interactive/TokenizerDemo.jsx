import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '../../lib/animations';

const WHOLE_WORDS = new Set([
  'the', 'a', 'an', 'is', 'it', 'in', 'on', 'at', 'to', 'of', 'and', 'for',
  'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one',
  'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may',
  'new', 'now', 'old', 'see', 'way', 'who', 'did', 'let', 'say', 'she',
  'too', 'use', 'man', 'we', 'do', 'if', 'my', 'up', 'or', 'no', 'so',
  'he', 'be', 'I', 'me', 'go', 'by', 'am', 'as', 'much',
  'with', 'that', 'this', 'from', 'have', 'they', 'been', 'said',
  'each', 'which', 'their', 'will', 'other', 'about', 'many', 'then',
  'them', 'some', 'what', 'when', 'make', 'like', 'time', 'just',
  'know', 'take', 'people', 'into', 'year', 'your', 'good', 'could',
  'give', 'most', 'only', 'tell', 'very', 'come', 'made', 'after',
  'also', 'back', 'work', 'first', 'even', 'want', 'because', 'these',
  'two', 'well', 'there', 'than', 'more', 'would', 'think', 'where',
  'help', 'here', 'every', 'life', 'long', 'great', 'still', 'own',
  'world', 'head', 'need', 'move', 'right', 'hand', 'place', 'large',
  'turn', 'follow', 'act', 'learn', 'point', 'read', 'word', 'cat',
  'sat', 'mat', 'dog', 'big', 'small', 'run', 'jump', 'love', 'open',
  'close', 'book', 'look', 'play', 'over', 'under', 'blue', 'sky',
  'hello', 'happy', 'world', 'model', 'language', 'token', 'predict',
  'write', 'code', 'data', 'train', 'test', 'best', 'next', 'last',
  'name', 'line', 'number', 'change', 'found', 'live', 'home',
  'food', 'part', 'land', 'form', 'went', 'before', 'between',
  'being', 'same', 'another', 'while', 'last', 'might', 'again',
  'end', 'start', 'high', 'such', 'never', 'going', 'few',
  'made', 'left', 'sure', 'real', 'quite', 'early', 'since',
  'set', 'kind', 'keep', 'both', 'begin', 'seem', 'show',
  'hear', 'city', 'tree', 'cross', 'hard', 'light', 'story',
  'far', 'sea', 'draw', 'earth', 'near', 'build', 'door',
  'any', 'new', 'sound', 'off', 'mean', 'little', 'true',
  'water', 'called', 'put', 'thing', 'thought', 'under',
  'don', 'does', 'got', 'must', 'tell', 'before', 'down',
  'should', 'call', 'own', 'side', 'been', 'find', 'number',
  'sentence', 'quick', 'brown', 'fox', 'lazy', 'over',
  'once', 'upon', 'night', 'dark', 'rain', 'sun', 'moon',
  'house', 'window', 'street', 'school', 'child', 'girl', 'boy',
  'water', 'fire', 'wind', 'mountain', 'river', 'friend',
  'computer', 'program', 'system', 'machine', 'learn',
  'neural', 'network', 'attention', 'transform',
]);

const SUBWORD_PIECES = [
  'tion', 'ment', 'ness', 'able', 'ible', 'ful', 'less', 'ous', 'ive',
  'ing', 'ent', 'ant', 'ence', 'ance', 'ious', 'eous',
  'pre', 'un', 're', 'dis', 'mis', 'over', 'under', 'out', 'sub',
  'inter', 'trans', 'super', 'semi', 'anti', 'non',
  'ly', 'er', 'ed', 'es', 'al', 'en', 'est', 'ity',
  'th', 'ch', 'sh', 'wh', 'ph',
  'ght', 'ck', 'nd', 'nt', 'ng', 'nk', 'st',
  'com', 'con', 'pro', 'per',
];

const TOKEN_COLORS = [
  '#C9553D', '#C9893A', '#8B6D3A', '#3D8B6A',
  '#3D7A8B', '#5B6DAB', '#8B5D8B', '#AB6D5B',
];

function tokenizeWord(word) {
  const lower = word.toLowerCase();

  if (WHOLE_WORDS.has(lower)) {
    return [word];
  }

  const tokens = [];
  let remaining = lower;
  let originalRemaining = word;

  while (remaining.length > 0) {
    let matched = false;

    for (let len = Math.min(remaining.length, 8); len >= 2; len--) {
      const candidate = remaining.substring(0, len);
      if (SUBWORD_PIECES.includes(candidate) || WHOLE_WORDS.has(candidate)) {
        tokens.push(originalRemaining.substring(0, len));
        remaining = remaining.substring(len);
        originalRemaining = originalRemaining.substring(len);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push(originalRemaining[0]);
      remaining = remaining.substring(1);
      originalRemaining = originalRemaining.substring(1);
    }
  }

  return tokens;
}

function tokenize(text) {
  if (!text.trim()) return [];

  const tokens = [];
  const parts = text.match(/[a-zA-Z]+|[^a-zA-Z]/g) || [];

  for (const part of parts) {
    if (/^[a-zA-Z]+$/.test(part)) {
      const wordTokens = tokenizeWord(part);
      tokens.push(...wordTokens.map(t => ({ text: t, isSpace: false, isPunct: false })));
    } else if (/^\s$/.test(part)) {
      tokens.push({ text: part, isSpace: true, isPunct: false });
    } else {
      tokens.push({ text: part, isSpace: false, isPunct: true });
    }
  }

  return tokens;
}

function tokenId(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 50000;
}

function getBPESteps(word) {
  const chars = word.split('');
  const steps = [chars.map(c => c)];
  const finalTokens = tokenizeWord(word);

  if (finalTokens.length < chars.length && finalTokens.length > 0) {
    if (chars.length > 3) {
      const mid = [];
      let i = 0;
      while (i < chars.length) {
        if (i + 1 < chars.length && finalTokens.some(t => t.startsWith(chars[i] + chars[i + 1]))) {
          mid.push(chars[i] + chars[i + 1]);
          i += 2;
        } else {
          mid.push(chars[i]);
          i++;
        }
      }
      if (mid.length !== chars.length && mid.length !== finalTokens.length) {
        steps.push(mid);
      }
    }
    steps.push(finalTokens);
  }

  return steps;
}

export default function TokenizerDemo({ level, compact = false }) {
  const [input, setInput] = useState('The cat sat on the mat');
  const tokens = useMemo(() => tokenize(input), [input]);

  const showIds = level >= 3;
  const showBPE = level >= 5;

  const visibleTokens = tokens.filter(t => !t.isSpace);
  const tokenCount = visibleTokens.length;

  const bpeWords = useMemo(() => {
    if (!showBPE) return [];
    const words = input.match(/[a-zA-Z]+/g) || [];
    return words
      .filter(w => !WHOLE_WORDS.has(w.toLowerCase()))
      .slice(0, 3)
      .map(w => ({ word: w, steps: getBPESteps(w) }))
      .filter(w => w.steps.length > 1);
  }, [input, showBPE]);

  let colorCounter = 0;

  return (
    <div className={`flex flex-col ${compact ? 'p-3' : 'p-6 h-full'}`}>
      {/* input */}
      <div className="mb-5">
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: 'var(--text-muted)' }}
          htmlFor="tokenizer-input"
        >
          {level <= 2 ? 'Type something to break into pieces:' : 'Input text:'}
        </label>
        <input
          id="tokenizer-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[--accent] focus:ring-opacity-30"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
          placeholder="Type a sentence..."
          maxLength={120}
        />
      </div>

      {/* count */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {tokenCount} token{tokenCount !== 1 ? 's' : ''}
          {level >= 3 && input.trim() && (
            <span className="ml-1">({input.trim().split(/\s+/).length} word{input.trim().split(/\s+/).length !== 1 ? 's' : ''})</span>
          )}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
      </div>

      {/* tokens */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <AnimatePresence mode="popLayout">
          {tokens.map((token, i) => {
            if (token.isSpace) {
              return (
                <motion.span
                  key={`sp-${i}`}
                  className="inline-flex items-center justify-center rounded px-1 py-1 text-xs"
                  style={{
                    backgroundColor: 'var(--border)',
                    color: 'var(--text-muted)',
                    minWidth: 14,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ ...springs.quick, delay: i * 0.02 }}
                >
                  ·
                </motion.span>
              );
            }

            const ci = colorCounter++;
            const color = TOKEN_COLORS[ci % TOKEN_COLORS.length];
            const id = tokenId(token.text);

            return (
              <motion.div
                key={`${token.text}-${i}`}
                className="inline-flex flex-col items-center rounded-lg overflow-hidden"
                style={{
                  backgroundColor: color + '15',
                  border: `1.5px solid ${color}35`,
                }}
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -8 }}
                transition={{ ...springs.quick, delay: i * 0.025 }}
                layout
              >
                <span
                  className="px-2.5 py-1.5 text-sm font-mono font-medium"
                  style={{ color }}
                >
                  {token.text}
                </span>
                {showIds && (
                  <span
                    className="text-[10px] font-mono pb-1 px-2"
                    style={{ color: color + '88' }}
                  >
                    {id}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* bpe */}
      {showBPE && bpeWords.length > 0 && (
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              BPE merge steps
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          </div>
          <div
            className="rounded-lg p-3 space-y-3 max-h-44 overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            {bpeWords.map((bw, mi) => (
              <div key={mi}>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  "{bw.word}"
                </span>
                <div className="ml-2 mt-1 space-y-1">
                  {bw.steps.map((step, si) => (
                    <motion.div
                      key={si}
                      className="flex items-center gap-1.5"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...springs.quick, delay: si * 0.08 }}
                    >
                      <span className="text-[10px] w-16 flex-shrink-0 font-mono" style={{ color: 'var(--text-muted)' }}>
                        {si === 0 ? 'Chars' : si === bw.steps.length - 1 ? 'Final' : `Merge ${si}`}
                      </span>
                      <div className="flex gap-0.5">
                        {step.map((t, ti) => (
                          <span
                            key={ti}
                            className="px-1 py-0.5 rounded text-[10px] font-mono"
                            style={{
                              backgroundColor: TOKEN_COLORS[ti % TOKEN_COLORS.length] + '18',
                              color: TOKEN_COLORS[ti % TOKEN_COLORS.length],
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        ({step.length})
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* note */}
      {level <= 2 && tokenCount > 0 && (
        <div className="mt-auto pt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          {tokenCount > input.trim().split(/\s+/).length
            ? 'Some words got split into smaller pieces!'
            : 'These are common words, so each one stays whole.'}
        </div>
      )}
    </div>
  );
}
