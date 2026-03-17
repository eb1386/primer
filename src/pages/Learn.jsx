import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopBar from '../components/layout/TopBar';
import ProgressBar from '../components/layout/ProgressBar';
import LessonNav from '../components/layout/LessonNav';
import LevelSelector from '../components/layout/LevelSelector';
import LessonRenderer from '../components/content/LessonRenderer';
import {
  getLevel, setLevel as saveLevel,
  getCurrentLesson, setCurrentLesson,
  getProgress,
} from '../lib/storage';

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768 || (window.innerWidth < 1024 && 'ontouchstart' in window));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

export default function Learn() {
  const [level, setLevelState] = useState(() => getLevel());
  const [currentLesson, setCurrentLessonState] = useState(() => getCurrentLesson());
  const [progress, setProgress] = useState(() => getProgress());
  const [scrollPct, setScrollPct] = useState(0);
  const isMobile = useIsMobile();

  const needsLevelSelect = level === null;

  const handleLevelSelect = useCallback((id) => {
    setLevelState(id);
    saveLevel(id);
  }, []);

  const handleLevelChange = useCallback((id) => {
    setLevelState(id);
    saveLevel(id);
  }, []);

  const handleLessonNavigate = useCallback((slug) => {
    setCurrentLessonState(slug);
    setCurrentLesson(slug);
    setScrollPct(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getProgress());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (needsLevelSelect) {
    return <LevelSelector onSelect={handleLevelSelect} />;
  }

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-primary)',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      <TopBar
        currentLesson={currentLesson}
        level={level}
        onLevelChange={handleLevelChange}
        onLessonSelect={handleLessonNavigate}
        progress={progress}
        compact={isMobile}
      />
      <ProgressBar progress={scrollPct} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLesson + '-' + level}
            style={{ flex: 1, display: 'flex', width: '100%', minWidth: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <LessonRenderer
              lessonSlug={currentLesson}
              level={level}
              onScrollProgress={setScrollPct}
              isMobile={isMobile}
              onNavigate={handleLessonNavigate}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {!isMobile && (
        <LessonNav
          currentLesson={currentLesson}
          onNavigate={handleLessonNavigate}
          progress={progress}
        />
      )}
    </div>
  );
}
