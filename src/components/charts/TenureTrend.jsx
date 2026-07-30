import { useMemo } from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'

const TENURE_BANDS = [
  { label: '0–2 yrs',  min: 0,  max: 2  },
  { label: '2–5 yrs',  min: 2,  max: 5  },
  { label: '5–10 yrs', min: 5,  max: 10 },
  { label: '10–15 yrs',min: 10, max: 15 },
  { label: '15–20 yrs',min: 15, max: 20 },
  { label: '20+ yrs',  min: 20, max: 999},
]

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const total   = payload.find(p => p.name === 'Headcount')?.value || 0
  const retiring = payload.find(p => p.name === 'Retiring Soon')?.value || 0
  const avgCtc  = payload.find(p => p.dataKey === 'avgCtc')?.value || 0
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">Tenure: {label}</div>
      <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-body)', marginBottom: 4 }}>Headcount</div>
          <div className="chart-tooltip-value" style={{ fontSize: 28, color: '#5B5BD6' }}>{total}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-body)', marginBottom: 4 }}>Retiring Soon</div>
          <div className="chart-tooltip-value" style={{ fontSize: 28, color: '#E8395A' }}>{retiring}</div>
        </div>
      </div>
      <div className="chart-tooltip-divider" />
      <div className="chart-tooltip-row">
        <span>Avg CTC in band</span>
        <span>₹{avgCtc.toFixed(1)}L</span>
      </div>
      <div className="chart-tooltip-row">
        <span>Retirement risk</span>
        <span>{total ? ((retiring / total) * 100).toFixed(1) : 0}%</span>
      </div>
    </div>
  )
}

export default function TenureTrend() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    return TENURE_BANDS.map(band => {
      const inBand   = filteredData.filter(e => e.years_of_service >= band.min && e.years_of_service < band.max)
      const retiring = inBand.filter(e => e.retiring_in_3_years === 'Yes').length
      const avgCtc   = inBand.length ? inBand.reduce((s, e) => s + e.ctc, 0) / inBand.length : 0
      return {
        label: band.label,
        Headcount: inBand.length,
        'Retiring Soon': retiring,
        avgCtc,
      }
    })
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 24, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="tenureGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5B5BD6" stopOpacity={0.30} />
            <stop offset="95%" stopColor="#5B5BD6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          yAxisId="right" orientation="right"
          tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
          tickFormatter={v => `₹${v.toFixed(0)}L`}
        />
        <Tooltip content={<Tip />} />
        <Legend
          iconType="circle" iconSize={8}
          formatter={v => <span style={{ fontSize: 11, color: 'var(--text-body)', fontFamily: 'Inter, sans-serif' }}>{v}</span>}
        />
        <Area
          yAxisId="left" type="monotone" dataKey="Headcount"
          stroke="#5B5BD6" strokeWidth={2.5} fill="url(#tenureGrad)"
          dot={{ r: 4, fill: '#5B5BD6', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#5B5BD6' }}
        />
        <Line
          yAxisId="left" type="monotone" dataKey="Retiring Soon"
          stroke="#E8395A" strokeWidth={2} strokeDasharray="5 3"
          dot={{ r: 4, fill: '#E8395A', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#E8395A' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
