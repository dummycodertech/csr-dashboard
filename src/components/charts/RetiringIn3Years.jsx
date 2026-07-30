import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'

const BIZ = ['Cement', 'Sugar', 'Refractories']

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const active_ = payload.find(p => p.name === 'Active')
  const retiring = payload.find(p => p.name === 'Retiring')
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{label}</div>
      <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
        {active_ && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-body)', marginBottom: 4 }}>Active</div>
            <div className="chart-tooltip-value" style={{ fontSize: 28, color: '#5B5BD6' }}>
              {active_.value.toLocaleString('en-IN')}
            </div>
          </div>
        )}
        {retiring && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-body)', marginBottom: 4 }}>Retiring</div>
            <div className="chart-tooltip-value" style={{ fontSize: 28, color: '#E8395A' }}>
              {retiring.value.toLocaleString('en-IN')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RetiringIn3Years() {
  const { filteredData } = useFilters()

  const data = useMemo(() =>
    BIZ.map(b => {
      const bRows   = filteredData.filter(e => e.business === b)
      const retiring = bRows.filter(e => e.retiring_in_3_years === 'Yes').length
      return { name: b, Active: bRows.length - retiring, Retiring: retiring }
    }), [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 16, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="retActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B5BD6" stopOpacity={1} />
            <stop offset="100%" stopColor="#8B83F7" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="retRetiring" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8395A" stopOpacity={1} />
            <stop offset="100%" stopColor="#FB7185" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 13, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--text-body)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(91,91,214,0.04)', radius: 8 }} />
        <Legend
          iconType="circle" iconSize={8}
          formatter={v => (
            <span style={{ fontSize: 12, color: 'var(--text-body)', fontFamily: 'Plus Jakarta Sans' }}>{v}</span>
          )}
        />
        <Bar dataKey="Active"   stackId="s" fill="url(#retActive)"   maxBarSize={80} />
        <Bar dataKey="Retiring" stackId="s" fill="url(#retRetiring)" radius={[8, 8, 0, 0]} maxBarSize={80} />
      </BarChart>
    </ResponsiveContainer>
  )
}
