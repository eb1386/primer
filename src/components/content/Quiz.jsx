import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '../../lib/animations';
import { getQuizAnswers, setQuizAnswer } from '../../lib/storage';

export default function Quiz({ quizId, question, options, correct, explanation }) {
  const savedAnswers = getQuizAnswers();
  const saved = savedAnswers[quizId];
  const [selected, setSelected] = useState(saved?.selected ?? null);
  const [answered, setAnswered] = useState(saved !== undefined);

  const handleSelect = (index) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    setQuizAnswer(quizId, index, index === correct);
  };

  return (
    <div className="my-8">
      <h3
        className="font-display text-lg sm:text-xl font-medium mb-3 sm:mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        {question}
      </h3>

      <div className="space-y-2 sm:space-y-2.5">
        {options.map((option, i) => {
          const isCorrect = i === correct;
          const isSelected = i === selected;
          const isWrong = answered && isSelected && !isCorrect;

          let bgColor = 'var(--interactive-bg)';
          let borderCol = 'var(--border)';
          let textCol = 'var(--text-primary)';

          if (answered) {
            if (isCorrect) {
              bgColor = 'rgba(61, 139, 106, 0.1)';
              borderCol = 'var(--success)';
              textCol = 'var(--success)';
            } else if (isWrong) {
              bgColor = 'rgba(217, 79, 59, 0.08)';
              borderCol = 'var(--accent)';
              textCol = 'var(--accent)';
            } else {
              bgColor = 'var(--bg-secondary)';
              textCol = 'var(--text-muted)';
              borderCol = 'var(--border)';
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className="w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border text-sm flex items-start sm:items-center gap-3 transition-colors"
              style={{
                backgroundColor: bgColor,
                borderColor: borderCol,
                color: textCol,
                cursor: answered ? 'default' : 'pointer',
              }}
              whileHover={!answered ? { y: -1, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' } : {}}
              whileTap={!answered ? { scale: 0.98 } : {}}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono"
                style={{ borderColor: borderCol }}
              >
                {answered && isCorrect ? '✓' : String.fromCharCode(65 + i)}
              </span>
              {option}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && explanation && (
          <motion.div
            className="mt-4 px-4 py-3 rounded-lg text-sm"
            style={{
              backgroundColor: 'var(--accent-subtle)',
              color: 'var(--text-secondary)',
              borderLeft: '3px solid var(--accent)',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: springs.standard }}
          >
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
