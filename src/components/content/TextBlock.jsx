import { motion } from 'framer-motion';
import { springs } from '../../lib/animations';

export default function TextBlock({ content }) {
  const paragraphs = content.split('\n\n').filter(Boolean);

  return (
    <div className="space-y-4 sm:space-y-5">
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          className="leading-relaxed"
          style={{
            color: 'var(--text-primary)',
            fontSize: 'clamp(15px, 3.8vw, 17px)',
            lineHeight: 1.75,
            willChange: 'opacity, transform',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.03 }}
        >
          {renderInlineFormatting(p)}
        </motion.p>
      ))}
    </div>
  );
}

function renderInlineFormatting(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`(.+?)`/);

    let nextMatch = null;
    let matchType = null;

    if (boldMatch && codeMatch) {
      if (boldMatch.index <= codeMatch.index) {
        nextMatch = boldMatch;
        matchType = 'bold';
      } else {
        nextMatch = codeMatch;
        matchType = 'code';
      }
    } else if (boldMatch) {
      nextMatch = boldMatch;
      matchType = 'bold';
    } else if (codeMatch) {
      nextMatch = codeMatch;
      matchType = 'code';
    }

    if (!nextMatch) {
      parts.push(remaining);
      break;
    }

    if (nextMatch.index > 0) {
      parts.push(remaining.slice(0, nextMatch.index));
    }

    if (matchType === 'bold') {
      parts.push(
        <strong key={key++} className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {nextMatch[1]}
        </strong>
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{
            backgroundColor: 'var(--bg-code)',
            color: 'var(--code-text)',
          }}
        >
          {nextMatch[1]}
        </code>
      );
    }

    remaining = remaining.slice(nextMatch.index + nextMatch[0].length);
  }

  return parts;
}
