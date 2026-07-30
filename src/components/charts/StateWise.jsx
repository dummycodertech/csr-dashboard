import { useMemo } from 'react'
import { useFilters } from '../../context/FilterContext'
import { groupBy, sumBy, REGION_COLORS } from '../../utils/dataUtils'

const STATE_REGION = {
  'Uttar Pradesh': 'North', 'Rajasthan': 'North', 'Haryana': 'North',
  'Tamil Nadu': 'South', 'Karnataka': 'South', 'Andhra Pradesh': 'South',
  'West Bengal': 'East', 'Odisha': 'East', 'Jharkhand': 'East',
  'Maharashtra': 'West', 'Gujarat': 'West',
  'Madhya Pradesh': 'Central', 'Chhattisgarh': 'Central',
}

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
  position: 'sticky',
  top: 0,
  zIndex: 10,
}

export default function StateWise() {
  const { filteredData } = useFilters()

  const rows = useMemo(() => {
    const g = groupBy(filteredData, 'state')
    return Object.entries(STATE_REGION)
      .map(([state, region]) => ({
        state, region,
        count: (g[state] || []).length,
        ctc: sumBy(g[state] || [], 'ctc'),
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: 'left' }}>State</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>Region</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>HC</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Total CTC</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const g = REGION_GRAD[row.region] || { from: '#6C63FF', to: '#A78BFA' }
            return (
              <tr
                key={row.state}
                style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-light)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--surface-2)'}
              >
                <td style={{ padding: '9px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'Inter, sans-serif' }}>
                  {row.state}
                </td>
                <td style={{ padding: '9px 12px' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    padding: '2px 8px', borderRadius: 9999,
                    background: `${g.from}20`,
                    color: g.from,
                    fontFamily: 'Plus Jakarta Sans',
                    boxShadow: `0 0 8px ${g.from}30`,
                  }}>
                    {row.region}
                  </span>
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>
                  {row.count.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text-body)' }}>
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
