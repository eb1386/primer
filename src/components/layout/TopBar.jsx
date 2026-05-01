import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVELS, LESSON_ORDER, LESSON_META } from '../../lib/constants';
import { springs } from '../../lib/animations';

export default function TopBar({ currentLesson, level, onLevelChange, onLessonSelect, progress, compact = false }) {
  const navigate = useNavigate();
  const [levelOpen, setLevelOpen] = useState(false);
  const [lessonListOpen, setLessonListOpen] = useState(false);
  const levelRef = useRef(null);
  const lessonRef = useRef(null);

  const lessonIndex = LESSON_ORDER.indexOf(currentLesson);
  const meta = LESSON_META[currentLesson];
  const currentLevelData = LEVELS.find(l => l.id === level);

  useEffect(() => {
    function handleClick(e) {
      if (levelRef.current && !levelRef.current.contains(e.target)) setLevelOpen(false);
      if (lessonRef.current && !lessonRef.current.contains(e.target)) setLessonListOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => navigate('/home')}
          className="font-display text-sm bg-transparent border-none cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          Primer
        </button>

        <span className="text-xs font-display font-medium" style={{ color: 'var(--text-primary)' }}>
          {meta?.title}
        </span>

        <div className="flex items-center gap-1.5">
          <div className="relative" ref={levelRef}>
            <button
              onClick={() => { setLevelOpen(!levelOpen); setLessonListOpen(false); }}
              className="px-1.5 py-1 rounded text-[10px] font-medium cursor-pointer border"
              style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              {currentLevelData?.name}
            </button>
            <AnimatePresence>
              {levelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0, transition: springs.quick }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                  className="absolute right-0 top-full mt-1 w-52 rounded-lg shadow-lg overflow-hidden z-50 border"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
                >
                  {LEVELS.map(l => (
                    <button
                      key={l.id}
                      onClick={() => { onLevelChange(l.id); setLevelOpen(false); }}
                      className="w-full text-left px-3 py-2.5 text-sm cursor-pointer border-none"
                      style={{
                        backgroundColor: l.id === level ? 'var(--accent-subtle)' : 'transparent',
                        color: l.id === level ? 'var(--accent)' : 'var(--text-primary)',
                      }}
                    >
                      <span className="font-medium">{l.name}</span>
                      <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{l.description}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={lessonRef}>
            <button
              onClick={() => { setLessonListOpen(!lessonListOpen); setLevelOpen(false); }}
              className="px-1.5 py-1 rounded text-[10px] font-mono cursor-pointer border"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              {lessonIndex + 1}/{LESSON_ORDER.length}
            </button>
            <AnimatePresence>
              {lessonListOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0, transition: springs.quick }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                  className="absolute right-0 top-full mt-1 w-56 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg z-50 border"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
                >
                  {LESSON_ORDER.map((slug, i) => {
                    const lMeta = LESSON_META[slug];
                    const isCurrent = slug === currentLesson;
                    return (
                      <button
                        key={slug}
                        onClick={() => { onLessonSelect(slug); setLessonListOpen(false); }}
                        className="w-full text-left px-3 py-2.5 text-sm cursor-pointer border-none"
                        style={{
                          backgroundColor: isCurrent ? 'var(--accent-subtle)' : 'transparent',
                          color: isCurrent ? 'var(--accent)' : 'var(--text-primary)',
                        }}
                      >
                        <span className="font-medium">{i + 1}. {lMeta.title}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => navigate('/home')}
        className="font-display text-lg tracking-normal bg-transparent border-none cursor-pointer flex-shrink-0"
        style={{ color: 'var(--text-primary)' }}
      >
        Primer
      </button>

      <h2 className="font-display text-lg font-medium hidden md:block" style={{ color: 'var(--text-primary)' }}>
        {meta?.title}
      </h2>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative" ref={levelRef}>
          <button
            onClick={() => { setLevelOpen(!levelOpen); setLessonListOpen(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer border"
            style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            {currentLevelData?.name}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: levelOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <AnimatePresence>
            {levelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0, transition: springs.quick }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg overflow-hidden z-50 border"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
              >
                {LEVELS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => { onLevelChange(l.id); setLevelOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm cursor-pointer border-none transition-colors"
                    style={{
                      backgroundColor: l.id === level ? 'var(--accent-subtle)' : 'transparent',
                      color: l.id === level ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                  >
                    <span className="font-medium">{l.name}</span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{l.description}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={lessonRef}>
          <button
            onClick={() => { setLessonListOpen(!lessonListOpen); setLevelOpen(false); }}
            className="px-3 py-1.5 rounded-md text-sm font-mono cursor-pointer border"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            {lessonIndex + 1}/{LESSON_ORDER.length}
          </button>
          <AnimatePresence>
            {lessonListOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0, transition: springs.quick }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                className="absolute right-0 top-full mt-2 w-64 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg z-50 border"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
              >
                {LESSON_ORDER.map((slug, i) => {
                  const lMeta = LESSON_META[slug];
                  const lessonProgress = progress[slug];
                  const isCompleted = lessonProgress?.completed;
                  const isCurrent = slug === currentLesson;
                  return (
                    <button
                      key={slug}
                      onClick={() => { onLessonSelect(slug); setLessonListOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm cursor-pointer border-none flex items-center gap-3 transition-colors"
                      style={{
                        backgroundColor: isCurrent ? 'var(--accent-subtle)' : 'transparent',
                        color: isCurrent ? 'var(--accent)' : 'var(--text-primary)',
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs"
                        style={{
                          borderColor: isCompleted ? 'var(--success)' : 'var(--border)',
                          backgroundColor: isCompleted ? 'var(--success)' : 'transparent',
                          color: isCompleted ? 'white' : 'var(--text-muted)',
                        }}
                      >
                        {isCompleted ? '✓' : i + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="font-medium block truncate">{lMeta.title}</span>
                        <span className="block text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{lMeta.subtitle}</span>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
