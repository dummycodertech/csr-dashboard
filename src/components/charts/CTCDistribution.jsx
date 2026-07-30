import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'

const BANDS = [
  { label: '< 4L',   min: 0,   max: 4   },
  { label: '4–6L',   min: 4,   max: 6   },
  { label: '6–8L',   min: 6,   max: 8   },
  { label: '8–12L',  min: 8,   max: 12  },
  { label: '12–18L', min: 12,  max: 18  },
  { label: '18L+',   min: 18,  max: 9999},
]

const BIZ_COLORS = {
  Cement:       '#5B5BD6',
  Sugar:        '#F59E0B',
  Refractories: '#16A34A',
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">CTC Band: {label}</div>
      <div className="chart-tooltip-value" style={{ color: '#5B5BD6' }}>
        {total.toLocaleString('en-IN')}
      </div>
      <div className="chart-tooltip-sub">total employees in this salary range</div>
      <div className="chart-tooltip-divider" />
      {payload.map(p => (
        <div className="chart-tooltip-row" key={p.name}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: BIZ_COLORS[p.name], display: 'inline-block' }} />
            {p.name}
          </span>
          <span>{(p.value || 0).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}

export default function CTCDistribution() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    return BANDS.map(band => {
      const inBand = filteredData.filter(e => e.ctc >= band.min && e.ctc < band.max)
      const row = { label: band.label }
      ;['Cement', 'Sugar', 'Refractories'].forEach(b => {
        row[b] = inBand.filter(e => e.business === b).length
      })
      row.total = inBand.length
      return row
    })
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 24, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="areaCement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5B5BD6" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#5B5BD6" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="areaSugar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="areaRefrac" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#16A34A" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<Tip />} />
        <Area type="monotone" dataKey="Cement"       stroke="#5B5BD6" strokeWidth={2.5} fill="url(#areaCement)" dot={false} activeDot={{ r: 5, fill: '#5B5BD6' }} />
        <Area type="monotone" dataKey="Sugar"        stroke="#F59E0B" strokeWidth={2.5} fill="url(#areaSugar)"  dot={false} activeDot={{ r: 5, fill: '#F59E0B' }} />
        <Area type="monotone" dataKey="Refractories" stroke="#16A34A" strokeWidth={2.5} fill="url(#areaRefrac)" dot={false} activeDot={{ r: 5, fill: '#16A34A' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
