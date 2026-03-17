const KEYS = {
  level: 'fromzero_level',
  currentLesson: 'fromzero_current_lesson',
  progress: 'fromzero_progress',
  quizAnswers: 'fromzero_quiz_answers',
};

function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silent fail
  }
}

export function getLevel() {
  return read(KEYS.level, null);
}

export function setLevel(level) {
  write(KEYS.level, level);
}

export function getCurrentLesson() {
  return read(KEYS.currentLesson, 'prediction');
}

export function setCurrentLesson(slug) {
  write(KEYS.currentLesson, slug);
}

export function getProgress() {
  return read(KEYS.progress, {});
}

export function updateLessonProgress(slug, data) {
  const progress = getProgress();
  progress[slug] = { ...progress[slug], ...data };
  write(KEYS.progress, progress);
}

export function getQuizAnswers() {
  return read(KEYS.quizAnswers, {});
}

export function setQuizAnswer(quizId, selected, correct) {
  const answers = getQuizAnswers();
  answers[quizId] = { selected, correct };
  write(KEYS.quizAnswers, answers);
}
