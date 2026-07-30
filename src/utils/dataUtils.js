// ── Chart colour palette ───────────────────────────────────────────
export const CHART_COLORS = ['#2563EB', '#D97706', '#059669', '#0891B2', '#F43F5E', '#6B7280']

export const BUSINESS_COLORS = {
  Cement:       '#2563EB',
  Sugar:        '#D97706',
  Refractories: '#059669',
}

export const PROJECT_COLORS = {
  'Education':          '#2563EB',
  'Healthcare':         '#DC2626',
  'Livelihood':         '#059669',
  'Water & Sanitation': '#0891B2',
  'Skill Development':  '#D97706',
  'Environment':        '#16A34A',
  'Infrastructure':     '#6B7280',
}

export const REGION_COLORS = {
  North:   '#2563EB',
  South:   '#D97706',
  East:    '#059669',
  West:    '#0891B2',
  Central: '#F43F5E',
}

// ── Aggregation helpers ────────────────────────────────────────────
export const groupBy = (data, key) =>
  data.reduce((acc, item) => {
    const g = item[key]
    acc[g] = acc[g] || []
    acc[g].push(item)
    return acc
  }, {})

export const sumBy = (data, key) =>
  data.reduce((s, item) => s + (Number(item[key]) || 0), 0)

export const avgBy = (data, key) =>
  data.length ? sumBy(data, key) / data.length : 0

// ── Formatting ─────────────────────────────────────────────────────
export const fmtNum = (n) => n.toLocaleString('en-IN')
export const fmtCr  = (lakhs) => `₹${(lakhs / 100).toFixed(2)} Cr`
export const fmtL   = (lakhs) => `₹${lakhs.toFixed(1)}L`
