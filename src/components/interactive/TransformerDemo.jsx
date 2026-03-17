import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '../../lib/animations';

const STAGES = [
  {
    id: 'input',
    label: { simple: 'Text input', full: 'Input Text' },
    description: 'Raw text enters the model. For example: "The cat sat on the"',
    lesson: null,
    color: '#7A756E',
    tensorShape: 'string',
  },
  {
    id: 'tokenizer',
    label: { simple: 'Break into pieces', full: 'Tokenizer' },
    description: 'Text is split into tokens — subword pieces the model can process. "The cat" becomes ["The", " cat"].',
    lesson: 'tokens',
    color: '#C9553D',
    tensorShape: '[seq_len]',
  },
  {
    id: 'embedding',
    label: { simple: 'Turn into numbers', full: 'Embedding Layer' },
    description: 'Each token is converted into a vector of numbers (an embedding) that captures its meaning.',
    lesson: 'embeddings',
    color: '#C9893A',
    tensorShape: '[seq_len, d_model]',
  },
  {
    id: 'attention',
    label: { simple: 'Look at related words', full: 'Self-Attention' },
    description: 'Each token looks at every other token and decides which ones are most relevant. This is how the model understands context.',
    lesson: 'attention',
    color: '#3D8B6A',
    tensorShape: '[seq_len, d_model]',
    isBlock: true,
  },
  {
    id: 'feedforward',
    label: { simple: 'Think about it', full: 'Feed-Forward Network' },
    description: 'After gathering context from attention, each position is processed through a neural network that transforms the information — the "thinking" step.',
    lesson: null,
    color: '#5B6DAB',
    tensorShape: '[seq_len, d_model]',
    isBlock: true,
  },
  {
    id: 'output',
    label: { simple: 'Pick the next word', full: 'Output Projection' },
    description: 'The final hidden state is projected back to vocabulary size, producing a probability for every possible next word.',
    lesson: 'prediction',
    color: '#8B5D8B',
    tensorShape: '[seq_len, vocab_size]',
  },
];

const NUM_LAYERS = 3;
const SVG_W = 340;
const STAGE_HEIGHT = 48;
const STAGE_GAP = 16;
const BLOCK_PAD = 10;

function getStagePositions(level) {
  const showLayers = level >= 3;
  const positions = [];
  let y = 30;

  for (let i = 0; i < STAGES.length; i++) {
    const stage = STAGES[i];

    if (stage.isBlock && showLayers) {
      positions.push({ ...stage, y, stageIndex: i });
      y += STAGE_HEIGHT + STAGE_GAP;
    } else if (stage.isBlock && !showLayers) {
      positions.push({ ...stage, y, stageIndex: i });
      y += STAGE_HEIGHT + STAGE_GAP;
    } else {
      positions.push({ ...stage, y, stageIndex: i });
      y += STAGE_HEIGHT + STAGE_GAP;
    }
  }

  return { positions, totalHeight: y + 20 };
}

export default function TransformerDemo({ level, compact = false }) {
  const [activeStage, setActiveStage] = useState(null);
  const [dotStage, setDotStage] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  const showFullNames = level >= 3;
  const showTensorShapes = level >= 5;
  const showLayerCount = level >= 3;

  const { positions, totalHeight } = getStagePositions(level);

  const totalSteps = positions.length;

  const step = useCallback(() => {
    setDotStage(prev => {
      const next = prev + 1;
      if (next >= totalSteps) {
        setPlaying(false);
        return -1;
      }
      return next;
    });
  }, [totalSteps]);

  const play = useCallback(() => {
    setDotStage(-1);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (playing) {
      if (dotStage === -1) {
        setDotStage(0);
        return;
      }
      timerRef.current = setTimeout(() => {
        setDotStage(prev => {
          const next = prev + 1;
          if (next >= totalSteps) {
            setPlaying(false);
            return prev;
          }
          return next;
        });
      }, 800);
    }
    return () => clearTimeout(timerRef.current);
  }, [playing, dotStage, totalSteps]);

  const handleStageClick = (idx) => {
    setActiveStage(activeStage === idx ? null : idx);
  };

  const handleStep = () => {
    if (dotStage >= totalSteps - 1) {
      setDotStage(0);
    } else {
      setDotStage(prev => prev + 1);
    }
    setPlaying(false);
  };

  const dotY = dotStage >= 0 && dotStage < positions.length
    ? positions[dotStage].y + STAGE_HEIGHT / 2
    : -20;

  return (
    <div className="p-6 h-full flex flex-col">
      {/* controls */}
      <div className="flex gap-2 mb-4">
        <motion.button
          onClick={playing ? () => { setPlaying(false); clearTimeout(timerRef.current); } : play}
          className="flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer border-none"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.98 }}
        >
          {playing ? 'Pause' : 'Play'}
        </motion.button>
        <motion.button
          onClick={handleStep}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border"
          style={{ backgroundColor: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
          whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          whileTap={{ scale: 0.98 }}
        >
          Step
        </motion.button>
      </div>

      {/* flowchart */}
      <div className="flex-1 flex justify-center overflow-y-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${totalHeight}`}
          className="w-full max-w-[340px]"
          role="img"
          aria-label="Transformer architecture flowchart"
        >
          {/* lines */}
          {positions.map((pos, i) => {
            if (i === 0) return null;
            const prev = positions[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={SVG_W / 2}
                y1={prev.y + STAGE_HEIGHT}
                x2={SVG_W / 2}
                y2={pos.y}
                stroke="var(--border)"
                strokeWidth={1.5}
                strokeDasharray={pos.isBlock ? '4,3' : 'none'}
              />
            );
          })}

          {/* bracket */}
          {showLayerCount && (() => {
            const blockStages = positions.filter(p => p.isBlock);
            if (blockStages.length < 2) return null;
            const firstBlock = blockStages[0];
            const lastBlock = blockStages[blockStages.length - 1];
            const bracketX = SVG_W - 30;
            const bracketTop = firstBlock.y - BLOCK_PAD;
            const bracketBottom = lastBlock.y + STAGE_HEIGHT + BLOCK_PAD;

            return (
              <g>
                <rect
                  x={20}
                  y={bracketTop}
                  width={SVG_W - 50}
                  height={bracketBottom - bracketTop}
                  rx={8}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth={1}
                  strokeDasharray="6,3"
                />
                <text
                  x={bracketX}
                  y={(bracketTop + bracketBottom) / 2}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-muted)"
                  fontFamily="'JetBrains Mono', monospace"
                  transform={`rotate(-90, ${bracketX}, ${(bracketTop + bracketBottom) / 2})`}
                >
                  {level >= 5 ? `x${NUM_LAYERS} layers` : `repeat x${NUM_LAYERS}`}
                </text>
              </g>
            );
          })()}

          {/* stages */}
          {positions.map((pos, i) => {
            const isActive = dotStage === i;
            const isClicked = activeStage === i;
            const label = showFullNames ? pos.label.full : pos.label.simple;

            return (
              <motion.g
                key={pos.id}
                onClick={() => handleStageClick(i)}
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springs.quick, delay: i * 0.06 }}
              >
                {/* box */}
                <motion.rect
                  x={40}
                  y={pos.y}
                  width={SVG_W - 80}
                  height={STAGE_HEIGHT}
                  rx={10}
                  fill={isActive ? pos.color + '25' : 'var(--bg-primary)'}
                  stroke={isActive ? pos.color : isClicked ? pos.color + '80' : 'var(--border)'}
                  strokeWidth={isActive ? 2 : 1}
                  animate={{
                    scale: isActive ? 1.03 : 1,
                  }}
                  transition={springs.quick}
                />

                {/* dot */}
                <circle
                  cx={56}
                  cy={pos.y + STAGE_HEIGHT / 2}
                  r={4}
                  fill={pos.color}
                  opacity={isActive ? 1 : 0.5}
                />

                {/* label */}
                <text
                  x={68}
                  y={pos.y + STAGE_HEIGHT / 2 + (showTensorShapes ? -3 : 1)}
                  fontSize={12}
                  fontWeight={isActive ? 600 : 400}
                  fill={isActive ? pos.color : 'var(--text-primary)'}
                  fontFamily="'DM Sans', sans-serif"
                  dominantBaseline="middle"
                >
                  {label}
                </text>

                {/* shape */}
                {showTensorShapes && (
                  <text
                    x={68}
                    y={pos.y + STAGE_HEIGHT / 2 + 11}
                    fontSize={9}
                    fill="var(--text-muted)"
                    fontFamily="'JetBrains Mono', monospace"
                    dominantBaseline="middle"
                  >
                    {pos.tensorShape}
                  </text>
                )}

                {/* link */}
                {pos.lesson && (
                  <text
                    x={SVG_W - 55}
                    y={pos.y + STAGE_HEIGHT / 2 + 1}
                    fontSize={10}
                    fill="var(--text-muted)"
                    fontFamily="'DM Sans', sans-serif"
                    dominantBaseline="middle"
                    textAnchor="end"
                  >
                    {'\u2197'}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* tracer */}
          {dotStage >= 0 && dotStage < positions.length && (
            <motion.circle
              cx={40 - 12}
              r={5}
              fill={positions[dotStage].color}
              initial={{ cy: dotStage === 0 ? positions[0].y + STAGE_HEIGHT / 2 : undefined }}
              animate={{ cy: dotY }}
              transition={springs.standard}
            >
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </motion.circle>
          )}
        </svg>
      </div>

      {/* detail */}
      <AnimatePresence>
        {activeStage !== null && activeStage < positions.length && (
          <motion.div
            className="mt-3 p-3 rounded-lg text-xs leading-relaxed"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={springs.standard}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: positions[activeStage].color }}
              />
              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {positions[activeStage].label.full}
              </span>
            </div>
            <p>{positions[activeStage].description}</p>
            {positions[activeStage].lesson && (
              <p className="mt-1.5" style={{ color: 'var(--accent)' }}>
                See: Lesson on {positions[activeStage].lesson}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
