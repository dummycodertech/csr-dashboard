import { useMemo } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'
import { groupBy, sumBy } from '../../utils/dataUtils'

const BIZ = ['Cement', 'Sugar', 'Refractories']

const BIZ_COLORS = {
  Cement:       { id: 'costCement', from: '#5B5BD6', to: '#8B83F7', solid: '#5B5BD6' },
  Sugar:        { id: 'costSugar',  from: '#F59E0B', to: '#FCD34D', solid: '#D97706' },
  Refractories: { id: 'costRefrac', from: '#16A34A', to: '#34D399', solid: '#16A34A' },
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const color = BIZ_COLORS[label]?.solid || '#5B5BD6'
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{label}</div>
      <div className="chart-tooltip-value" style={{ color }}>
        ₹{(payload[0].value / 100).toFixed(2)}<span style={{ fontSize: 16, fontWeight: 400 }}> Cr</span>
      </div>
      <div className="chart-tooltip-sub">annual cost of operations</div>
      <div className="chart-tooltip-divider" />
      <div className="chart-tooltip-row">
        <span>In Lakhs</span>
        <span>₹{payload[0].value.toFixed(1)}L</span>
      </div>
    </div>
  )
}

export default function CostByBusiness() {
  const { filteredData } = useFilters()

  const data = useMemo(() => {
    const g = groupBy(filteredData, 'business')
    return BIZ.map(b => ({
      name: b,
      ctcL: parseFloat(sumBy(g[b] || [], 'ctc').toFixed(2)),
      color: BIZ_COLORS[b],
    }))
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 28, right: 16, left: 8, bottom: 0 }}>
        <defs>
          {Object.values(BIZ_COLORS).map(c => (
            <linearGradient key={c.id} id={c.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.from} stopOpacity={1} />
              <stop offset="100%" stopColor={c.to} stopOpacity={0.65} />
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
          tickFormatter={v => `₹${(v / 100).toFixed(0)}Cr`}
          tick={{ fontSize: 10, fill: 'var(--text-body)', fontFamily: 'IBM Plex Mono' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(91,91,214,0.04)', radius: 8 }} />
        <Bar dataKey="ctcL" radius={[10, 10, 0, 0]} maxBarSize={100}>
          {data.map((d, i) => (
            <Cell key={i} fill={`url(#${d.color.id})`} />
          ))}
          <LabelList
            dataKey="ctcL"
            position="top"
            formatter={v => `₹${(v / 100).toFixed(2)}Cr`}
            style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: 'var(--text-strong)', fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
