import { useMemo } from 'react'
import { useFilters } from '../../context/FilterContext'
import { sumBy, avgBy, REGION_COLORS } from '../../utils/dataUtils'

const REGIONS = ['North', 'South', 'East', 'West', 'Central']

const REGION_GRAD = {
  North:   { from: '#5B5BD6', to: '#8B83F7' },
  South:   { from: '#F59E0B', to: '#FCD34D' },
  East:    { from: '#16A34A', to: '#34D399' },
  West:    { from: '#0891B2', to: '#67E8F9' },
  Central: { from: '#E8395A', to: '#FB7185' },
}

const thStyle = {
  background: 'var(--surface-2)',
  padding: '10px 12px',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-body)',
  fontFamily: 'Plus Jakarta Sans',
  borderBottom: '1px solid var(--border)',
  whiteSpace: 'nowrap',
  position: 'sticky',
  top: 0,
  zIndex: 10,
}

export default function RegionTable() {
  const { filteredData } = useFilters()

  const rows = useMemo(() =>
    REGIONS.map(region => {
      const r = filteredData.filter(e => e.region === region)
      return {
        region,
        count: r.length,
        ctc: sumBy(r, 'ctc'),
        projects: new Set(r.map(e => e.project)).size,
        avgAge: avgBy(r, 'age').toFixed(1),
        avgYos: avgBy(r, 'years_of_service').toFixed(1),
      }
    }), [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {[
              ['Region', 'left'],
              ['HC', 'right'],
              ['CTC', 'right'],
              ['Prj', 'right'],
              ['Avg Age', 'right'],
              ['Avg YoS', 'right'],
            ].map(([h, align]) => (
              <th key={h} style={{ ...thStyle, textAlign: align }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const g = REGION_GRAD[row.region] || { from: '#6C63FF', to: '#A78BFA' }
            return (
              <tr
                key={row.region}
                style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-light)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--surface-2)'}
              >
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: g.from,
                      boxShadow: `0 0 6px ${g.from}80`,
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-strong)', fontFamily: 'Inter, sans-serif' }}>
                      {row.region}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>
                  {row.count.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text-body)' }}>
                  ₹{(row.ctc / 100).toFixed(1)}Cr
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text-body)' }}>
                  {row.projects}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text-body)' }}>
                  {row.avgAge}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text-body)' }}>
                  {row.avgYos}y
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
