import { useMemo } from 'react'
import { useFilters } from '../../context/FilterContext'
import { groupBy, sumBy, PROJECT_COLORS } from '../../utils/dataUtils'

const PROJECTS = [
  'Education', 'Healthcare', 'Livelihood', 'Water & Sanitation',
  'Skill Development', 'Environment', 'Infrastructure',
]

// Map projects to gradient gradients
const PROJECT_GRAD = {
  'Education':          { from: '#5B5BD6', to: '#8B83F7' },
  'Healthcare':         { from: '#E8395A', to: '#FB7185' },
  'Livelihood':         { from: '#16A34A', to: '#34D399' },
  'Water & Sanitation': { from: '#0891B2', to: '#67E8F9' },
  'Skill Development':  { from: '#F59E0B', to: '#FCD34D' },
  'Environment':        { from: '#16A34A', to: '#4ADE80' },
  'Infrastructure':     { from: '#6B7280', to: '#9CA3AF' },
}

export default function ProjectWiseTable() {
  const { filteredData } = useFilters()

  const rows = useMemo(() => {
    const total = filteredData.length || 1
    const g = groupBy(filteredData, 'project')
    return PROJECTS.map(p => {
      const r = g[p] || []
      return { project: p, count: r.length, ctc: sumBy(r, 'ctc'), pct: (r.length / total) * 100 }
    }).sort((a, b) => b.count - a.count)
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <tr>
            {['Project', 'Headcount', 'Share', 'Total CTC'].map((h, i) => (
              <th key={h} style={{
                background: 'var(--surface-2)',
                padding: '10px 12px',
                textAlign: i === 0 ? 'left' : 'right',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-body)',
                fontFamily: 'Plus Jakarta Sans',
                borderBottom: '1px solid var(--border)',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const grad = PROJECT_GRAD[row.project] || { from: '#6C63FF', to: '#A78BFA' }
            return (
              <tr
                key={row.project}
                style={{
                  background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-light)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--surface-2)'}
              >
                {/* Project name */}
                <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: grad.from,
                      boxShadow: `0 0 6px ${grad.from}80`,
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'Inter, sans-serif' }}>
                      {row.project}
                    </span>
                  </div>
                </td>

                {/* Headcount */}
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>
                  {row.count.toLocaleString('en-IN')}
                </td>

                {/* Share bar */}
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                    <div style={{ width: 80, height: 6, borderRadius: 9999, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 9999,
                        width: `${Math.min(row.pct, 100)}%`,
                        background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                        boxShadow: `0 0 8px ${grad.from}60`,
                      }} />
                    </div>
                    <span style={{ fontFamily: 'IBM Plex Mono', color: 'var(--text-body)', fontSize: 11, minWidth: 36, textAlign: 'right' }}>
                      {row.pct.toFixed(1)}%
                    </span>
                  </div>
                </td>

                {/* CTC */}
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text-body)' }}>
                  ₹{(row.ctc / 100).toFixed(2)} Cr
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
