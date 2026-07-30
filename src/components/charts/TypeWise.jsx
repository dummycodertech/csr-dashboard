import { useMemo } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'

const COLORS = {
  Onroll:  { from: '#5B5BD6', to: '#8B83F7', solid: '#5B5BD6', label: 'Onroll' },
  Offroll: { from: '#0891B2', to: '#67E8F9', solid: '#0891B2', label: 'Offroll' },
}

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const R = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.52
  const x = cx + r * Math.cos(-midAngle * R)
  const y = cy + r * Math.sin(-midAngle * R)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={13} fontFamily="IBM Plex Mono" fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value, percent } = payload[0]
  const color = COLORS[name]?.solid || '#5B5BD6'
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{name}</div>
      <div className="chart-tooltip-value" style={{ color }}>
        {value.toLocaleString('en-IN')}
      </div>
      <div className="chart-tooltip-sub">employees</div>
      <div className="chart-tooltip-divider" />
      <div className="chart-tooltip-row">
        <span>Share</span>
        <span>{(percent * 100).toFixed(1)}%</span>
      </div>
    </div>
  )
}

export default function TypeWise() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    const on  = filteredData.filter(e => e.type === 'Onroll').length
    const off = filteredData.length - on
    return [
      { name: 'Onroll',  value: on  },
      { name: 'Offroll', value: off },
    ]
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer width="100%" height="75%">
        <PieChart>
          <defs>
            {Object.entries(COLORS).map(([k, c]) => (
              <linearGradient key={k} id={`type-${k}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={c.from} />
                <stop offset="100%" stopColor={c.to} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data} cx="50%" cy="50%"
            innerRadius="35%" outerRadius="68%"
            paddingAngle={3} dataKey="value"
            labelLine={false} label={renderLabel}
            stroke="none"
          >
            {data.map(d => (
              <Cell key={d.name} fill={`url(#type-${d.name})`}
                style={{ filter: `drop-shadow(0 0 8px ${COLORS[d.name]?.from}60)` }}
              />
            ))}
          </Pie>
          <Tooltip content={<Tip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', paddingBottom: 8 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: COLORS[d.name]?.from,
              boxShadow: `0 0 6px ${COLORS[d.name]?.from}80`,
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-body)', fontFamily: 'Inter, sans-serif' }}>
              {d.name}:{' '}
              <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, color: 'var(--text-strong)' }}>
                {d.value.toLocaleString('en-IN')}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
