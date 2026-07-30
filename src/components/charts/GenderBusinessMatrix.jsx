import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'

const BIZ = ['Cement', 'Sugar', 'Refractories']

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginTop: 8 }}>
        {payload.map(p => (
          <div key={p.name}>
            <div style={{ fontSize: 10, color: 'var(--text-body)', marginBottom: 3, fontFamily: 'Inter, sans-serif' }}>{p.name}</div>
            <div className="chart-tooltip-value" style={{ fontSize: 26, color: p.fill }}>
              {(p.value || 0).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GenderBusinessMatrix() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    return BIZ.map(biz => {
      const rows = filteredData.filter(e => e.business === biz)
      return {
        name: biz,
        Male:       rows.filter(e => e.gender === 'Male').length,
        Female:     rows.filter(e => e.gender === 'Female').length,
        Onroll:     rows.filter(e => e.type === 'Onroll').length,
        Offroll:    rows.filter(e => e.type === 'Offroll').length,
      }
    })
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  // Split into two sub-charts side by side
  return (
    <div style={{ height: '100%', display: 'flex', gap: 16 }}>
      {/* Gender chart */}
      <div style={{ flex: 1 }}>
        <div style={{
          textAlign: 'center', fontSize: 11, fontWeight: 700,
          color: 'var(--text-body)', fontFamily: 'Inter, sans-serif',
          marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          By Gender
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: -8, bottom: 0 }} barGap={4}>
            <defs>
              <linearGradient id="maleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B5BD6" stopOpacity={1} />
                <stop offset="100%" stopColor="#8B83F7" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="femaleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D97706" stopOpacity={1} />
                <stop offset="100%" stopColor="#FCD34D" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} cursor={{ fill: 'rgba(91,91,214,0.04)' }} />
            <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11, color: 'var(--text-body)', fontFamily: 'Inter, sans-serif' }}>{v}</span>} />
            <Bar dataKey="Male"   fill="url(#maleGrad)"   radius={[7,7,0,0]} maxBarSize={40} />
            <Bar dataKey="Female" fill="url(#femaleGrad)" radius={[7,7,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Divider */}
      <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', margin: '20px 0' }} />

      {/* Type chart */}
      <div style={{ flex: 1 }}>
        <div style={{
          textAlign: 'center', fontSize: 11, fontWeight: 700,
          color: 'var(--text-body)', fontFamily: 'Inter, sans-serif',
          marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          By Employment Type
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: -8, bottom: 0 }} barGap={4}>
            <defs>
              <linearGradient id="onrollGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16A34A" stopOpacity={1} />
                <stop offset="100%" stopColor="#34D399" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="offrollGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0891B2" stopOpacity={1} />
                <stop offset="100%" stopColor="#67E8F9" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} cursor={{ fill: 'rgba(91,91,214,0.04)' }} />
            <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11, color: 'var(--text-body)', fontFamily: 'Inter, sans-serif' }}>{v}</span>} />
            <Bar dataKey="Onroll"  fill="url(#onrollGrad)"  radius={[7,7,0,0]} maxBarSize={40} />
            <Bar dataKey="Offroll" fill="url(#offrollGrad)" radius={[7,7,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
