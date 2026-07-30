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
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    const entries = Object.entries(filters)
    const lowerQuery = searchQuery.trim().toLowerCase()
    
    // fast path: no filters active and no search query
    if (entries.every(([, v]) => v.length === 0) && !lowerQuery) return allEmployees

    return allEmployees.filter(emp => {
      // 1. Check search query across relevant text fields
      if (lowerQuery) {
        const matchesSearch = [
          emp.name, emp.ecode, emp.location, emp.project, 
          emp.role, emp.business, emp.state, emp.region
        ].some(val => val && val.toString().toLowerCase().includes(lowerQuery))
        
        if (!matchesSearch) return false
      }

      // 2. Check sidebar filters
      for (const [key, values] of entries) {
        if (values.length > 0 && !values.includes(emp[key])) return false
      }
      return true
    })
  }, [filters, searchQuery])

  const activeFilterCount = useMemo(
    () => Object.values(filters).reduce((n, arr) => n + arr.length, 0),
    [filters]
  )

  const setFilter = (key, values) => setFilters(prev => ({ ...prev, [key]: values }))
  const clearAllFilters = () => {
    setFilters(EMPTY)
    setSearchQuery('')
  }

  return (
    <FilterContext.Provider value={{
      filters,
      setFilter,
      clearAllFilters,
      filteredData,
      totalData: allEmployees,
      activeFilterCount,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilters = () => useContext(FilterContext)
