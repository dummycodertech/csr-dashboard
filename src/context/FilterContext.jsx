import { createContext, useContext, useState, useMemo } from 'react'
import { employees as allEmployees } from '../data/employees'

const FilterContext = createContext(null)

const EMPTY = {
  gender: [],
  type: [],
  age_group: [],
  business: [],
  region: [],
  state: [],
  location: [],
  project: [],
  role: [],
  retiring_in_3_years: [],
}

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(EMPTY)

  const filteredData = useMemo(() => {
    const entries = Object.entries(filters)
    // fast path: no filters active
    if (entries.every(([, v]) => v.length === 0)) return allEmployees
    return allEmployees.filter(emp => {
      for (const [key, values] of entries) {
        if (values.length > 0 && !values.includes(emp[key])) return false
      }
      return true
    })
  }, [filters])

  const activeFilterCount = useMemo(
    () => Object.values(filters).reduce((n, arr) => n + arr.length, 0),
    [filters]
  )

  const setFilter = (key, values) => setFilters(prev => ({ ...prev, [key]: values }))
  const clearAllFilters = () => setFilters(EMPTY)

  return (
    <FilterContext.Provider value={{
      filters,
      setFilter,
      clearAllFilters,
      filteredData,
      totalData: allEmployees,
      activeFilterCount,
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilters = () => useContext(FilterContext)
