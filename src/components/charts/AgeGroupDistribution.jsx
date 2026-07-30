import { useMemo } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'
import { groupBy } from '../../utils/dataUtils'

const AGE_GROUPS = ['18-25', '26-35', '36-45', '46-60', '60+']

const AGE_GRADIENTS = [
  { id: 'age0', from: '#0891B2', to: '#67E8F9',  solid: '#0891B2' },
  { id: 'age1', from: '#F59E0B', to: '#FCD34D',  solid: '#D97706' },
  { id: 'age2', from: '#16A34A', to: '#34D399',  solid: '#16A34A' },
  { id: 'age3', from: '#5B5BD6', to: '#8B83F7',  solid: '#5B5BD6' },
  { id: 'age4', from: '#E8395A', to: '#FB7185',  solid: '#E8395A' },
]

const Tip = ({ active, payload, label, total }) => {
  if (!active || !payload?.length) return null
  const pct = total ? ((payload[0].value / total) * 100).toFixed(1) : 0
  const idx = AGE_GROUPS.indexOf(label)
  const color = AGE_GRADIENTS[idx]?.solid || '#5B5BD6'
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">Age {label}</div>
      <div className="chart-tooltip-value" style={{ color }}>
        {payload[0].value.toLocaleString('en-IN')}
      </div>
      <div className="chart-tooltip-sub">employees in this age group</div>
      <div className="chart-tooltip-divider" />
      <div className="chart-tooltip-row">
        <span>Share of total</span>
        <span>{pct}%</span>
      </div>
    </div>
  )
}

export default function AgeGroupDistribution() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    const g = groupBy(filteredData, 'age_group')
    return AGE_GROUPS.map((ag, i) => ({
      name: ag, count: (g[ag] || []).length, grad: AGE_GRADIENTS[i],
    }))
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 24, right: 16, left: -8, bottom: 0 }}>
        <defs>
          {AGE_GRADIENTS.map(g => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={g.from} stopOpacity={1} />
              <stop offset="100%" stopColor={g.to} stopOpacity={0.65} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 13, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<Tip total={filteredData.length} />} cursor={{ fill: 'rgba(91,91,214,0.04)', radius: 8 }} />
        <Bar dataKey="count" radius={[10, 10, 0, 0]} maxBarSize={90}>
          {data.map((d, i) => (
            <Cell key={i} fill={`url(#${d.grad.id})`} />
          ))}
          <LabelList dataKey="count" position="top"
            style={{ fontSize: 12, fontFamily: 'IBM Plex Mono', fill: 'var(--text-strong)', fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
