import { useMemo } from 'react'
import { useFilters } from '../../context/FilterContext'
import { groupBy, avgBy } from '../../utils/dataUtils'

const BUSINESSES = ['Cement', 'Sugar', 'Refractories']
const ROLE_TYPES  = ['Managerial', 'Non-Managerial']

const BIZ_COLOR = {
  Cement:       { bg: 'rgba(91,91,214,0.10)',  border: '#5B5BD6', text: '#5B5BD6' },
  Sugar:        { bg: 'rgba(245,158,11,0.10)', border: '#D97706', text: '#D97706' },
  Refractories: { bg: 'rgba(22,163,74,0.10)',  border: '#16A34A', text: '#16A34A' },
}

const intensity = (val, min, max) => {
  if (max === min) return 0.15
  return 0.08 + ((val - min) / (max - min)) * 0.60
}

export default function SalaryHeatmap() {
  const { filteredData } = useFilters()

  const { matrix, minCtc, maxCtc } = useMemo(() => {
    const g = groupBy(filteredData, 'business')
    const matrix = {}
    let minCtc = Infinity, maxCtc = -Infinity

    BUSINESSES.forEach(biz => {
      matrix[biz] = {}
      const bizData = g[biz] || []
      ROLE_TYPES.forEach(rt => {
        const subset = bizData.filter(e => e.role_type === rt)
        const avg = subset.length ? subset.reduce((s, e) => s + e.ctc, 0) / subset.length : 0
        const count = subset.length
        matrix[biz][rt] = { avg, count }
        if (avg > 0) {
          if (avg < minCtc) minCtc = avg
          if (avg > maxCtc) maxCtc = avg
        }
      })
    })
    return { matrix, minCtc: minCtc === Infinity ? 0 : minCtc, maxCtc }
  }, [filteredData])

  if (!filteredData.length)
    return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-body)',fontSize:12 }}>No data</div>

  return (
    <div style={{ padding: '8px 4px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr', gap: 10 }}>
        <div />
        {BUSINESSES.map(biz => (
          <div key={biz} style={{
            textAlign: 'center', fontSize: 11, fontWeight: 700,
            color: BIZ_COLOR[biz].text, fontFamily: 'Inter, sans-serif',
            padding: '6px 8px', borderRadius: 8,
            background: BIZ_COLOR[biz].bg,
            letterSpacing: '0.03em',
          }}>
            {biz}
          </div>
        ))}
      </div>

      {/* Rows */}
      {ROLE_TYPES.map(rt => (
        <div key={rt} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr', gap: 10, flex: 1 }}>
          {/* Row label */}
          <div style={{
            display: 'flex', alignItems: 'center',
            fontSize: 12, fontWeight: 600, color: 'var(--text-strong)',
            fontFamily: 'Inter, sans-serif',
            paddingRight: 8,
          }}>
            {rt}
          </div>
          {BUSINESSES.map(biz => {
            const cell = matrix[biz]?.[rt] || { avg: 0, count: 0 }
            const alpha = intensity(cell.avg, minCtc, maxCtc)
            const c = BIZ_COLOR[biz]
            return (
              <div
                key={biz}
                style={{
                  borderRadius: 14,
                  border: `1.5px solid ${c.border}30`,
                  background: cell.avg > 0
                    ? `rgba(${c.border === '#5B5BD6' ? '91,91,214' : c.border === '#D97706' ? '217,119,6' : '22,163,74'},${alpha})`
                    : 'var(--surface-2)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '16px 12px', gap: 6,
                  transition: 'transform 200ms, box-shadow 200ms',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.04)'
                  e.currentTarget.style.boxShadow = `0 8px 24px ${c.border}30`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  fontFamily: 'IBM Plex Mono', fontSize: 22, fontWeight: 700,
                  color: cell.avg > 0 ? c.text : 'var(--text-muted)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}>
                  {cell.avg > 0 ? `₹${cell.avg.toFixed(1)}L` : '—'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-body)', fontFamily: 'Inter, sans-serif' }}>
                  {cell.count > 0 ? `${cell.count} employees` : 'no data'}
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', paddingTop: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>Lower CTC</span>
        <div style={{
          width: 80, height: 6, borderRadius: 9999,
          background: 'linear-gradient(90deg, rgba(91,91,214,0.08), rgba(91,91,214,0.70))',
        }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>Higher CTC</span>
      </div>
    </div>
  )
}
