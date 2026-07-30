import { useMemo } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'
import { groupBy } from '../../utils/dataUtils'

const BIZ = ['Cement', 'Sugar', 'Refractories']

const BIZ_COLORS = {
  Cement:       { id: 'hcCement',  from: '#5B5BD6', to: '#8B83F7', solid: '#5B5BD6' },
  Sugar:        { id: 'hcSugar',   from: '#F59E0B', to: '#FCD34D', solid: '#F59E0B' },
  Refractories: { id: 'hcRefrac',  from: '#16A34A', to: '#34D399', solid: '#16A34A' },
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  const color = BIZ_COLORS[label]?.solid || '#5B5BD6'
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{label}</div>
      <div className="chart-tooltip-value" style={{ color }}>
        {d.value.toLocaleString('en-IN')}
      </div>
      <div className="chart-tooltip-sub">employees in this business unit</div>
      <div className="chart-tooltip-divider" />
      <div className="chart-tooltip-row">
        <span>Share of total</span>
        <span>{((d.value / 1000) * 100).toFixed(1)}%</span>
      </div>
    </div>
  )
}

export default function HeadcountByBusiness() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    const g = groupBy(filteredData, 'business')
    return BIZ.map(b => ({
      name: b,
      count: (g[b] || []).length,
      color: BIZ_COLORS[b],
    }))
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data for current filters</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 28, right: 20, left: -8, bottom: 0 }}>
        <defs>
          {Object.values(BIZ_COLORS).map(c => (
            <linearGradient key={c.id} id={c.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.from} stopOpacity={1} />
              <stop offset="100%" stopColor={c.to} stopOpacity={0.65} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 13, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip
          content={<Tip />}
          cursor={{ fill: 'rgba(91,91,214,0.04)', radius: 10 }}
        />
        <Bar dataKey="count" radius={[10, 10, 0, 0]} maxBarSize={110}>
          {data.map((d, i) => (
            <Cell key={i} fill={`url(#${d.color.id})`} />
          ))}
          <LabelList
            dataKey="count"
            position="top"
            style={{
              fontSize: 14,
              fontFamily: 'IBM Plex Mono',
              fill: 'var(--text-strong)',
              fontWeight: 700,
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
