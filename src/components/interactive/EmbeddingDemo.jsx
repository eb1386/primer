import { useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { springs } from '../../lib/animations';

const WORDS = [
  { word: 'cat', x: 460, y: 90, category: 'animals' },
  { word: 'dog', x: 490, y: 68, category: 'animals' },
  { word: 'bird', x: 430, y: 52, category: 'animals' },
  { word: 'fish', x: 520, y: 105, category: 'animals' },
  { word: 'horse', x: 405, y: 112, category: 'animals' },
  { word: 'bear', x: 480, y: 128, category: 'animals' },
  { word: 'wolf', x: 438, y: 143, category: 'animals' },
  { word: 'rabbit', x: 535, y: 75, category: 'animals' },

  { word: 'happy', x: 95, y: 370, category: 'emotions' },
  { word: 'sad', x: 125, y: 405, category: 'emotions' },
  { word: 'angry', x: 70, y: 392, category: 'emotions' },
  { word: 'love', x: 148, y: 355, category: 'emotions' },
  { word: 'fear', x: 85, y: 430, category: 'emotions' },
  { word: 'joy', x: 118, y: 345, category: 'emotions' },
  { word: 'grief', x: 140, y: 438, category: 'emotions' },
  { word: 'hope', x: 170, y: 378, category: 'emotions' },

  { word: 'table', x: 455, y: 305, category: 'objects' },
  { word: 'chair', x: 488, y: 330, category: 'objects' },
  { word: 'book', x: 432, y: 282, category: 'objects' },
  { word: 'phone', x: 520, y: 298, category: 'objects' },
  { word: 'car', x: 465, y: 352, category: 'objects' },
  { word: 'house', x: 410, y: 322, category: 'objects' },
  { word: 'door', x: 498, y: 368, category: 'objects' },
  { word: 'window', x: 535, y: 345, category: 'objects' },

  { word: 'run', x: 155, y: 168, category: 'actions' },
  { word: 'walk', x: 178, y: 198, category: 'actions' },
  { word: 'jump', x: 132, y: 152, category: 'actions' },
  { word: 'swim', x: 200, y: 175, category: 'actions' },
  { word: 'fly', x: 115, y: 182, category: 'actions' },
  { word: 'climb', x: 148, y: 220, category: 'actions' },
  { word: 'throw', x: 185, y: 145, category: 'actions' },
  { word: 'catch', x: 218, y: 205, category: 'actions' },

  { word: 'big', x: 280, y: 212, category: 'descriptors' },
  { word: 'small', x: 302, y: 245, category: 'descriptors' },
  { word: 'fast', x: 258, y: 190, category: 'descriptors' },
  { word: 'slow', x: 310, y: 220, category: 'descriptors' },
  { word: 'hot', x: 328, y: 198, category: 'descriptors' },
  { word: 'cold', x: 272, y: 260, category: 'descriptors' },
  { word: 'new', x: 295, y: 175, category: 'descriptors' },
  { word: 'old', x: 342, y: 238, category: 'descriptors' },
];

const CATEGORY_COLORS = {
  animals: '#C9553D',
  emotions: '#3D8B6A',
  objects: '#C9893A',
  actions: '#5B6DAB',
  descriptors: '#7A756E',
};

const CATEGORY_LABELS = {
  animals: 'Animals',
  emotions: 'Emotions',
  objects: 'Objects',
  actions: 'Actions',
  descriptors: 'Descriptors',
};

function fakeEmbedding(word) {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = ((hash << 5) - hash) + word.charCodeAt(i);
    hash |= 0;
  }
  const vec = [];
  for (let i = 0; i < 8; i++) {
    hash = ((hash * 1103515245) + 12345) | 0;
    vec.push(((hash >> 16) & 0x7fff) / 32768 * 2 - 1);
  }
  return vec;
}

function getDist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function cosineSim(v1, v2) {
  let dot = 0, m1 = 0, m2 = 0;
  for (let i = 0; i < v1.length; i++) {
    dot += v1[i] * v2[i];
    m1 += v1[i] ** 2;
    m2 += v2[i] ** 2;
  }
  return dot / (Math.sqrt(m1) * Math.sqrt(m2));
}

const SVG_W = 600;
const SVG_H = 500;

export default function EmbeddingDemo({ level, compact = false }) {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const hoverTimeout = useRef(null);

  const showLegend = level >= 3;
  const showVector = level >= 4;
  const showCosine = level >= 4;

  const activeWord = selectedWord || hoveredWord;

  // debounced hover
  const handleHover = useCallback((word) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredWord(word);
  }, []);

  const handleUnhover = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setHoveredWord(null), 80);
  }, []);

  const nearestNeighbors = useMemo(() => {
    if (!activeWord) return [];
    const active = WORDS.find(w => w.word === activeWord);
    if (!active) return [];
    return WORDS
      .filter(w => w.word !== activeWord)
      .map(w => ({ ...w, d: getDist(active, w) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
  }, [activeWord]);

  const activeData = WORDS.find(w => w.word === activeWord);

  const tooltipPos = useMemo(() => {
    if (!activeData) return { x: 0, y: 0 };
    const tooltipW = 180;
    const tooltipH = showVector ? 140 : 90;
    let tx = activeData.x + 20;
    let ty = activeData.y - 20;
    if (tx + tooltipW > SVG_W - 10) tx = activeData.x - tooltipW - 14;
    if (ty < 10) ty = 10;
    if (ty + tooltipH > SVG_H - 10) ty = SVG_H - tooltipH - 10;
    return { x: tx, y: ty };
  }, [activeData, showVector]);

  return (
    <div className={`flex flex-col ${compact ? 'p-3' : 'p-6 h-full'}`}>
      {/* legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[key] }}
              />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* plot */}
      <div className={compact ? 'w-full' : 'flex-1 flex items-center justify-center min-h-0'}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full"
          style={compact ? { minHeight: '380px' } : { height: '100%', maxHeight: '100%' }}
          role="img"
          aria-label="2D word embedding scatter plot"
        >
          {/* grid */}
          <defs>
            <pattern id="embed-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.35" />
            </pattern>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#embed-grid)" rx="8" />

          {/* axes */}
          <line x1="40" y1={SVG_H / 2} x2={SVG_W - 20} y2={SVG_H / 2} stroke="var(--border)" strokeWidth="0.7" opacity="0.3" />
          <line x1={SVG_W / 2} y1="20" x2={SVG_W / 2} y2={SVG_H - 20} stroke="var(--border)" strokeWidth="0.7" opacity="0.3" />

          {/* neighbor lines */}
          {activeData && nearestNeighbors.map((n) => (
            <line
              key={`line-${n.word}`}
              x1={activeData.x}
              y1={activeData.y}
              x2={n.x}
              y2={n.y}
              stroke="var(--accent)"
              strokeWidth={1.2}
              strokeDasharray="5,4"
              opacity={0.45}
              style={{ transition: 'opacity 0.2s ease' }}
            />
          ))}

          {/* words */}
          {WORDS.map((w, i) => {
            const isActive = w.word === activeWord;
            const isNeighbor = nearestNeighbors.some(n => n.word === w.word);
            const color = CATEGORY_COLORS[w.category];

            return (
              <g
                key={w.word}
                onMouseEnter={() => handleHover(w.word)}
                onMouseLeave={handleUnhover}
                onClick={() => setSelectedWord(selectedWord === w.word ? null : w.word)}
                style={{ cursor: 'pointer' }}
              >
                {/* hitbox */}
                <circle cx={w.x} cy={w.y} r="28" fill="transparent" />

                {/* dot */}
                <circle
                  cx={w.x}
                  cy={w.y}
                  r={isActive ? 7 : 5}
                  fill={color}
                  stroke={isActive ? 'var(--text-primary)' : 'none'}
                  strokeWidth={isActive ? 2 : 0}
                  opacity={activeWord ? (isActive || isNeighbor ? 1 : 0.35) : 0.85}
                  style={{ transition: 'r 0.15s ease, opacity 0.2s ease, stroke-width 0.15s ease' }}
                />

                {/* label */}
                <text
                  x={w.x}
                  y={w.y - 12}
                  textAnchor="middle"
                  fontSize={isActive ? 13 : 11}
                  fontWeight={isActive ? 600 : 400}
                  fill={isActive ? 'var(--text-primary)' : color}
                  fontFamily="'DM Sans', sans-serif"
                  opacity={activeWord ? (isActive || isNeighbor ? 1 : 0.35) : 0.85}
                  style={{ transition: 'opacity 0.2s ease, font-size 0.15s ease', pointerEvents: 'none' }}
                >
                  {w.word}
                </text>
              </g>
            );
          })}

          {/* tooltip */}
          {activeData && (
            <foreignObject
              x={tooltipPos.x}
              y={tooltipPos.y}
              width="180"
              height={showVector ? '160' : '100'}
              style={{ pointerEvents: 'none', overflow: 'visible' }}
            >
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: CATEGORY_COLORS[activeData.category], flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>{activeData.word}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{CATEGORY_LABELS[activeData.category]}</span>
                </div>

                {nearestNeighbors.length > 0 && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: 10, marginBottom: showVector ? 6 : 0 }}>
                    Nearest: {nearestNeighbors.map(n => n.word).join(', ')}
                  </div>
                )}

                {showVector && (
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4, wordBreak: 'break-all' }}>
                    vec = [{fakeEmbedding(activeData.word).map(v => v.toFixed(2)).join(', ')}]
                  </div>
                )}

                {showCosine && nearestNeighbors.length > 0 && (
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>
                    {nearestNeighbors.map(n => (
                      <div key={n.word}>cos({activeData.word}, {n.word}) = {cosineSim(fakeEmbedding(activeData.word), fakeEmbedding(n.word)).toFixed(3)}</div>
                    ))}
                  </div>
                )}
              </div>
            </foreignObject>
          )}
        </svg>
      </div>

      {/* hint */}
      {!activeWord && (
        <div className="mt-2 text-center text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
          {level <= 2 ? 'Hover over a word to see which words are nearby' : 'Hover or click a word to inspect its neighbors'}
        </div>
      )}
    </div>
  );
}
