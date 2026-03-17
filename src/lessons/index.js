import prediction from './prediction';
import tokens from './tokens';
import learning from './learning';
import embeddings from './embeddings';
import attention from './attention';
import fullPicture from './full-picture';
import finalExam from './final-exam';
import { LESSON_META } from '../lib/constants';

const lessons = {
  prediction,
  tokens,
  learning,
  embeddings,
  attention,
  'full-picture': fullPicture,
  'final-exam': finalExam,
};

export function getLessonData(slug) {
  const data = lessons[slug];
  if (!data) return null;
  const meta = LESSON_META[slug];
  return {
    ...data,
    title: meta?.title || data.title,
    subtitle: meta?.subtitle || '',
  };
}
