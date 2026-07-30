// Reusable chart card with left-border color accent and premium hover
const ACCENT_COLORS = [
  '#5B5BD6', // indigo/brand
  '#F59E0B', // amber
  '#16A34A', // green
  '#E8395A', // red/pink
  '#0891B2', // cyan
  '#4F46E5', // deep indigo
  '#D97706', // warm amber
  '#7C3AED', // violet
  '#0E7490', // teal
  '#166534', // forest green
]

export default function ChartCard({ title, subtitle, children, className = '', accentIndex }) {
  const idx = accentIndex !== undefined ? accentIndex : 0
  const color = ACCENT_COLORS[idx % ACCENT_COLORS.length]

  return (
    <div
      className={`card h-full flex flex-col ${className}`}
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex-shrink-0 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Color dot accent */}
          <div
            className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}80`, marginTop: 5 }}
          />
          <div>
            <h3
              className="text-[14px] font-bold text-tx-strong leading-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-tx-body mt-1 leading-snug">{subtitle}</p>
            )}
          </div>
        </div>
        {/* Mini menu dots */}
        <button
          className="w-7 h-7 rounded-lg hover:bg-[var(--surface-2)] flex items-center justify-center text-tx-muted hover:text-tx-body flex-shrink-0 transition-colors"
          aria-label="Options"
        >
          <svg width="15" height="4" viewBox="0 0 15 4" fill="currentColor">
            <circle cx="1.5" cy="2" r="1.5"/>
            <circle cx="7.5" cy="2" r="1.5"/>
            <circle cx="13.5" cy="2" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-0 overflow-hidden px-3 pb-4">
        {children}
      </div>
    </div>
  )
}
