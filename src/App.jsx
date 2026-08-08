import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { FilterProvider } from './context/FilterContext'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/Dashboard'
import OnboardingTrackerPage from './components/OnboardingTrackerPage'
import { BarChart2, ClipboardList } from 'lucide-react'

function NavTabs({ page, setPage }) {
  const tabs = [
    { id: 'dashboard', label: 'Workforce Dashboard', icon: BarChart2 },
    { id: 'tracker',   label: 'Onboarding Tracker',  icon: ClipboardList },
  ]
  return (
    <div className="flex items-center gap-1 px-5 border-b border-[var(--border)] bg-surface flex-shrink-0">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setPage(t.id)}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
            page === t.id
              ? 'border-brand text-brand'
              : 'border-transparent text-tx-body hover:text-tx-strong'
          }`}
        >
          <t.icon size={13} />
          {t.label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <ThemeProvider>
      <FilterProvider>
        <div className="flex h-screen bg-canvas text-tx-body overflow-hidden">
          {/* Sidebar only shown on dashboard page */}
          {page === 'dashboard' && <Sidebar />}

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header />
            <NavTabs page={page} setPage={setPage} />
            <main className="flex-1 overflow-y-auto p-5">
              {page === 'dashboard'
                ? <Dashboard />
                : <OnboardingTrackerPage />
              }
            </main>
          </div>
        </div>
      </FilterProvider>
    </ThemeProvider>
  )
}
