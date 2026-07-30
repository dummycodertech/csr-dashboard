import { useState } from 'react'
import { useFilters } from '../../context/FilterContext'
import { employees as allEmployees } from '../../data/employees'
import {
  SlidersHorizontal, ChevronLeft, ChevronRight, RotateCcw,
  Users, MapPin, Briefcase, Activity, ChevronDown, ChevronUp
} from 'lucide-react'

const uniq = (field) =>
  [...new Set(allEmployees.map(e => e[field]))].sort((a, b) =>
    typeof a === 'string' ? a.localeCompare(b) : a - b
  )

const FILTER_CONFIG = [
  { key: 'gender',              label: 'Gender',            icon: Users,     options: ['Male', 'Female'] },
  { key: 'type',                label: 'Employment Type',   icon: Briefcase, options: ['Onroll', 'Offroll'] },
  { key: 'business',            label: 'Business Unit',     icon: Activity,  options: ['Cement', 'Sugar', 'Refractories'] },
  { key: 'age_group',           label: 'Age Group',         icon: Users,     options: ['18-25', '26-35', '36-45', '46-60', '60+'] },
  { key: 'region',              label: 'Region',            icon: MapPin,    options: ['Central', 'East', 'North', 'South', 'West'] },
  { key: 'state',               label: 'State',             icon: MapPin,    options: uniq('state') },
  { key: 'project',             label: 'CSR Project',       icon: Briefcase, options: ['Education', 'Healthcare', 'Livelihood', 'Water & Sanitation', 'Skill Development', 'Environment', 'Infrastructure'] },
  { key: 'role',                label: 'Role',              icon: Users,     options: uniq('role') },
  { key: 'location',            label: 'Location',          icon: MapPin,    options: uniq('location') },
  { key: 'retiring_in_3_years', label: 'Retiring in 3 Yrs', icon: Activity, options: ['Yes', 'No'] },
]

function FilterSection({ label, icon: Icon, options, selected, onChange }) {
  const [open, setOpen] = useState(false)

  // ✅ FIX: toggle is wired to onClick on each option row
  const toggle = (val) => {
    onChange(selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val]
    )
  }

  const isActive = selected.length > 0

  return (
    <div style={{ marginBottom: 2 }}>
      {/* Section header button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 12px',
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: isActive ? 600 : 500,
          fontFamily: 'Inter, sans-serif',
          background: isActive ? 'var(--brand-light)' : 'transparent',
          color: isActive ? 'var(--brand)' : 'var(--text-body)',
          transition: 'background 150ms, color 150ms',
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-strong)' }}
        onMouseLeave={e => { e.currentTarget.style.background = isActive ? 'var(--brand-light)' : 'transparent'; e.currentTarget.style.color = isActive ? 'var(--brand)' : 'var(--text-body)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          <Icon size={13} style={{ color: isActive ? 'var(--brand)' : 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 4 }}>
          {isActive && (
            <span style={{
              fontSize: 9, fontWeight: 700, fontFamily: 'IBM Plex Mono',
              background: 'var(--brand)', color: 'white',
              borderRadius: '50%', width: 16, height: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(91,91,214,0.4)',
            }}>
              {selected.length}
            </span>
          )}
          {open ? <ChevronUp size={11} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>

      {/* Options list */}
      {open && (
        <div style={{ padding: '4px 4px 8px', maxHeight: 192, overflowY: 'auto' }}>
          {options.map(opt => {
            const checked = selected.includes(opt)
            return (
              <div
                key={opt}
                onClick={() => toggle(opt)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  userSelect: 'none',
                  background: checked ? 'var(--brand-light)' : 'transparent',
                  transition: 'background 120ms',
                }}
                onMouseEnter={e => { if (!checked) e.currentTarget.style.background = 'var(--surface-2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = checked ? 'var(--brand-light)' : 'transparent' }}
              >
                {/* Custom checkbox */}
                <div style={{
                  width: 16, height: 16, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${checked ? 'var(--brand)' : 'var(--border-md)'}`,
                  background: checked ? 'var(--brand)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms',
                }}>
                  {checked && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: 11,
                  fontFamily: 'Inter, sans-serif',
                  color: checked ? 'var(--text-strong)' : 'var(--text-body)',
                  fontWeight: checked ? 600 : 400,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {opt}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { filters, setFilter, clearAllFilters, activeFilterCount } = useFilters()

  return (
    <aside
      style={{
        width: collapsed ? 56 : 280,
        boxShadow: '2px 0 16px rgba(0,0,0,0.05)',
        transition: 'width 200ms ease-out',
        flexShrink: 0,
        height: '100%',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <div
        style={{
          height: 'var(--header-h)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'var(--brand-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SlidersHorizontal size={14} style={{ color: 'var(--brand)' }} />
            </div>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: 'var(--text-strong)',
              fontFamily: 'Inter, sans-serif',
              flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              Filters
            </span>
            {activeFilterCount > 0 && (
              <span style={{
                fontSize: 9, fontWeight: 700, fontFamily: 'IBM Plex Mono',
                background: 'var(--brand)', color: 'white',
                borderRadius: '50%', width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(91,91,214,0.4)',
              }}>
                {activeFilterCount > 9 ? '9+' : activeFilterCount}
              </span>
            )}
          </>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            width: 28, height: 28, borderRadius: 8, border: 'none',
            background: 'transparent', cursor: 'pointer', flexShrink: 0, marginLeft: 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-strong)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Filter scroll area */}
      {!collapsed && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                padding: '8px 12px', borderRadius: 10, marginBottom: 12, cursor: 'pointer',
                color: 'var(--danger)', background: 'var(--danger-light)',
                border: '1px solid rgba(232,57,90,0.18)',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,57,90,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-light)'}
            >
              <RotateCcw size={11} />
              Clear all filters
            </button>
          )}

          <div style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: 'var(--text-muted)',
            fontFamily: 'Inter, sans-serif',
            padding: '0 12px 8px',
          }}>
            Data Filters
          </div>

          {FILTER_CONFIG.map(f => (
            <FilterSection
              key={f.key}
              label={f.label}
              icon={f.icon}
              options={f.options}
              selected={filters[f.key]}
              onChange={(vals) => setFilter(f.key, vals)}
            />
          ))}
        </div>
      )}

      {/* Collapsed icons */}
      {collapsed && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--brand-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SlidersHorizontal size={15} style={{ color: 'var(--brand)' }} />
          </div>
          {activeFilterCount > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, fontFamily: 'IBM Plex Mono',
              background: 'var(--brand)', color: 'white',
              borderRadius: '50%', width: 18, height: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(91,91,214,0.4)',
            }}>
              {activeFilterCount > 9 ? '9+' : activeFilterCount}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface-2)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--positive)',
              boxShadow: '0 0 6px rgba(22,163,74,0.6)',
            }} />
            <span style={{ fontSize: 10, color: 'var(--text-body)', fontFamily: 'IBM Plex Mono' }}>
              FY 2026 · 1,000 employees
            </span>
          </div>
        </div>
      )}
    </aside>
  )
}
