import { motion } from 'framer-motion';
import { LESSON_ORDER, LESSON_META } from '../../lib/constants';

export default function LessonNav({ currentLesson, onNavigate, progress }) {
  const currentIndex = LESSON_ORDER.indexOf(currentLesson);
  const prevSlug = currentIndex > 0 ? LESSON_ORDER[currentIndex - 1] : null;
  const nextSlug = currentIndex < LESSON_ORDER.length - 1 ? LESSON_ORDER[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-t safe-bottom" style={{ borderColor: 'var(--border)' }}>
      {/* previous */}
      <div className="flex-1">
        {prevSlug && (
          <motion.button
            onClick={() => onNavigate(prevSlug)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium cursor-pointer bg-transparent border-none py-1"
            style={{ color: 'var(--text-secondary)' }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="truncate">{LESSON_META[prevSlug].title}</span>
          </motion.button>
        )}
      </div>

      {/* dots */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-2">
        {LESSON_ORDER.map((slug) => {
          const lessonProgress = progress[slug];
          const isCompleted = lessonProgress?.completed;
          const isCurrent = slug === currentLesson;
          const scrollPct = lessonProgress?.scrollPct || 0;

          return (
            <button
              key={slug}
              onClick={() => onNavigate(slug)}
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-none cursor-pointer p-0 transition-all duration-200"
              style={{
                backgroundColor: isCompleted
                  ? 'var(--success)'
                  : isCurrent
                    ? 'var(--accent)'
                    : scrollPct > 0
                      ? 'var(--text-muted)'
                      : 'var(--border)',
                transform: isCurrent ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Go to ${LESSON_META[slug].title}`}
              title={LESSON_META[slug].title}
            />
          );
        })}
      </div>

      {/* next */}
      <div className="flex-1 flex justify-end">
        {nextSlug && (
          <motion.button
            onClick={() => onNavigate(nextSlug)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium cursor-pointer bg-transparent border-none py-1"
            style={{ color: 'var(--text-secondary)' }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="truncate">{LESSON_META[nextSlug].title}</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </div>
    </div>
  );
}
