import { useMemo } from 'react'
import { useFilters } from '../../context/FilterContext'
import { sumBy, fmtNum } from '../../utils/dataUtils'
import { Users, IndianRupee, TrendingUp, AlertTriangle } from 'lucide-react'

/* ── Circular progress ring ── */
function Ring({ pct, color, size = 72 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r}
        className="ring-track" stroke="var(--surface-2)" strokeWidth={7} />
      <circle cx={size / 2} cy={size / 2} r={r}
        className="ring-fill" stroke={color} strokeWidth={7}
        strokeDasharray={`${dash} ${circ}`}
        style={{ filter: `drop-shadow(0 0 5px ${color}90)` }}
      />
    </svg>
  )
}

/* ── Mini sparkline (smooth line) ── */
function MiniSparkline({ values, color }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 120
  const h = 36
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-fill-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
      />
    </svg>
  )
}

const SPARK_HC  = [310, 340, 315, 360, 330, 380, 345, 400, 360, 380, 400, 1000]
const SPARK_CTC = [65, 68, 70, 72, 69, 74, 71, 75, 72, 77, 74, 76]
const SPARK_AVG = [6.8, 7.0, 6.9, 7.2, 7.1, 7.4, 7.3, 7.5, 7.4, 7.6, 7.5, 7.67]

function KPICard({ label, value, sub, subColor, icon: Icon, iconBg, iconGlow, borderColor, sparkValues, sparkColor, ring, badge }) {
  return (
    <div
      className="card kpi-card flex flex-col justify-between"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        padding: '22px 24px',
        minHeight: 210,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.10em]"
            style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
          >
            {label}
          </span>
          <div
            className="data-num font-bold leading-none mt-3 num-pop"
            style={{ fontSize: 48, color: 'var(--text-strong)' }}
          >
            {value}
          </div>
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {badge}
          </div>
        </div>
        {ring ? (
          <div className="flex-shrink-0 relative">
            {ring}
          </div>
        ) : (
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg, boxShadow: `0 6px 20px ${iconGlow}` }}
          >
            <Icon size={20} className="text-white" />
          </div>
        )}
      </div>

      {/* Sparkline bottom */}
      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="text-[10px] text-tx-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
          {sub}
        </div>
        {sparkValues && (
          <MiniSparkline values={sparkValues} color={sparkColor} />
        )}
      </div>
    </div>
  )
}

export default function KPIStrip() {
  const { filteredData } = useFilters()

  const s = useMemo(() => {
    const total    = filteredData.length
    const totalCtc = sumBy(filteredData, 'ctc')
    const avgCtc   = total ? totalCtc / total : 0
    const retiring = filteredData.filter(e => e.retiring_in_3_years === 'Yes').length
    const pctRet   = total ? (retiring / total) * 100 : 0
    return { total, totalCtc, avgCtc, retiring, pctRet }
  }, [filteredData])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

      {/* ── 1. Total Headcount ── */}
      <KPICard
        label="Total Headcount"
        value={fmtNum(s.total)}
        sub="Active employees"
        borderColor="#5B5BD6"
        icon={Users}
        iconBg="linear-gradient(135deg,#5B5BD6,#8B83F7)"
        iconGlow="rgba(91,91,214,0.40)"
        sparkValues={SPARK_HC}
        sparkColor="#5B5BD6"
        badge={
          <span className="pill" style={{ background: 'rgba(91,91,214,0.10)', color: '#5B5BD6' }}>
            ↑ Active
          </span>
        }
      />

      {/* ── 2. Total CTC ── */}
      <KPICard
        label="Total CTC"
        value={<>₹{(s.totalCtc / 100).toFixed(1)}<span style={{ fontSize: 22, color: 'var(--text-body)', fontWeight: 400, marginLeft: 4 }}>Cr</span></>}
        sub="Annual cost of operations"
        borderColor="#F59E0B"
        icon={IndianRupee}
        iconBg="linear-gradient(135deg,#F59E0B,#FCD34D)"
        iconGlow="rgba(245,158,11,0.40)"
        sparkValues={SPARK_CTC}
        sparkColor="#F59E0B"
        badge={
          <span className="pill" style={{ background: 'rgba(245,158,11,0.10)', color: '#D97706' }}>
            Annual
          </span>
        }
      />

      {/* ── 3. Avg CTC ── */}
      <KPICard
        label="Avg CTC"
        value={<>₹{s.avgCtc.toFixed(1)}<span style={{ fontSize: 22, color: 'var(--text-body)', fontWeight: 400, marginLeft: 4 }}>L</span></>}
        sub="Per employee per annum"
        borderColor="#16A34A"
        icon={TrendingUp}
        iconBg="linear-gradient(135deg,#16A34A,#34D399)"
        iconGlow="rgba(22,163,74,0.40)"
        sparkValues={SPARK_AVG}
        sparkColor="#16A34A"
        badge={
          <span className="pill" style={{ background: 'rgba(22,163,74,0.10)', color: '#16A34A' }}>
            Per annum
          </span>
        }
      />

      {/* ── 4. Retiring Soon ── */}
      <KPICard
        label="Retiring Soon"
        value={<>{s.pctRet.toFixed(1)}<span style={{ fontSize: 22, color: 'var(--text-body)', fontWeight: 400, marginLeft: 2 }}>%</span></>}
        sub={`${fmtNum(s.retiring)} employees retiring within 3 years`}
        borderColor="#E8395A"
        sparkValues={null}
        sparkColor="#E8395A"
        ring={
          <div style={{ position: 'relative' }}>
            <Ring pct={s.pctRet} color="#E8395A" size={72} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} style={{ color: '#E8395A' }} />
            </div>
          </div>
        }
        badge={
          <span className="pill" style={{ background: 'rgba(232,57,90,0.10)', color: '#E8395A' }}>
            ⚠ Risk
          </span>
        }
      />

    </div>
  )
}
