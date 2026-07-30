import { useMemo } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useFilters } from '../../context/FilterContext'

const PROJECTS = ['Education', 'Healthcare', 'Livelihood', 'Water & Sanitation', 'Skill Development', 'Environment', 'Infrastructure']

const PROJ_COLORS = ['#5B5BD6','#E8395A','#16A34A','#0891B2','#D97706','#7C3AED','#6B7280']

// Normalize a value 0–100 given min and max across all projects
const norm = (val, min, max) => max === min ? 50 : Math.round(((val - min) / (max - min)) * 100)

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{payload[0]?.payload?.axis}</div>
      <div className="chart-tooltip-value" style={{ color: '#5B5BD6', fontSize: 26 }}>
        {payload[0]?.payload?.rawValues?.[payload[0]?.name] ?? payload[0]?.value}
      </div>
      <div className="chart-tooltip-sub">raw value for this dimension</div>
    </div>
  )
}

export default function ProjectRadar() {
  const { filteredData } = useFilters()

  const { chartData, projectStats } = useMemo(() => {
    const stats = {}
    PROJECTS.forEach(p => {
      const rows = filteredData.filter(e => e.project === p)
      if (!rows.length) { stats[p] = null; return }
      const avgAge = rows.reduce((s, e) => s + e.age, 0) / rows.length
      const avgCtc = rows.reduce((s, e) => s + e.ctc, 0) / rows.length
      const pctFemale = (rows.filter(e => e.gender === 'Female').length / rows.length) * 100
      const pctOnroll = (rows.filter(e => e.type === 'Onroll').length / rows.length) * 100
      const avgYos    = rows.reduce((s, e) => s + e.years_of_service, 0) / rows.length
      stats[p] = { count: rows.length, avgAge, avgCtc, pctFemale, pctOnroll, avgYos }
    })

    // Get min/max for normalization
    const vals = Object.values(stats).filter(Boolean)
    const get = (key) => ({ min: Math.min(...vals.map(v => v[key])), max: Math.max(...vals.map(v => v[key])) })
    const ranges = {
      count: get('count'), avgAge: get('avgAge'), avgCtc: get('avgCtc'),
      pctFemale: get('pctFemale'), pctOnroll: get('pctOnroll'), avgYos: get('avgYos'),
    }

    const chartData = [
      { axis: 'Headcount',    ...Object.fromEntries(PROJECTS.map(p => [p, stats[p] ? norm(stats[p].count, ranges.count.min, ranges.count.max) : 0])) },
      { axis: 'Avg Age',      ...Object.fromEntries(PROJECTS.map(p => [p, stats[p] ? norm(stats[p].avgAge, ranges.avgAge.min, ranges.avgAge.max) : 0])) },
      { axis: 'Avg CTC',      ...Object.fromEntries(PROJECTS.map(p => [p, stats[p] ? norm(stats[p].avgCtc, ranges.avgCtc.min, ranges.avgCtc.max) : 0])) },
      { axis: '% Female',     ...Object.fromEntries(PROJECTS.map(p => [p, stats[p] ? norm(stats[p].pctFemale, ranges.pctFemale.min, ranges.pctFemale.max) : 0])) },
      { axis: '% Onroll',     ...Object.fromEntries(PROJECTS.map(p => [p, stats[p] ? norm(stats[p].pctOnroll, ranges.pctOnroll.min, ranges.pctOnroll.max) : 0])) },
      { axis: 'Avg Tenure',   ...Object.fromEntries(PROJECTS.map(p => [p, stats[p] ? norm(stats[p].avgYos, ranges.avgYos.min, ranges.avgYos.max) : 0])) },
    ]

    return { chartData, projectStats: stats }
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  const activeProjects = PROJECTS.filter(p => projectStats[p])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 11, fill: 'var(--text-body)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            />
            {activeProjects.map((p, i) => (
              <Radar
                key={p} name={p} dataKey={p}
                stroke={PROJ_COLORS[i % PROJ_COLORS.length]}
                fill={PROJ_COLORS[i % PROJ_COLORS.length]}
                fillOpacity={0.10}
                strokeWidth={1.8}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {/* Compact legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', justifyContent: 'center', padding: '4px 8px 2px' }}>
        {activeProjects.map((p, i) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: PROJ_COLORS[i % PROJ_COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: 'var(--text-body)', fontFamily: 'Inter, sans-serif' }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
