import { useFilters } from '../../context/FilterContext'
import { X } from 'lucide-react'

const LABELS = {
  gender: 'Gender', type: 'Type', age_group: 'Age',
  business: 'BU', region: 'Region', state: 'State',
  location: 'Location', project: 'Project', role: 'Role',
  retiring_in_3_years: 'Retiring',
}

export default function FilterBadges() {
  const { filters, setFilter, activeFilterCount } = useFilters()
  if (activeFilterCount === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 pt-0.5">
      {Object.entries(filters).flatMap(([key, values]) =>
        values.map(val => (
          <span
            key={`${key}::${val}`}
            className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-[11px] font-medium bg-brand/10 text-brand border border-brand/20"
          >
            <span className="text-tx-body text-[10px]">{LABELS[key]}:</span>
            <span>{val}</span>
            <button
              onClick={() => setFilter(key, values.filter(v => v !== val))}
              aria-label={`Remove ${val}`}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-danger/20 hover:text-danger transition-colors"
            >
              <X size={9} />
            </button>
          </span>
        ))
      )}
    </div>
  )
}
