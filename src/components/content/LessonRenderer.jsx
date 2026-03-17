import { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextBlock from './TextBlock';
import CodeBlock from './CodeBlock';
import Quiz from './Quiz';
import Callout from './Callout';
import ScrollReveal from './ScrollReveal';
import { springs } from '../../lib/animations';
import { updateLessonProgress } from '../../lib/storage';
import { getLessonData } from '../../lessons';
import { EXPLORE_RESOURCES, LESSON_ORDER, LESSON_META } from '../../lib/constants';

const interactiveComponents = {
  PredictionDemo: lazy(() => import('../interactive/PredictionDemo')),
  ProbabilityBars: lazy(() => import('../interactive/ProbabilityBars')),
  TokenizerDemo: lazy(() => import('../interactive/TokenizerDemo')),
  GradientDescentDemo: lazy(() => import('../interactive/GradientDescentDemo')),
  EmbeddingDemo: lazy(() => import('../interactive/EmbeddingDemo')),
  AttentionDemo: lazy(() => import('../interactive/AttentionDemo')),
  TransformerDemo: lazy(() => import('../interactive/TransformerDemo')),
  TemperatureDemo: lazy(() => import('../interactive/TemperatureDemo')),
};

function getContentForLevel(contentMap, level) {
  if (!contentMap) return null;
  if (contentMap.all !== undefined) return contentMap.all;
  for (let l = level; l >= 1; l--) {
    if (contentMap[l] !== undefined) return contentMap[l];
  }
  for (let l = level; l <= 5; l++) {
    if (contentMap[l] !== undefined) return contentMap[l];
  }
  return null;
}

function getRightPaneKey(content) {
  if (!content) return 'empty';
  if (content.type === 'interactive' || content.type === 'diagram') return `component-${content.component}`;
  if (content.type === 'code') return `code-${hashCode(content.code)}`;
  return 'empty';
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  return hash;
}

function DemoContent({ content, level, sectionId, compact = false }) {
  if (!content || content.type === 'static') return null;

  if (content.type === 'interactive' || content.type === 'diagram') {
    const Component = interactiveComponents[content.component];
    if (!Component) return null;
    return (
      <Suspense fallback={<div className="p-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</div>}>
        <div className={compact ? 'w-full' : 'h-full'}>
          <Component level={level} compact={compact} />
        </div>
      </Suspense>
    );
  }

  if (content.type === 'code') {
    return (
      <div className={compact ? 'p-2' : 'p-6'}>
        <CodeBlock code={content.code} annotations={content.annotations || []} animateKey={sectionId} />
      </div>
    );
  }

  return null;
}

function SectionContent({ content, lessonSlug, sectionId, level }) {
  if (!content) return null;
  if (content.type === 'text') return <TextBlock content={content.content} />;
  if (content.type === 'quiz') {
    return (
      <Quiz
        quizId={`${lessonSlug}_${sectionId}`}
        question={content.question}
        options={content.options}
        correct={content.correct}
        explanation={content.explanation}
      />
    );
  }
  if (content.type === 'callout') return <Callout>{content.content}</Callout>;
  return null;
}

function ExploreResources({ level }) {
  const resources = EXPLORE_RESOURCES[level] || EXPLORE_RESOURCES[1];
  return (
    <div className="mt-4 mb-8">
      <h2 className="font-display text-xl sm:text-2xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        Go explore
      </h2>
      <p className="text-xs sm:text-sm mb-4 sm:mb-6" style={{ color: 'var(--text-secondary)' }}>
        Resources picked for your level to keep learning.
      </p>
      <div className="space-y-2 sm:space-y-3">
        {resources.map((resource, i) => (
          <motion.a
            key={i}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 sm:px-5 sm:py-4 rounded-xl border no-underline"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm font-medium block" style={{ color: 'var(--accent)' }}>{resource.title}</span>
            <span className="text-xs mt-0.5 block" style={{ color: 'var(--text-secondary)' }}>{resource.description}</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

// mobile layout
function MobileLayout({ lesson, lessonSlug, level, onScrollProgress, onNavigate }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      onScrollProgress(pct);
      updateLessonProgress(lessonSlug, { scrollPct: Math.round(pct) });
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [lessonSlug, onScrollProgress]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [lessonSlug]);

  const idx = LESSON_ORDER.indexOf(lessonSlug);
  const nextSlug = idx < LESSON_ORDER.length - 1 ? LESSON_ORDER[idx + 1] : null;
  const prevSlug = idx > 0 ? LESSON_ORDER[idx - 1] : null;

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
        minWidth: 0,
      }}
    >
      <div style={{ padding: '16px', width: '100%', maxWidth: '100%' }}>
        {/* title */}
        <h1 className="font-display text-2xl font-medium mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {lesson.title}
        </h1>
        <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>{lesson.subtitle}</p>

        {/* sections */}
        {lesson.sections.map((section) => {
          const leftContent = getContentForLevel(section.left, level);
          const rightContent = getContentForLevel(section.right, level);
          const hasDemo = rightContent && rightContent.type !== 'static';

          return (
            <div key={section.id} className="mb-8">
              {section.heading && (
                <h2 className="font-display text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {section.heading}
                </h2>
              )}

              <SectionContent content={leftContent} lessonSlug={lessonSlug} sectionId={section.id} level={level} />

              {/* demo */}
              {hasDemo && (
                <div
                  className="mt-3 rounded-lg overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <DemoContent content={rightContent} level={level} sectionId={section.id} compact />
                </div>
              )}
            </div>
          );
        })}

        {/* resources */}
        {lessonSlug === 'final-exam' && <ExploreResources level={level} />}

        {/* nav */}
        <div className="flex items-center gap-2 pt-6 pb-10">
          {prevSlug ? (
            <button
              onClick={() => onNavigate(prevSlug)}
              className="text-xs font-medium py-2.5 rounded-lg border-none cursor-pointer"
              style={{ backgroundColor: 'var(--interactive-bg)', color: 'var(--text-secondary)', padding: '10px 12px' }}
            >
              ← Prev
            </button>
          ) : <div />}
          <div className="flex-1" />
          {nextSlug && (
            <button
              onClick={() => onNavigate(nextSlug)}
              className="text-xs font-medium rounded-lg border-none cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '10px 14px' }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// desktop layout
function DesktopLayout({ lesson, lessonSlug, level, onScrollProgress }) {
  const [activeSection, setActiveSection] = useState(0);
  const leftPaneRef = useRef(null);
  const sectionRefs = useRef([]);
  const lastNonStaticRef = useRef(null);

  const currentRightContent = getContentForLevel(lesson?.sections[activeSection]?.right, level);

  if (currentRightContent && currentRightContent.type !== 'static') {
    lastNonStaticRef.current = { content: currentRightContent, sectionIndex: activeSection };
  }

  const rightToShow = (currentRightContent && currentRightContent.type !== 'static')
    ? currentRightContent
    : lastNonStaticRef.current?.content || null;

  const rightSectionId = (currentRightContent && currentRightContent.type !== 'static')
    ? lesson?.sections[activeSection]?.id
    : lesson?.sections[lastNonStaticRef.current?.sectionIndex]?.id;

  const rightPaneKey = useMemo(() => getRightPaneKey(rightToShow), [rightToShow]);
  const showRightPane = !!rightToShow;

  useEffect(() => {
    if (!lesson) return;
    const observers = [];
    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(index); }); },
        { root: leftPaneRef.current, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      observer.observe(ref);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [lesson, level]);

  useEffect(() => {
    const el = leftPaneRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      onScrollProgress(pct);
      updateLessonProgress(lessonSlug, { scrollPct: Math.round(pct) });
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [lessonSlug, onScrollProgress]);

  useEffect(() => {
    setActiveSection(0);
    lastNonStaticRef.current = null;
    sectionRefs.current = [];
    if (leftPaneRef.current) leftPaneRef.current.scrollTop = 0;
  }, [lessonSlug]);

  return (
    <>
      <motion.div
        ref={leftPaneRef}
        className="w-full overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        animate={{ width: showRightPane ? '55%' : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 180, mass: 0.8 }}
      >
        <motion.div
          className="mx-auto px-6 md:px-10 py-10"
          animate={{ maxWidth: showRightPane ? '640px' : '720px' }}
          transition={{ type: 'spring', damping: 28, stiffness: 180, mass: 0.8 }}
        >
          <ScrollReveal>
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {lesson.title}
            </h1>
            <p className="text-base mb-10" style={{ color: 'var(--text-secondary)' }}>{lesson.subtitle}</p>
          </ScrollReveal>

          {lesson.sections.map((section, i) => {
            const leftContent = getContentForLevel(section.left, level);
            return (
              <div key={section.id} ref={el => sectionRefs.current[i] = el} className="mb-12" data-section-id={section.id}>
                {section.heading && (
                  <ScrollReveal>
                    <h2 className="font-display text-2xl font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{section.heading}</h2>
                  </ScrollReveal>
                )}
                <ScrollReveal delay={0.05}>
                  <SectionContent content={leftContent} lessonSlug={lessonSlug} sectionId={section.id} level={level} />
                </ScrollReveal>
              </div>
            );
          })}

          {lessonSlug === 'final-exam' && <ScrollReveal><ExploreResources level={level} /></ScrollReveal>}
          <div className="h-32" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showRightPane && (
          <motion.div
            className="flex border-l flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '45%', opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 180, mass: 0.8 } }}
            exit={{ width: 0, opacity: 0, transition: { type: 'spring', damping: 32, stiffness: 220, duration: 0.3 } }}
          >
            <div className="flex-1 overflow-y-auto min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={rightPaneKey}
                  className="h-full flex flex-col justify-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { ...springs.standard, delay: 0.1 } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}
                >
                  <DemoContent content={rightToShow} level={level} sectionId={rightSectionId} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function LessonRenderer({ lessonSlug, level, onScrollProgress, isMobile = false, onNavigate }) {
  const lesson = getLessonData(lessonSlug);

  if (!lesson) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>Lesson not found</div>;
  }

  if (isMobile) {
    return <MobileLayout lesson={lesson} lessonSlug={lessonSlug} level={level} onScrollProgress={onScrollProgress} onNavigate={onNavigate} />;
  }

  return <DesktopLayout lesson={lesson} lessonSlug={lessonSlug} level={level} onScrollProgress={onScrollProgress} />;
}
