export default function ProgressBar({ progress = 0 }) {
  return (
    <div className="w-full h-[3px]" style={{ backgroundColor: 'var(--border)' }}>
      <div
        className="h-full transition-all"
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          backgroundColor: 'var(--accent)',
          transitionProperty: 'width',
          transitionDuration: '500ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </div>
  );
}
