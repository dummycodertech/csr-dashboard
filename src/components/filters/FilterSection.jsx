import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FilterSection({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false)

  const toggle = (val) => {
    onChange(
      selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]
    )
  }

  const isActive = selected.length > 0

  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between py-2 px-2 text-[12px] font-medium rounded-md hover:bg-s2 transition-colors ${
          isActive ? 'text-brand' : 'text-tx-strong'
        }`}
      >
        <span className="truncate">{label}</span>
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          {isActive && (
            <span className="text-[9px] bg-brand/12 text-brand rounded px-1 py-0.5 font-mono">
              {selected.length}
            </span>
          )}
          {open ? <ChevronUp size={11} className="text-tx-body" /> : <ChevronDown size={11} className="text-tx-body" />}
        </div>
      </button>

      {open && (
        <div className="pb-2 px-1 space-y-0.5 max-h-44 overflow-y-auto">
          {options.map(opt => (
            <label
              key={opt}
              className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-s2 transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="w-3 h-3 flex-shrink-0 cursor-pointer"
              />
              <span className={`text-[11px] truncate ${
                selected.includes(opt) ? 'text-tx-strong font-medium' : 'text-tx-body'
              }`}>
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
