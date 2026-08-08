import { useState, useMemo } from 'react'
import { trackerData } from '../data/trackerData'
import { Search, CheckCircle2, XCircle, MinusCircle, Users, ClipboardCheck, AlertTriangle } from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────
const IDENTITY_COLS = ['S.No', 'Employee ID', 'Employee Name', 'Grade / Designation', 'Date Of Joining']

// Column name → short abbreviation
const SHORT_NAME = {
  'S.No': '#',
  'Employee ID': 'Emp ID',
  'Employee Name': 'Name',
  'Grade / Designation': 'Designation',
  'Date Of Joining': 'DOJ',
  'Offer Summary': 'Offer',
  'Assessment Sheet': 'Assess.',
  'CV': 'CV',
  '10Th Marksheet': '10th',
  '12Th Marksheet': '12th',
  'Graduation Marksheet': 'Grad.',
  'Post Grad Marksheet': 'PG',
  'Aadhar Card': 'Aadhar',
  'Pan Card': 'PAN',
  'Photograph': 'Photo',
  'Experience Letter': 'Exp. Ltr',
  'Last 3 Month Salary Slip & Bank': 'Salary Slip',
  'Last 3 Month Salary Slip & Bank Statement': 'Salary Slip',
  'Reference Check': 'Ref. Chk',
  'Creating Requisition In Hr4U': 'Req. Hr4U',
  'Draft Offer': 'Drft Ofr',
  'Extend Offer': 'Ext. Ofr',
  'Email Id Creation': 'Email ID',
  'Welcome Mailer': 'Wlcm Mail',
  'Add In Whatsapp Group And Group Mail': 'WA Group',
  'Create DMFS Credentials': 'DMFS Cred',
  'Create DFMS Credentials': 'DFMS Cred',
  'Candidate Creation In DFMS': 'DFMS Cand',
  'Draft Contract Letter': 'Contract',
  'SR Ticket Raise For Mail ID': 'SR Ticket',
  'Induction With Dept.': 'Induction',
  'Induction With Department': 'Induction',
  'Code Of Conduct': 'CoC',
  'PF Form 11': 'PF-11',
  'PF Form 11 (2)': 'PF-11(2)',
  'Conflict Of Interest': 'COI',
  'PF Form 2': 'PF-2',
  'Nomination Declaration': 'Nom. Decl',
  'Gratuity Nomination': 'Gratuity',
  'Candidate Information Form': 'Cand. Info',
  'Statutory Forms': 'Stat. Frms',
  'BGV Initiate': 'BGV',
  'Id Card & Visiting Card': 'ID Card',
  'Id Card And Visiting Card': 'ID Card',
  'Insurance Input': 'Insurance',
  'Salary Input': 'Salary In.',
}

const short = (name) => SHORT_NAME[name] ?? name

// Status styles — normal and highlighted (when that status is the active filter)
const STATUS_STYLE = {
  Yes:   {
    normal:      { bg: 'bg-positive/15',  text: 'text-positive' },
    highlighted: { bg: 'bg-positive',     text: 'text-white'    },
    icon: CheckCircle2,
  },
  No:    {
    normal:      { bg: 'bg-danger/15',    text: 'text-danger'   },
    highlighted: { bg: 'bg-danger',       text: 'text-white'    },
    icon: XCircle,
  },
  'N/A': {
    normal:      { bg: 'bg-s2',           text: 'text-tx-body'  },
    highlighted: { bg: 'bg-brand/80',     text: 'text-white'    },
    icon: MinusCircle,
  },
  '':    {
    normal:      { bg: '',                text: 'text-tx-body'  },
    highlighted: { bg: '',                text: 'text-tx-body'  },
    icon: MinusCircle,
  },
}

const pct = (records, checkCols) => {
  let yes = 0, total = 0
  records.forEach(r => checkCols.forEach(c => {
    const v = r[c]
    if (v === 'Yes' || v === 'No') { total++; if (v === 'Yes') yes++ }
  }))
  return total ? Math.round((yes / total) * 100) : 0
}

// ── KPI strip ──────────────────────────────────────────────────────
function TrackerKPIs({ records, checkCols }) {
  const total    = records.length
  const comp     = pct(records, checkCols)
  const fullyDone = records.filter(r =>
    checkCols.every(c => r[c] === 'Yes' || r[c] === 'N/A' || r[c] === '')
  ).length
  const pending  = records.filter(r => checkCols.some(c => r[c] === 'No')).length

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {[
        { label: 'Total Employees',   value: total,    icon: Users,          color: 'text-brand',    bg: 'bg-brand/10'    },
        { label: 'Overall Completion',value: `${comp}%`,icon: ClipboardCheck, color: 'text-positive', bg: 'bg-positive/10' },
        { label: 'Fully Compliant',   value: fullyDone, icon: CheckCircle2,   color: 'text-positive', bg: 'bg-positive/10' },
        { label: 'Has Pending (No)',   value: pending,   icon: AlertTriangle,  color: 'text-danger',   bg: 'bg-danger/10'   },
      ].map(k => (
        <div key={k.label} className="card px-4 py-3 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center flex-shrink-0`}>
            <k.icon size={15} className={k.color} />
          </div>
          <div>
            <div className={`data-num text-xl font-semibold ${k.color}`}>{k.value}</div>
            <div className="text-[10px] text-tx-body">{k.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Section completion bar ─────────────────────────────────────────
function SectionBar({ label, records, cols }) {
  const p = pct(records, cols.map(c => c.name))
  const color = p >= 75 ? 'bg-positive' : p >= 40 ? 'bg-accent' : 'bg-danger'
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-36 text-tx-body truncate flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-s2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${p}%` }} />
      </div>
      <span className="data-num text-tx-strong w-8 text-right flex-shrink-0">{p}%</span>
    </div>
  )
}

// ── Main tracker table ─────────────────────────────────────────────
function TrackerTable({ data }) {
  const [search,       setSearch]  = useState('')
  const [sectionFilter, setSFilter]= useState('All')
  const [statusFilter,  setStatusF]= useState('All')

  const { columns, records } = data

  const checkCols   = columns.filter(c => !IDENTITY_COLS.includes(c.name)).map(c => c.name)
  const identityCols= columns.filter(c =>  IDENTITY_COLS.includes(c.name))

  const sectionGroups = useMemo(() => {
    const groups = {}
    columns.filter(c => !IDENTITY_COLS.includes(c.name)).forEach(c => {
      if (!groups[c.section]) groups[c.section] = []
      groups[c.section].push(c)
    })
    return groups
  }, [columns])

  const SECTION_LABELS = {
    'PRE JOINING':                  'Pre Joining',
    'AFTER SELECTION COMPLIANCES':  'After Selection',
    'POST JOINING':                 'Post Joining',
  }

  const visibleSections = sectionFilter === 'All'
    ? Object.keys(sectionGroups)
    : [sectionFilter]

  const visibleCols = visibleSections.flatMap(s => sectionGroups[s] || [])

  const filteredRecords = useMemo(() =>
    records.filter(r => {
      const matchSearch = !search || [
        r['Employee Name'], r['Employee ID'], r['Grade / Designation'],
      ].some(v => v?.toLowerCase().includes(search.toLowerCase()))

      const matchStatus = statusFilter === 'All' || checkCols.some(c => r[c] === statusFilter)
      return matchSearch && matchStatus
    }),
  [records, search, statusFilter, checkCols])

  // Status filter button styles
  const filterBtnStyle = (s) => {
    if (statusFilter !== s) return 'bg-s2 text-tx-body hover:text-tx-strong'
    if (s === 'Yes')  return 'bg-positive text-white ring-1 ring-positive/50'
    if (s === 'No')   return 'bg-danger   text-white ring-1 ring-danger/50'
    if (s === 'N/A')  return 'bg-brand    text-white ring-1 ring-brand/50'
    return 'bg-brand text-white'
  }

  return (
    <div className="flex flex-col gap-4">
      <TrackerKPIs records={records} checkCols={checkCols} />

      {/* Completion bars */}
      <div className="card px-4 py-3 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-tx-body mb-3">
          Completion by Stage
        </p>
        {Object.entries(sectionGroups)
          .filter(([s]) => s !== 'EMPLOYEE DETAILS')
          .map(([section, cols]) => (
            <SectionBar key={section} label={SECTION_LABELS[section] ?? section} records={records} cols={cols} />
          ))}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-tx-body" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name / ID / role…"
            className="pl-8 pr-3 py-1.5 text-[12px] rounded-lg border border-[var(--border)] bg-surface text-tx-strong placeholder:text-tx-body focus:outline-none focus:border-brand w-56" />
        </div>

        {/* Section filter */}
        <div className="flex items-center gap-1">
          {['All', ...Object.keys(sectionGroups).filter(s => s !== 'EMPLOYEE DETAILS')].map(s => (
            <button key={s} onClick={() => setSFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                sectionFilter === s ? 'bg-brand text-white' : 'bg-s2 text-tx-body hover:text-tx-strong'
              }`}>
              {SECTION_LABELS[s] ?? s}
            </button>
          ))}
        </div>

        {/* Status filter — coloured buttons, matching cell colours */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[10px] text-tx-body mr-1">Highlight:</span>
          {['All', 'Yes', 'No', 'N/A'].map(s => (
            <button key={s} onClick={() => setStatusF(s === statusFilter ? 'All' : s)}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${filterBtnStyle(s)}`}>
              {s}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-tx-body font-mono">
          {filteredRecords.length} of {records.length}
        </span>
      </div>

      {/* Table */}
      <div className="card overflow-auto" style={{ maxHeight: '62vh' }}>
        <table className="text-[11px] w-full border-collapse">
          <thead className="sticky top-0 z-20">
            {/* Row 1: section group headers */}
            <tr>
              {identityCols.map((c, i) => (
                <th key={i} rowSpan={2}
                  className="bg-s2 border border-[var(--border)] px-2 py-2 text-left font-semibold text-tx-strong text-[10px] whitespace-nowrap align-bottom">
                  {short(c.name)}
                </th>
              ))}
              {visibleSections.map(section => {
                const grpCols = sectionGroups[section] || []
                if (!grpCols.length) return null
                const sectionColors = {
                  'PRE JOINING':                 'bg-brand/10 text-brand',
                  'AFTER SELECTION COMPLIANCES': 'bg-accent/10 text-accent',
                  'POST JOINING':                'bg-positive/10 text-positive',
                }
                return (
                  <th key={section} colSpan={grpCols.length}
                    className={`border border-[var(--border)] px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider ${sectionColors[section] ?? 'bg-s2 text-tx-body'}`}>
                    {SECTION_LABELS[section] ?? section}
                  </th>
                )
              })}
            </tr>
            {/* Row 2: individual column names (rotated, shortened) */}
            <tr>
              {visibleCols.map((c, i) => (
                <th key={i}
                  className="bg-s2 border border-[var(--border)] px-1 py-1 text-center text-[9px] font-medium text-tx-body whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 72, verticalAlign: 'bottom' }}
                  title={c.name}>
                  {short(c.name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-surface' : 'bg-s2'}>
                {/* Identity columns — never highlighted */}
                {identityCols.map((c, ci) => (
                  <td key={ci} className="border border-[var(--border)] px-2 py-1.5 whitespace-nowrap">
                    {c.name === 'Employee Name'
                      ? <span className="font-medium text-tx-strong">{row[c.name]}</span>
                      : <span className="font-mono text-tx-body text-[10px]">{row[c.name]}</span>
                    }
                  </td>
                ))}
                {/* Check columns — highlighted when matching active status filter */}
                {visibleCols.map((c, ci) => {
                  const val  = row[c.name] || ''
                  const def  = STATUS_STYLE[val] ?? STATUS_STYLE['']
                  const Icon = def.icon

                  // Use highlighted style when this cell matches the active filter
                  const isMatch  = statusFilter !== 'All' && val === statusFilter
                  const isDimmed = statusFilter !== 'All' && val !== statusFilter && val !== ''
                  const style    = isMatch ? def.highlighted : def.normal

                  return (
                    <td key={ci}
                      className={`border border-[var(--border)] text-center transition-colors ${style.bg} ${
                        isDimmed ? 'opacity-25' : ''
                      }`}
                      title={`${c.name}: ${val || '—'}`}>
                      {val
                        ? <Icon size={12} className={`mx-auto transition-colors ${style.text}`} strokeWidth={2.5} />
                        : <span className="text-tx-body opacity-30">·</span>
                      }
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRecords.length === 0 && (
          <div className="flex items-center justify-center py-12 text-tx-body text-[12px]">
            No employees match the current filters
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-tx-body">
        <span className="font-semibold">Legend:</span>
        <span className="flex items-center gap-1 font-mono text-positive"><CheckCircle2 size={11} strokeWidth={2.5} /> Yes</span>
        <span className="flex items-center gap-1 font-mono text-danger"><XCircle size={11} strokeWidth={2.5} /> No</span>
        <span className="flex items-center gap-1 font-mono text-tx-body"><MinusCircle size={11} strokeWidth={2.5} /> N/A</span>
        <span className="ml-2 opacity-60">Click Highlight button to spotlight cells · Hover cell for full field name</span>
      </div>
    </div>
  )
}

// ── Page root ──────────────────────────────────────────────────────
export default function OnboardingTrackerPage() {
  const [tab, setTab] = useState('onrole')
  const data = tab === 'onrole' ? trackerData.onrole : trackerData.offrole

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-tx-strong">Onboarding Compliance Tracker</h2>
          <p className="text-[11px] text-tx-body mt-0.5">
            Pre-joining · After Selection · Post Joining checklist — converted from Excel tracker
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-s2 rounded-lg">
          {[
            { id: 'onrole',  label: `Onrole (${trackerData.onrole.records.length})`  },
            { id: 'offrole', label: `Offrole (${trackerData.offrole.records.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                tab === t.id ? 'bg-surface text-tx-strong shadow-sm' : 'text-tx-body hover:text-tx-strong'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <TrackerTable key={tab} data={data} />
    </div>
  )
}
