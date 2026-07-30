import { useTheme } from '../../context/ThemeContext'
import { useFilters } from '../../context/FilterContext'
import {
  LayoutDashboard, Search, Bell, Sun, Moon,
  ChevronDown, Settings, Calendar
} from 'lucide-react'
import { fmtNum } from '../../utils/dataUtils'

export default function Header() {
  const { isDark, toggle } = useTheme()
  const { filteredData, totalData, activeFilterCount } = useFilters()
  const isFiltered = filteredData.length !== totalData.length

  return (
    <header
      className="flex-shrink-0 border-b border-[var(--border)] bg-surface flex items-center justify-between px-6 gap-4"
      style={{ height: 'var(--header-h)', boxShadow: '0 1px 0 var(--border), 0 4px 16px rgba(0,0,0,0.04)' }}
    >
      {/* Left: brand */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="w-10 h-10 rounded-2xl grad-purple flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: '0 4px 16px rgba(91,91,214,0.45)' }}
        >
          <LayoutDashboard size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-[16px] text-tx-strong tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            CSR Analytics
          </div>
          <div className="text-[10px] text-tx-body font-mono mt-0.5">
            {isFiltered ? (
              <span>
                <span className="text-brand font-semibold">{fmtNum(filteredData.length)}</span>
                <span className="text-tx-body"> / {fmtNum(totalData.length)} emp</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 text-accent">· {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</span>
                )}
              </span>
            ) : (
              <span>{fmtNum(totalData.length)} employees · FY 2026</span>
            )}
          </div>
        </div>
      </div>

      {/* Center: search */}
      <div className="search-bar flex-1 max-w-md hidden md:flex">
        <Search size={14} className="text-tx-body flex-shrink-0" />
        <input placeholder="Search employees, locations, projects…" readOnly />
        <span
          className="text-[10px] text-tx-muted font-mono hidden lg:block flex-shrink-0 ml-auto border border-[var(--border)] rounded-md px-1.5 py-0.5"
          style={{ background: 'var(--surface-3)' }}
        >
          ⌘K
        </span>
      </div>

      {/* Right: date + actions */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Date chip */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-medium text-tx-body border border-[var(--border)]"
          style={{ background: 'var(--surface-2)', fontFamily: 'Inter, sans-serif' }}
        >
          <Calendar size={12} className="text-brand" />
          <span>FY 2026</span>
          <ChevronDown size={11} className="text-tx-muted" />
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl border border-[var(--border)] bg-surface flex items-center justify-center text-tx-body hover:text-brand hover:border-brand/30 hover:bg-[var(--brand-light)] transition-all duration-150"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger"
            style={{ boxShadow: '0 0 6px rgba(232,57,90,0.8)' }}
          />
        </button>

        {/* Settings */}
        <button
          className="w-9 h-9 rounded-xl border border-[var(--border)] bg-surface flex items-center justify-center text-tx-body hover:text-brand hover:border-brand/30 hover:bg-[var(--brand-light)] transition-all duration-150"
          aria-label="Settings"
        >
          <Settings size={15} />
        </button>

        {/* Theme toggle */}
        <button
          id="theme-toggle"
          onClick={toggle}
          aria-label="Toggle light/dark mode"
          className="w-9 h-9 rounded-xl border border-[var(--border)] bg-surface flex items-center justify-center text-tx-body hover:text-brand hover:border-brand/30 hover:bg-[var(--brand-light)] transition-all duration-150"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Avatar */}
        <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-[var(--surface-2)] transition-colors group">
          <div
            className="w-8 h-8 rounded-xl grad-purple flex items-center justify-center text-white font-bold text-[12px] group-hover:scale-105 transition-transform"
            style={{ fontFamily: 'Inter, sans-serif', boxShadow: '0 2px 8px rgba(91,91,214,0.35)' }}
          >
            AD
          </div>
          <div className="text-left hidden md:block">
            <div className="text-[12px] font-semibold text-tx-strong leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Admin</div>
            <div className="text-[10px] text-tx-body leading-tight">CSR Head</div>
          </div>
          <ChevronDown size={12} className="text-tx-muted hidden md:block" />
        </button>
      </div>
    </header>
  )
}
