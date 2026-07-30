import { useMemo } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'
import { groupBy, avgBy } from '../../utils/dataUtils'

// 10 gradient pairs (from→to) for each rank
const GRAD_PAIRS = [
  ['#5B5BD6','#8B83F7'],
  ['#0891B2','#67E8F9'],
  ['#16A34A','#34D399'],
  ['#F59E0B','#FCD34D'],
  ['#E8395A','#FB7185'],
  ['#4F46E5','#818CF8'],
  ['#0E7490','#22D3EE'],
  ['#166534','#4ADE80'],
  ['#D97706','#FBBF24'],
  ['#7C3AED','#A78BFA'],
]

const SOLID_COLORS = ['#5B5BD6','#0891B2','#16A34A','#D97706','#E8395A','#4F46E5','#0E7490','#166534','#D97706','#7C3AED']

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const idx = d._idx || 0
  const color = SOLID_COLORS[idx % SOLID_COLORS.length]
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{d.fullName}</div>
      <div className="chart-tooltip-value" style={{ color }}>
        {d.count.toLocaleString('en-IN')}
      </div>
      <div className="chart-tooltip-sub">employees at this location</div>
      <div className="chart-tooltip-divider" />
      <div className="chart-tooltip-row">
        <span>CTC Min</span>
        <span>₹{d.ctcMin}L</span>
      </div>
      <div className="chart-tooltip-row">
        <span>CTC Avg</span>
        <span>₹{d.ctcAvg}L</span>
      </div>
      <div className="chart-tooltip-row">
        <span>CTC Max</span>
        <span>₹{d.ctcMax}L</span>
      </div>
    </div>
  )
}

export default function Top10Locations() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    const g = groupBy(filteredData, 'location')
    return Object.entries(g)
      .map(([loc, rows], _) => ({
        shortName: loc.replace(/ (Office|Plant|Site|Works)$/, ''),
        fullName: loc,
        count: rows.length,
        ctcMin: Math.min(...rows.map(e => e.ctc)).toFixed(1),
        ctcMax: Math.max(...rows.map(e => e.ctc)).toFixed(1),
        ctcAvg: avgBy(rows, 'ctc').toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((d, i) => ({ ...d, _idx: i }))
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 52, left: 8, bottom: 4 }}>
        <defs>
          {GRAD_PAIRS.map(([from, to], i) => (
            <linearGradient key={i} id={`locG${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={from} stopOpacity={1} />
              <stop offset="100%" stopColor={to} stopOpacity={0.7} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          type="category" dataKey="shortName" width={100}
          tick={{ fontSize: 11, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(91,91,214,0.04)' }} />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={22}>
          {data.map((d, i) => (
            <Cell key={i} fill={`url(#locG${i % 10})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
