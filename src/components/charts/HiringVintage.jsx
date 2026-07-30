import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const total = payload[0]?.value || 0
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">Joined in {label}</div>
      <div className="chart-tooltip-value" style={{ color: '#5B5BD6' }}>
        {total}
      </div>
      <div className="chart-tooltip-sub">employees hired this year</div>
    </div>
  )
}

export default function HiringVintage() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    const yearMap = {}
    filteredData.forEach(e => {
      if (!e.joining_date) return
      const yr = String(e.joining_date).slice(0, 4)
      yearMap[yr] = (yearMap[yr] || 0) + 1
    })
    const years = Object.keys(yearMap).sort()
    return years.map(yr => ({ year: yr, Hires: yearMap[yr] }))
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 24, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="hiringGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5B5BD6" stopOpacity={0.40} />
            <stop offset="50%" stopColor="#8B83F7" stopOpacity={0.20} />
            <stop offset="95%" stopColor="#5B5BD6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<Tip />} />
        <Area
          type="monotone" dataKey="Hires"
          stroke="#5B5BD6" strokeWidth={2.5}
          fill="url(#hiringGrad)"
          dot={{ r: 5, fill: '#5B5BD6', strokeWidth: 0 }}
          activeDot={{ r: 7, fill: '#5B5BD6', stroke: 'white', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
