import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { springs } from '../../lib/animations';

const DATA_POINTS = [
  { x: 0.5, y: 2.1 },
  { x: 1.0, y: 3.2 },
  { x: 1.5, y: 3.8 },
  { x: 2.0, y: 5.1 },
  { x: 2.5, y: 5.8 },
  { x: 3.0, y: 7.3 },
  { x: 3.5, y: 7.9 },
  { x: 4.0, y: 9.2 },
  { x: 4.5, y: 10.1 },
  { x: 5.0, y: 10.8 },
];

const OPTIMAL_SLOPE = 1.96;
const OPTIMAL_INTERCEPT = 1.08;

const W = 400;
const H = 300;
const PAD = { top: 20, right: 20, bottom: 40, left: 45 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

function scaleX(x) { return PAD.left + (x / 5.5) * plotW; }
function scaleY(y) { return PAD.top + plotH - (y / 12) * plotH; }

function computeMSE(slope, intercept) {
  const errors = DATA_POINTS.map(p => {
    const predicted = slope * p.x + intercept;
    return (predicted - p.y) ** 2;
  });
  return errors.reduce((a, b) => a + b, 0) / errors.length;
}

function computeGradients(slope, intercept) {
  let dSlope = 0;
  let dIntercept = 0;
  const n = DATA_POINTS.length;
  for (const p of DATA_POINTS) {
    const predicted = slope * p.x + intercept;
    const error = predicted - p.y;
    dSlope += (2 / n) * error * p.x;
    dIntercept += (2 / n) * error;
  }
  return { dSlope, dIntercept };
}

export default function GradientDescentDemo({ level, compact = false }) {
  const [slope, setSlope] = useState(0.5);
  const [intercept, setIntercept] = useState(3.0);
  const [autoSolving, setAutoSolving] = useState(false);
  const animRef = useRef(null);
  const slopeRef = useRef(slope);
  const interceptRef = useRef(intercept);

  slopeRef.current = slope;
  interceptRef.current = intercept;

  const mse = computeMSE(slope, intercept);
  const gradients = computeGradients(slope, intercept);
  const maxMSE = 30;
  const mseRatio = Math.min(mse / maxMSE, 1);

  const errorColor = mse < 1 ? 'var(--success)' : mse < 5 ? 'var(--code-number)' : 'var(--accent)';

  const showNumeric = level >= 3;
  const showFormula = level >= 4;
  const showGradients = level >= 4;

  const slopeLabel = level <= 2 ? 'Tilt' : 'Slope (m)';
  const interceptLabel = level <= 2 ? 'Position' : 'Intercept (b)';

  const autoSolve = useCallback(() => {
    setAutoSolving(true);
    const lr = 0.015;
    let currentSlope = slopeRef.current;
    let currentIntercept = interceptRef.current;

    const step = () => {
      const { dSlope, dIntercept } = computeGradients(currentSlope, currentIntercept);
      currentSlope -= lr * dSlope;
      currentIntercept -= lr * dIntercept;

      currentSlope = Math.max(-1, Math.min(5, currentSlope));
      currentIntercept = Math.max(-3, Math.min(8, currentIntercept));

      setSlope(parseFloat(currentSlope.toFixed(3)));
      setIntercept(parseFloat(currentIntercept.toFixed(3)));

      const currentMSE = computeMSE(currentSlope, currentIntercept);
      if (currentMSE > 0.15) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setAutoSolving(false);
      }
    };

    animRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const stopAutoSolve = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setAutoSolving(false);
  };

  const lineX1 = 0;
  const lineX2 = 5.5;
  const lineY1 = slope * lineX1 + intercept;
  const lineY2 = slope * lineX2 + intercept;

  return (
    <div className={`flex flex-col justify-center ${compact ? 'p-3 gap-1' : 'p-6 h-full'}`}>
      {/* formula */}
      {showFormula && (
        <motion.div
          className="mb-4 px-3 py-2 rounded-lg font-mono text-xs"
          style={{ backgroundColor: 'var(--bg-code)', color: 'var(--code-text)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={springs.standard}
        >
          <span style={{ color: 'var(--code-keyword)' }}>MSE</span> = (1/n) <span style={{ color: 'var(--text-muted)' }}>{'Σ'}</span> (y<sub>i</sub> - (mx<sub>i</sub> + b))²
        </motion.div>
      )}

      {/* plot */}
      <div className={`${compact ? 'mb-1' : 'mb-4'} flex justify-center`}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={compact ? 'w-full max-h-[35vh]' : 'w-full max-w-[400px]'}
          style={{ overflow: 'visible' }}
          role="img"
          aria-label="Scatter plot with adjustable line"
        >
          {/* grid */}
          {[0, 2, 4, 6, 8, 10, 12].map(y => (
            <line
              key={`grid-y-${y}`}
              x1={PAD.left}
              y1={scaleY(y)}
              x2={W - PAD.right}
              y2={scaleY(y)}
              stroke="var(--border)"
              strokeWidth={0.5}
            />
          ))}

          {/* axes */}
          <line
            x1={PAD.left} y1={PAD.top}
            x2={PAD.left} y2={H - PAD.bottom}
            stroke="var(--text-muted)" strokeWidth={1}
          />
          <line
            x1={PAD.left} y1={H - PAD.bottom}
            x2={W - PAD.right} y2={H - PAD.bottom}
            stroke="var(--text-muted)" strokeWidth={1}
          />

          {/* labels */}
          {[0, 1, 2, 3, 4, 5].map(x => (
            <text
              key={`x-${x}`}
              x={scaleX(x)} y={H - PAD.bottom + 18}
              textAnchor="middle"
              fontSize={10}
              fill="var(--text-muted)"
              fontFamily="'JetBrains Mono', monospace"
            >
              {x}
            </text>
          ))}
          {[0, 2, 4, 6, 8, 10, 12].map(y => (
            <text
              key={`y-${y}`}
              x={PAD.left - 8} y={scaleY(y) + 3}
              textAnchor="end"
              fontSize={10}
              fill="var(--text-muted)"
              fontFamily="'JetBrains Mono', monospace"
            >
              {y}
            </text>
          ))}

          {/* errors */}
          {DATA_POINTS.map((p, i) => {
            const predicted = slope * p.x + intercept;
            return (
              <motion.line
                key={`err-${i}`}
                x1={scaleX(p.x)} y1={scaleY(p.y)}
                x2={scaleX(p.x)} y2={scaleY(predicted)}
                stroke="var(--accent)"
                strokeWidth={1}
                strokeDasharray="3,2"
                opacity={0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={springs.standard}
              />
            );
          })}

          {/* line */}
          <motion.line
            x1={scaleX(lineX1)} y1={scaleY(lineY1)}
            x2={scaleX(lineX2)} y2={scaleY(lineY2)}
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={springs.standard}
          />

          {/* gradients */}
          {showGradients && (
            <>
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="var(--success)" />
                </marker>
              </defs>
              {DATA_POINTS.filter((_, i) => i % 3 === 0).map((p, i) => {
                const predicted = slope * p.x + intercept;
                const diff = p.y - predicted;
                const arrowLen = Math.min(Math.abs(diff) * 5, 25) * Math.sign(diff);
                return (
                  <line
                    key={`grad-${i}`}
                    x1={scaleX(p.x) + 6}
                    y1={scaleY(predicted)}
                    x2={scaleX(p.x) + 6}
                    y2={scaleY(predicted) - arrowLen}
                    stroke="var(--success)"
                    strokeWidth={1.5}
                    markerEnd="url(#arrowhead)"
                    opacity={0.7}
                  />
                );
              })}
            </>
          )}

          {/* points */}
          {DATA_POINTS.map((p, i) => (
            <motion.circle
              key={`pt-${i}`}
              cx={scaleX(p.x)}
              cy={scaleY(p.y)}
              r={4}
              fill="var(--text-primary)"
              stroke="var(--bg-primary)"
              strokeWidth={1.5}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springs.quick, delay: i * 0.04 }}
            />
          ))}
        </svg>
      </div>

      {/* meter */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {level <= 2 ? 'How far off?' : 'Mean Squared Error'}
          </span>
          {showNumeric && (
            <span className="text-xs font-mono" style={{ color: errorColor }}>
              {mse.toFixed(3)}
            </span>
          )}
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: errorColor }}
            animate={{ width: `${Math.max(2, (1 - mseRatio) * 100)}%` }}
            transition={springs.quick}
          />
        </div>
        {level <= 2 && (
          <div className="flex justify-between mt-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span>Way off</span>
            <span>Perfect fit</span>
          </div>
        )}
      </div>

      {/* sliders */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }} htmlFor="slope-slider">
              {slopeLabel}
            </label>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {slope.toFixed(2)}
            </span>
          </div>
          <input
            id="slope-slider"
            type="range"
            min="-1"
            max="5"
            step="0.05"
            value={slope}
            onChange={(e) => { setSlope(parseFloat(e.target.value)); stopAutoSolve(); }}
            className="w-full touch-none"
            style={{ accentColor: 'var(--accent)', cursor: 'grab' }}
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }} htmlFor="intercept-slider">
              {interceptLabel}
            </label>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {intercept.toFixed(2)}
            </span>
          </div>
          <input
            id="intercept-slider"
            type="range"
            min="-3"
            max="8"
            step="0.05"
            value={intercept}
            onChange={(e) => { setIntercept(parseFloat(e.target.value)); stopAutoSolve(); }}
            className="w-full touch-none"
            style={{ accentColor: 'var(--accent)', cursor: 'grab' }}
          />
        </div>
      </div>

      {/* values */}
      {showGradients && (
        <div
          className="mb-3 px-3 py-2 rounded-lg text-xs font-mono flex gap-4"
          style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
        >
          <span>
            <span style={{ color: 'var(--text-muted)' }}>dL/dm</span> = {gradients.dSlope.toFixed(3)}
          </span>
          <span>
            <span style={{ color: 'var(--text-muted)' }}>dL/db</span> = {gradients.dIntercept.toFixed(3)}
          </span>
        </div>
      )}

      {/* auto-solve */}
      <motion.button
        onClick={autoSolving ? stopAutoSolve : autoSolve}
        className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none"
        style={{
          backgroundColor: autoSolving ? 'var(--border)' : 'var(--accent)',
          color: autoSolving ? 'var(--text-secondary)' : 'white',
        }}
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.98 }}
      >
        {autoSolving ? 'Stop' : level <= 2 ? 'Find best fit automatically' : 'Auto-solve (gradient descent)'}
      </motion.button>
    </div>
  );
}
