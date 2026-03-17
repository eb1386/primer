import { motion } from 'framer-motion';
import { springs } from '../../lib/animations';

function highlightLine(line) {
  const tokens = [];
  let remaining = line;
  let key = 0;

  const patterns = [
    { regex: /(#.*)$/, type: 'comment' },
    { regex: /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/, type: 'string' },
    { regex: /\b(\d+\.?\d*)\b/, type: 'number' },
    { regex: /\b(def|class|return|if|else|elif|for|while|in|import|from|as|with|try|except|raise|True|False|None|and|or|not|is|lambda|yield|pass|break|continue|self)\b/, type: 'keyword' },
    { regex: /\b([a-zA-Z_]\w*)\s*(?=\()/, type: 'function' },
  ];

  while (remaining.length > 0) {
    let earliestMatch = null;
    let earliestType = null;

    for (const { regex, type } of patterns) {
      const match = remaining.match(regex);
      if (match && (!earliestMatch || match.index < earliestMatch.index)) {
        earliestMatch = match;
        earliestType = type;
      }
    }

    if (!earliestMatch || earliestMatch.index === undefined) {
      tokens.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (earliestMatch.index > 0) {
      tokens.push(<span key={key++}>{remaining.slice(0, earliestMatch.index)}</span>);
    }

    const colorMap = {
      comment: 'var(--code-comment)',
      string: 'var(--code-string)',
      number: 'var(--code-number)',
      keyword: 'var(--code-keyword)',
      function: 'var(--code-text)',
    };

    tokens.push(
      <span key={key++} style={{ color: colorMap[earliestType] }}>
        {earliestMatch[1] || earliestMatch[0]}
      </span>
    );

    remaining = remaining.slice(earliestMatch.index + (earliestMatch[1] || earliestMatch[0]).length);
  }

  return tokens;
}

export default function CodeBlock({ code, annotations = [], animateKey }) {
  const lines = code.split('\n');

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-code)' }}>
      <div className="p-3 sm:p-5 overflow-x-auto -webkit-overflow-scrolling-touch">
        <pre className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--code-text)' }}>
          {lines.map((line, i) => (
            <motion.div
              key={`${animateKey}-${i}`}
              className="flex items-start"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springs.quick, delay: i * 0.03 }}
            >
              <span
                className="select-none w-8 text-right mr-4 flex-shrink-0 text-xs"
                style={{ color: 'var(--code-comment)', lineHeight: '1.7' }}
              >
                {i + 1}
              </span>
              <code className="flex-1" style={{ lineHeight: '1.7' }}>
                {highlightLine(line)}
              </code>
              {annotations[i] && (
                <motion.span
                  className="ml-4 flex-shrink-0 text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                  }}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springs.standard, delay: 0.1 + i * 0.03 }}
                >
                  ← {annotations[i]}
                </motion.span>
              )}
            </motion.div>
          ))}
        </pre>
      </div>
    </div>
  );
}
